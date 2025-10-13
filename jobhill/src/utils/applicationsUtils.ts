import type { SupabaseClient } from '@supabase/supabase-js';

export async function getUserAppliedJobIds(
  supabase: SupabaseClient,
  userId: string
): Promise<number[]> {
  const { data: applications, error } = await supabase
    .from('applications')
    .select('job_offer_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user applications:', error);
    throw new Error('Failed to fetch user applications');
  }

  return applications?.map((app: any) => app.job_offer_id) || [];
}
