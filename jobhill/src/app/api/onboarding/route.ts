import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { OnboardingData } from '@/interfaces/JobOffer';

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
      typeof onboardingData.hide_not_american !== 'boolean'
    ) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
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
      dont_show_conf_hide: true, 
      hidden_jobs: [],
      hidden_companies: [],
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