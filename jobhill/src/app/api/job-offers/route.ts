export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserPreferences } from '@/utils/userPreferencesUtils';
import { getUserAppliedJobIds } from '@/utils/applicationsUtils';
import { fetchAllRows } from '@/utils/supabase/fetchAllRows';

// Solo las columnas que usa la interfaz (antes era select *)
const JOB_COLUMNS =
  'id, company_id, job_title, location, modality, period, categories, created_at, application_link, ' +
  'noSponsor, usaCitizen, emergingTalent, newGrad, company:companies(id, name, logo_url)';

type CompanyInfo = { id: number; name: string; logo_url: string | null };

/**
 * Ofertas aplicadas, ocultas y de empresas ocultas se excluyen aquí y no en la consulta:
 * con `not in (...)` todos los ids viajaban en la URL y con cientos de ellos se pasaba
 * del límite de longitud. Ya traemos todas las páginas, así que filtrar en memoria es gratis.
 */
function buildExclusion(appliedJobIds: (string | number)[], preferences: any, includeHiddenCompanies: boolean) {
  const excludedJobIds = new Set<string>([
    ...appliedJobIds.map(String),
    ...((preferences?.hidden_jobs ?? []) as (string | number)[]).map(String),
  ]);
  const excludedCompanyIds = new Set<number>(
    includeHiddenCompanies ? ((preferences?.hidden_companies ?? []) as number[]) : []
  );
  return (job: { id: string | number; company_id: number }) =>
    !excludedJobIds.has(String(job.id)) && !excludedCompanyIds.has(job.company_id);
}

/**
 * Manda cada empresa una sola vez en vez de repetirla en cada oferta
 * (reduce ~25% el tamaño de la respuesta). El cliente vuelve a armar job.company.
 */
function splitCompanies<T extends { company?: CompanyInfo | null }>(jobs: T[]) {
  const companies: Record<number, CompanyInfo> = {};
  const slimJobs = jobs.map(({ company, ...job }) => {
    if (company) companies[company.id] = company;
    return job;
  });
  return { jobs: slimJobs, companies };
}
import type {
  JobOfferResponse
} from '@/interfaces/JobOffer';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return await getFilteredJobsForUser(supabase, user.id);
    } else {
      return await getPublicJobs(supabase);
    }
  } catch (error) {
    console.error('Error in job offers API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getJobsForCompanies(supabase: any, userId: string, companyIds: number[]) {
  const { preferences } = await getUserPreferences(supabase, userId);

  let appliedJobIds: number[] = [];
  try {
    appliedJobIds = await getUserAppliedJobIds(supabase, userId);
  } catch (error) {
    console.error('Error fetching applied job IDs:', error);
    return NextResponse.json({ error: 'Failed to fetch user applications' }, { status: 500 });
  }

  const buildQuery = (withCount: boolean) => {
    let query = supabase
      .from('job_offers')
      .select(JOB_COLUMNS, withCount ? { count: 'exact' } : undefined)
      .in('company_id', companyIds)
      .eq('status', 'Open');

    // Aplicadas y ocultas se excluyen después (ver buildExclusion)

    // Apply user preference filters
    if (preferences) {
      // requires_sponsorship = true -> el usuario pidió ocultar ofertas sin patrocinio de visa
      if (preferences.requires_sponsorship === true) {
        query = query.neq('noSponsor', 1);
      }

      // american_citizen = true -> el usuario pidió ocultar ofertas que exigen ciudadanía de EE. UU.
      if (preferences.american_citizen === true) {
        query = query.neq('usaCitizen', 1);
      }

      if (preferences.hideNG === true) {
        query = query.neq('newGrad', 1);
      }

      if (preferences.hideET === true) {
        query = query.neq('emergingTalent', 1);
      }

      if (preferences.hideInternships === true) {
        // Ocultar internships = mostrar solo New Grad o Emerging Talent
        query = query.or('newGrad.eq.1,emergingTalent.eq.1');
      }
    }

    return query.order('created_at', { ascending: false }).order('id', { ascending: true });
  };

  // Paginado: Supabase corta las respuestas en 2500 filas
  const { data, error } = await fetchAllRows<any>(buildQuery);

  if (error) {
    console.error('Error fetching jobs for companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs for companies' },
      { status: 500 }
    );
  }

  const isVisible = buildExclusion(appliedJobIds, preferences, false);

  const jobOffers: JobOfferResponse[] = (data || [])
    .filter((job: any) => job.company && isVisible(job))
    .map((job: any) => {
      // Calculate relevance tier
      const isPreferredCompany = preferences?.preferred_companies?.includes(job.company_id) || false;

      const matchingCategories = preferences?.preferred_categories && job.categories
        ? job.categories.filter((cat: string) => preferences.preferred_categories.includes(cat))
        : [];

      const hasMatchingCategory = matchingCategories.length > 0;

      // Determine tier: lower number = higher priority
      let relevanceTier = 3; // Default: no match
      if (isPreferredCompany && hasMatchingCategory) {
        relevanceTier = 1; // Best: preferred company + matching categories
      } else if (isPreferredCompany || hasMatchingCategory) {
        relevanceTier = 2; // Good: preferred company OR matching categories
      }

      // Solo se mandan los campos que aportan algo, para aligerar la respuesta:
      // las ofertas aplicadas ya se excluyen arriba y el tier 3 es el valor por defecto
      const result: JobOfferResponse = { ...job };
      if (relevanceTier !== 3) result.relevance_tier = relevanceTier;
      if (preferences?.favorite_jobs?.includes(job.id)) result.is_favorite = true;
      return result;
    });

  // Sort by tier first, then by date within each tier
  jobOffers.sort((a, b) => {
    // Sort by tier (lower tier number = higher priority)
    if (a.relevance_tier !== b.relevance_tier) {
      return (a.relevance_tier ?? 3) - (b.relevance_tier ?? 3);
    }

    // Within same tier, sort by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return NextResponse.json(jobOffers);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { hiddenJobIds, companyIds } = await request.json();

    if (hiddenJobIds && Array.isArray(hiddenJobIds) && hiddenJobIds.length > 0) {
      return await getHiddenJobsForUser(supabase, hiddenJobIds);
    }

    if (companyIds && Array.isArray(companyIds) && companyIds.length > 0) {
      return await getJobsForCompanies(supabase, user.id, companyIds);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error in hidden job offers endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// Fetch all open jobs for unauthenticated users 
async function getPublicJobs(supabase: any) {
  // Paginado: Supabase corta las respuestas en 2500 filas
  const { data, error, count } = await fetchAllRows<any>((withCount) =>
    supabase
      .from('job_offers')
      .select(JOB_COLUMNS, withCount ? { count: 'exact' } : undefined)
      .eq('status', 'Open')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
  );

  if (error) {
    console.error('Error fetching public jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch job offers' }, { status: 500 });
  }

  const jobOffers: JobOfferResponse[] = data
    .filter((job: any) => job.company) // Filter out jobs without company data
    .map((job: any) => job as JobOfferResponse);

  const { jobs, companies } = splitCompanies(jobOffers);

  return NextResponse.json({
    jobs,
    companies,
    total: count || 0,
  });
}

async function getFilteredJobsForUser(
  supabase: any,
  userId: string
) {
  const { preferences, error: preferencesError } = await getUserPreferences(supabase, userId);

  if (preferencesError) {
    return NextResponse.json({ error: 'Failed to fetch user preferences' }, { status: 500 });
  }

  let appliedJobIds: number[] = [];
  try {
    appliedJobIds = await getUserAppliedJobIds(supabase, userId);
  } catch (error) {
    console.error('Error fetching applied job IDs:', error);
    return NextResponse.json({ error: 'Failed to fetch user applications' }, { status: 500 });
  }

  const buildQuery = (withCount: boolean) => {
    let query = supabase
      .from('job_offers')
      .select(JOB_COLUMNS, withCount ? { count: 'exact' } : undefined)
      .eq('status', 'Open');

    // Aplicadas, ocultas y empresas ocultas se excluyen después (ver buildExclusion)

    // Apply user preference filters
    if (preferences) {
      // Filter based on sponsorship requirements
      // requires_sponsorship = true -> el usuario pidió ocultar ofertas sin patrocinio de visa
      if (preferences.requires_sponsorship === true) {
        query = query.neq('noSponsor', 1);
      }

      // Filter based on citizenship
      // american_citizen = true -> el usuario pidió ocultar ofertas que exigen ciudadanía de EE. UU.
      if (preferences.american_citizen === true) {
        query = query.neq('usaCitizen', 1);
      }

      // Filter based on role level preferences
      if (preferences.hideNG === true) {
        query = query.neq('newGrad', 1);
      }

      if (preferences.hideET === true) {
        query = query.neq('emergingTalent', 1);
      }

      if (preferences.hideInternships === true) {
        // Ocultar internships = mostrar solo New Grad o Emerging Talent
        query = query.or('newGrad.eq.1,emergingTalent.eq.1');
      }
    }

    // Orden estable para que la paginación no repita ni salte filas
    return query.order('created_at', { ascending: false }).order('id', { ascending: true });
  };

  // Paginado: Supabase corta las respuestas en 2500 filas
  const { data, error } = await fetchAllRows<any>(buildQuery);

  if (error) {
    console.error('Error fetching filtered jobs for user:', error);
    return NextResponse.json({ error: 'Failed to fetch job offers' }, { status: 500 });
  }

  const isVisible = buildExclusion(appliedJobIds, preferences, true);

  const jobOffers: JobOfferResponse[] = data
    .filter((job: any) => job.company && isVisible(job)) // sin empresa, aplicadas u ocultas
    .map((job: any) => {
      // Calculate relevance tier
      const isPreferredCompany = preferences?.preferred_companies?.includes(job.company_id) || false;

      const matchingCategories = preferences?.preferred_categories && job.categories
        ? job.categories.filter((cat: string) => preferences.preferred_categories.includes(cat))
        : [];

      const hasMatchingCategory = matchingCategories.length > 0;

      // Determine tier: lower number = higher priority
      let relevanceTier = 3; // Default: no match
      if (isPreferredCompany && hasMatchingCategory) {
        relevanceTier = 1; // Best: preferred company + matching categories
      } else if (isPreferredCompany || hasMatchingCategory) {
        relevanceTier = 2; // Good: preferred company OR matching categories
      }

      // Solo se mandan los campos que aportan algo, para aligerar la respuesta:
      // las ofertas aplicadas ya se excluyen arriba y el tier 3 es el valor por defecto
      const result: JobOfferResponse = { ...job };
      if (relevanceTier !== 3) result.relevance_tier = relevanceTier;
      if (preferences?.favorite_jobs?.includes(job.id)) result.is_favorite = true;
      return result;
    });

  // Sort by tier first, then by date within each tier
  jobOffers.sort((a, b) => {
    // Sort by tier (lower tier number = higher priority)
    if (a.relevance_tier !== b.relevance_tier) {
      return (a.relevance_tier ?? 3) - (b.relevance_tier ?? 3);
    }

    // Within same tier, sort by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });


  const { jobs, companies } = splitCompanies(jobOffers);

  return NextResponse.json({
    jobs,
    companies,
    total: jobs.length,
    userPreferences: preferences,
  });
}

async function getHiddenJobsForUser(supabase: any, hiddenJobIds: string[]) {
  const { data: jobOffers, error } = await supabase
    .from('job_offers')
    .select(JOB_COLUMNS)
    .in('id', hiddenJobIds)
    .eq('status', 'Open')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching hidden job offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hidden job offers' },
      { status: 500 }
    );
  }

  return NextResponse.json(jobOffers || []);
}


