import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 21600; // 6 h 

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

    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select(`
        *,
        companies:company_id(logo_url)
      `)
      .eq('user_id', user.id)
      .order('applied_date', { ascending: false })

    if (fetchError) {
      console.error('Error fetching applications:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    const transformedApplications = applications?.map(app => ({
      ...app,
      company_logo: app.companies?.logo_url || null
    })) || []

    return NextResponse.json(transformedApplications)

  } catch (error) {
    console.error('Error in applications GET API:', error)
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
    const {
      job_offer_id,
      company_name,
      role,
      referral_type,
      application_link,
      location,
      company_id,
      status,
      applied_date
    } = body

    if (!job_offer_id || !company_name || !role || !referral_type) {
      return NextResponse.json(
        { error: 'Missing required fields: job_offer_id, company_name, role, referral_type' },
        { status: 400 }
      )
    }

    let finalCompanyId = company_id
    if (!finalCompanyId) {
      const { data: jobOffer, error: jobError } = await supabase
        .from('job_offers')
        .select('company_id')
        .eq('id', job_offer_id)
        .single()

      if (jobError) {
        console.error('Error fetching job offer:', jobError)
        return NextResponse.json(
          { error: 'Failed to find job offer' },
          { status: 404 }
        )
      }

      finalCompanyId = jobOffer.company_id
    }

    // Check if application already exists for this user and job
    const { data: existingApp, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('job_offer_id', job_offer_id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing application:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing applications' },
        { status: 500 }
      )
    }

    if (existingApp) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 409 } // Conflict
      )
    }

    // Create the application
    const { data: newApplication, error: insertError } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        job_offer_id: job_offer_id,
        company_id: finalCompanyId,
        company_name: company_name,
        role: role,
        referral_type: referral_type,
        application_link: application_link,
        location: location,
        status: status || 'Applied',
        applied_date: applied_date || new Date().toISOString().split('T')[0],
        last_updated: new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating application:', insertError)
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Application created successfully',
      application: newApplication
    }, { status: 201 })

  } catch (error) {
    console.error('Error in applications API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}