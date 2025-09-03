import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { 
  JobOfferResponse
} from '@/interfaces/JobOffer';

export const revalidate = 21600; // 6 horas 

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

  const jobOffers: JobOfferResponse[] = data.map((job: any) => ({
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
  // Get user preferences
  const { data: preferences, error: preferencesError } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (preferencesError && preferencesError.code !== 'PGRST116') {
    console.error('Error fetching user preferences:', preferencesError);
    return NextResponse.json({ error: 'Failed to fetch user preferences' }, { status: 500 });
  }

  // Get user's applications to exclude applied jobs
  // TODO: When we create a useApplications hook, we should use that instead 
  // to avoid duplicate calls due to RLS policies
  const { data: applications, error: applicationsError } = await supabase
    .from('applications')
    .select('job_offer_id')
    .eq('user_id', userId);

  if (applicationsError) {
    console.error('Error fetching user applications:', applicationsError);
    return NextResponse.json({ error: 'Failed to fetch user applications' }, { status: 500 });
  }

  const appliedJobIds = applications.map((app: any) => app.job_offer_id);

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
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching filtered jobs for user:', error);
    return NextResponse.json({ error: 'Failed to fetch job offers' }, { status: 500 });
  }

  // Process jobs with user-specific data and custom sorting
  const jobOffers: JobOfferResponse[] = data.map((job: any) => {
    let preferenceScore = 0;
    
    if (preferences) {
      // Higher score for preferred companies
      if (preferences.preferred_companies?.includes(job.company.name)) {
        preferenceScore += 100;
      }
      
      // Higher score for preferred categories
      if (preferences.preferred_categories && job.categories) {
        const matchingCategories = job.categories.filter((cat: string) => 
          preferences.preferred_categories.includes(cat)
        ).length;
        preferenceScore += matchingCategories * 50;
      }
    }

    return {
      ...job,
      is_applied: appliedJobIds.includes(job.id),
      is_favorite: false, // TODO: Add favorites functionality
      preference_score: preferenceScore,
    };
  });

  // Sort by preference score (descending), then by created_at (descending)
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
