import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserPreferences } from '@/utils/userPreferencesUtils'

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

    const { preferences, error: preferencesError } = await getUserPreferences(supabase, user.id)

    if (preferencesError) {
      return NextResponse.json(
        { error: 'Failed to fetch user preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      preferences: preferences,
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
    const { action, field, value } = body

    // Validate request body
    if (!action || !field) {
      return NextResponse.json(
        { error: 'Action and field are required' },
        { status: 400 }
      )
    }

    const validFields = [
      'hidden_jobs', 'favorite_jobs', 'hidden_companies',
      'preferred_companies', 'preferred_categories',
      'requires_sponsorship', 'american_citizen', 'hide_internships', 'hide_ng', 'hide_et'
    ]

    if (!validFields.includes(field)) {
      return NextResponse.json(
        { error: `Invalid field. Must be one of: ${validFields.join(', ')}` },
        { status: 400 }
      )
    }

    const validActions = ['add', 'remove', 'set']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      )
    }

    const booleanFields = ['requires_sponsorship', 'american_citizen', 'hide_internships', 'hide_ng', 'hide_et']
    const isBooleanField = booleanFields.includes(field)

    if (isBooleanField) {
      if (action !== 'set') {
        return NextResponse.json(
          { error: 'Boolean fields only support "set" action' },
          { status: 400 }
        )
      }

      if (typeof value !== 'boolean') {
        return NextResponse.json(
          { error: 'Value must be a boolean for boolean fields' },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          [field]: value
        })

      if (updateError) {
        console.error('Error updating user preferences:', updateError)
        return NextResponse.json(
          { error: 'Failed to update user preferences' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Successfully updated ${field}`,
        [field]: value
      })
    }

    const { data: currentPrefs, error: fetchError } = await supabase
      .from('user_preferences')
      .select(field)
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user preferences:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch user preferences' },
        { status: 500 }
      )
    }

    const currentArray: any[] = Array.isArray(currentPrefs?.[field]) ? currentPrefs[field] : []
    let updatedArray: any[]

    switch (action) {
      case 'add':
        if (value === undefined || value === null) {
          return NextResponse.json(
            { error: 'Value is required for add action' },
            { status: 400 }
          )
        }
        updatedArray = currentArray.includes(value)
          ? currentArray
          : [...currentArray, value]
        break

      case 'remove':
        if (value === undefined || value === null) {
          return NextResponse.json(
            { error: 'Value is required for remove action' },
            { status: 400 }
          )
        }
        updatedArray = currentArray.filter((item: any) => item !== value)
        break

      case 'set':
        if (!Array.isArray(value)) {
          return NextResponse.json(
            { error: 'Value must be an array for set action' },
            { status: 400 }
          )
        }
        updatedArray = value
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const { error: updateError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        [field]: updatedArray
      })

    if (updateError) {
      console.error('Error updating user preferences:', updateError)
      return NextResponse.json(
        { error: 'Failed to update user preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${field}`,
      [field]: updatedArray
    })

  } catch (error) {
    console.error('Error in user preferences POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}