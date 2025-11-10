export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserPreferences } from '@/utils/userPreferencesUtils';
import { getUserAppliedJobIds } from '@/utils/applicationsUtils';
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

  let query = supabase
    .from('job_offers')
    .select(`
      *,
      company:companies(id, name, logo_url)
    `)
    .in('company_id', companyIds)
    .eq('status', 'Open');

  if (appliedJobIds.length > 0) {
    query = query.not('id', 'in', `(${appliedJobIds.join(',')})`);
  }

  // Apply user preference filters
  if (preferences) {
    if (preferences.hidden_jobs && preferences.hidden_jobs.length > 0) {
      query = query.not('id', 'in', `(${preferences.hidden_jobs.join(',')})`);
    }

    if (preferences.requires_sponsorship === false) {
      query = query.neq('noSponsor', 1);
    }

    if (preferences.american_citizen === false) {
      query = query.neq('usaCitizen', 1);
    }

    if (preferences.hideNG === true) {
      query = query.neq('newGrad', 1);
    }

    if (preferences.hideET === true) {
      query = query.neq('emergingTalent', 1);
    }

    if (preferences.hideInternships === true) {
      query = query.not('and', '(newGrad.eq.0,emergingTalent.eq.0)');
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs for companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs for companies' },
      { status: 500 }
    );
  }

  const jobOffers: JobOfferResponse[] = (data || [])
    .filter((job: any) => job.company)
    .map((job: any) => {
      let preferenceScore = 0;

      if (preferences) {
        if (preferences.preferred_companies?.includes(job.company_id)) {
          preferenceScore += 15;
        }

        if (preferences.preferred_categories && job.categories) {
          const matchingCategories = job.categories.filter((cat: string) =>
            preferences.preferred_categories.includes(cat)
          ).length;
          if (matchingCategories > 0) {
            preferenceScore += matchingCategories * 10;
          }
        }
      }

      return {
        ...job,
        is_applied: appliedJobIds.includes(job.id),
        is_favorite: preferences?.favorite_jobs?.includes(job.id) || false,
        preference_score: preferenceScore,
      };
    });

  jobOffers.sort((a, b) => {
    const aScore = a.preference_score || 0;
    const bScore = b.preference_score || 0;
    if (aScore !== bScore) {
      return bScore - aScore;
    }
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
  const { data, error, count } = await supabase
    .from('job_offers')
    .select(`
      *,
      company:companies(id, name, logo_url)
    `, { count: 'exact' })
    .eq('status', 'Open')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch job offers' }, { status: 500 });
  }

  const jobOffers: JobOfferResponse[] = data
    .filter((job: any) => job.company) // Filter out jobs without company data
    .map((job: any) => ({
      ...job,
      is_applied: false,
      is_favorite: false,
      preference_score: 0,
    }));

  return NextResponse.json({
    jobs: jobOffers,
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

  let query = supabase
    .from('job_offers')
    .select(`
      *,
      company:companies(id, name, logo_url)
    `, { count: 'exact' })
    .eq('status', 'Open');

  // Filter out jobs user has applied to
  if (appliedJobIds.length > 0) {
    query = query.not('id', 'in', `(${appliedJobIds.join(',')})`);
  }

  // Apply user preference filters
  if (preferences) {
    // Filter out hidden jobs
    if (preferences.hidden_jobs && preferences.hidden_jobs.length > 0) {
      query = query.not('id', 'in', `(${preferences.hidden_jobs.join(',')})`);
    }

    // Filter out hidden companies
    if (preferences.hidden_companies && preferences.hidden_companies.length > 0) {
      query = query.not('company_id', 'in', `(${preferences.hidden_companies.join(',')})`);
    }

    // Filter based on sponsorship requirements
    if (preferences.requires_sponsorship === false) {
      query = query.neq('noSponsor', 1);
    }

    // Filter based on citizenship
    if (preferences.american_citizen === false) {
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
      query = query.not('and', '(newGrad.eq.0,emergingTalent.eq.0)');
    }
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching filtered jobs for user:', error);
    return NextResponse.json({ error: 'Failed to fetch job offers' }, { status: 500 });
  }

  const jobOffers: JobOfferResponse[] = data
    .filter((job: any) => job.company) // Filter out jobs without company data
    .map((job: any) => {
      let preferenceScore = 0;

      if (preferences) {
        if (preferences.preferred_companies?.includes(job.company_id)) {
          preferenceScore += 15;
        }

        if (preferences.preferred_categories && job.categories) {
          const matchingCategories = job.categories.filter((cat: string) =>
            preferences.preferred_categories.includes(cat)
          ).length;
          if (matchingCategories > 0) {
            preferenceScore += matchingCategories * 10;
          }
        }
      }

    return {
      ...job,
      is_applied: appliedJobIds.includes(job.id),
      is_favorite: preferences?.favorite_jobs?.includes(job.id) || false,
      preference_score: preferenceScore,
    };
  });

  jobOffers.sort((a, b) => {
    const aScore = a.preference_score || 0;
    const bScore = b.preference_score || 0;
    if (aScore !== bScore) {
      return bScore - aScore;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });


  return NextResponse.json({
    jobs: jobOffers,
    total: count || 0,
    userPreferences: preferences,
  });
}

async function getHiddenJobsForUser(supabase: any, hiddenJobIds: string[]) {
  const { data: jobOffers, error } = await supabase
    .from('job_offers')
    .select(`
      *,
      company:companies(id, name, logo_url)
    `)
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


