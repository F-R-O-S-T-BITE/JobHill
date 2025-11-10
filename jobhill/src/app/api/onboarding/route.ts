import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { OnboardingData, Company } from '@/interfaces/JobOffer';

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const onboardingData: OnboardingData = await request.json();

   // Validate required fields
    if (
      !Array.isArray(onboardingData.preferred_companies) ||
      !Array.isArray(onboardingData.preferred_categories) ||
      !Array.isArray(onboardingData.hidden_companies) ||
      typeof onboardingData.hide_not_sponsor !== 'boolean' ||
      typeof onboardingData.hide_not_american !== 'boolean' ||
      typeof onboardingData.hideNG !== 'boolean' ||
      typeof onboardingData.hideET !== 'boolean' ||
      typeof onboardingData.hideInternships !== 'boolean'
    ) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Validate that company arrays contain numbers
    if (
      !onboardingData.preferred_companies.every(id => typeof id === 'number') ||
      !onboardingData.hidden_companies.every(id => typeof id === 'number')
    ) {
      return NextResponse.json({ error: 'Company IDs must be numbers' }, { status: 400 });
    }

    // Check if user preferences already exist
    const { data: existingPrefs, error: fetchError } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing preferences:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const preferencesData = {
      user_id: user.id,
      preferred_companies: onboardingData.preferred_companies || [],
      preferred_categories: onboardingData.preferred_categories || [],
      requires_sponsorship: onboardingData.hide_not_sponsor,
      american_citizen: onboardingData.hide_not_american,
      hideNG: onboardingData.hideNG,
      hideET: onboardingData.hideET,
      hideInternships: onboardingData.hideInternships,
      dont_show_conf_hide: true,
      hidden_jobs: [],
      hidden_companies: onboardingData.hidden_companies || [],
      favorite_jobs: [],
    };

    let result;
    if (existingPrefs) {
      // Update existing preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .update({
          preferred_companies: preferencesData.preferred_companies,
          preferred_categories: preferencesData.preferred_categories,
          hidden_companies: preferencesData.hidden_companies,
          requires_sponsorship: preferencesData.requires_sponsorship,
          american_citizen: preferencesData.american_citizen,
          hideNG: preferencesData.hideNG,
          hideET: preferencesData.hideET,
          hideInternships: preferencesData.hideInternships,
          dont_show_conf_hide: true,
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user preferences:', error);
        return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
      }
      result = data;
    } else {
      // Create new preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .insert([preferencesData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user preferences:', error);
        return NextResponse.json({ error: 'Failed to create preferences' }, { status: 500 });
      }
      result = data;
    }

    return NextResponse.json({ 
      message: 'Onboarding completed successfully',
      preferences: result
    });

  } catch (error) {
    console.error('Error in onboarding API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    // Check for local storage data in header
    const localStorageData = request.headers.get('x-local-storage-data');
    if (localStorageData) {
      try {
        const parsedData = JSON.parse(localStorageData);
        // Validate the data matches our expected structure
        if (typeof parsedData.dont_show_conf_hide === 'boolean') {
          return NextResponse.json({
            hasCompletedOnboarding: parsedData.dont_show_conf_hide,
            needsOnboarding: !parsedData.dont_show_conf_hide
          });
        }
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }
    }


    // If no valid localStorage data, fetch from database
    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .select('dont_show_conf_hide')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching onboarding status:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const url = new URL(request.url);
    const fetchCompanies = url.searchParams.get('companies');
    
    if (fetchCompanies === 'true') {
      return await getCompanies(supabase);
    }

    const hasCompletedOnboarding = preferences?.dont_show_conf_hide === true;

    return NextResponse.json({
      hasCompletedOnboarding,
      needsOnboarding: !hasCompletedOnboarding
    });

  } catch (error) {
    console.error('Error in onboarding status API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getCompanies(supabase: any) {
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('id, name, logo_url')
      .order('name');

    if (error) {
      console.error('Error fetching companies:', error);
      return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
    }

    return NextResponse.json({ companies: companies || [] });
  } catch (error) {
    console.error('Error in getCompanies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}