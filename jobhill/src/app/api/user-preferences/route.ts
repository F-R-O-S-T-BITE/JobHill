import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: preferences, error: fetchError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { 
      console.error('Error fetching user preferences:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch user preferences' },
        { status: 500 }
      )
    }


    const userPreferences = preferences || {
      user_id: user.id,
      hidden_jobs: [],
      hidden_companies: [],
      preferred_companies: [],
      preferred_categories: [],
      favorite_jobs: [], 
      requires_sponsorship: false,
      american_citizen: false,
      dont_show_conf_hide: false,
    }

    return NextResponse.json({
      preferences: userPreferences,
      success: true
    })

  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}