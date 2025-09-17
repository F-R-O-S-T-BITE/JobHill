import type { UserPreferences } from '@/hooks/useUserPreferences';

export async function getUserPreferences(supabase: any, userId: string) {
  const { data: preferences, error: preferencesError } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (preferencesError && preferencesError.code !== 'PGRST116') {
    console.error('Error fetching user preferences:', preferencesError);
    return { preferences: null, error: preferencesError };
  }

  const userPreferences: UserPreferences = preferences || {
    user_id: userId,
    hidden_jobs: [],
    hidden_companies: [],
    preferred_companies: [],
    preferred_categories: [],
    favorite_jobs: [],
    requires_sponsorship: false,
    american_citizen: false,
    dont_show_conf_hide: false,
    hide_et: false,
    hide_ng: false,
    hide_internships: false
  };

  return { preferences: userPreferences, error: null };
}