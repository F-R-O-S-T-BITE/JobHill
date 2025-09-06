import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { job_id } = body

    if (!job_id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const { data: existingPrefs, error: fetchError } = await supabase
      .from('user_preferences')
      .select('hidden_jobs')
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { 
      console.error('Error fetching user preferences:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch user preferences' },
        { status: 500 }
      )
    }

    const currentHiddenJobs = existingPrefs?.hidden_jobs || []

    // Add job_id if not already hidden
    if (!currentHiddenJobs.includes(job_id)) {
      const updatedHiddenJobs = [...currentHiddenJobs, job_id]

      if (existingPrefs) {
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({ hidden_jobs: updatedHiddenJobs })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Error updating user preferences:', updateError)
          return NextResponse.json(
            { error: 'Failed to hide job' },
            { status: 500 }
          )
        }
      } else {
        // Create new preferences row
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            hidden_jobs: updatedHiddenJobs
          })

        if (insertError) {
          console.error('Error creating user preferences:', insertError)
          return NextResponse.json(
            { error: 'Failed to hide job' },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json(
      { success: true, message: 'Job hidden successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error hiding job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}