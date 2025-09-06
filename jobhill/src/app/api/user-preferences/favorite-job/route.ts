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

    // Check if user_preferences exists
    const { data: existingPrefs, error: fetchError } = await supabase
      .from('user_preferences')
      .select('favorite_jobs')
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user preferences:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch user preferences' },
        { status: 500 }
      )
    }

    const currentFavoriteJobs = existingPrefs?.favorite_jobs || []

    // Add job_id if not already favorited
    if (!currentFavoriteJobs.includes(job_id)) {
      const updatedFavoriteJobs = [...currentFavoriteJobs, job_id]

      if (existingPrefs) {
        // Update existing preferences
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({ favorite_jobs: updatedFavoriteJobs })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Error updating user preferences:', updateError)
          return NextResponse.json(
            { error: 'Failed to favorite job' },
            { status: 500 }
          )
        }
      } else {
        // Create new preferences row
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            favorite_jobs: updatedFavoriteJobs
          })

        if (insertError) {
          console.error('Error creating user preferences:', insertError)
          return NextResponse.json(
            { error: 'Failed to favorite job' },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json(
      { success: true, message: 'Job favorited successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error favoriting job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    // Get current favorite jobs
    const { data: existingPrefs, error: fetchError } = await supabase
      .from('user_preferences')
      .select('favorite_jobs')
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching user preferences:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch user preferences' },
        { status: 500 }
      )
    }

    // Remove job_id from favorite jobs array
    const currentFavoriteJobs = existingPrefs?.favorite_jobs || []
    const updatedFavoriteJobs = currentFavoriteJobs.filter((id: string) => id !== job_id)

    // Update preferences
    const { error: updateError } = await supabase
      .from('user_preferences')
      .update({ favorite_jobs: updatedFavoriteJobs })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating user preferences:', updateError)
      return NextResponse.json(
        { error: 'Failed to unfavorite job' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Job unfavorited successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error unfavoriting job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}