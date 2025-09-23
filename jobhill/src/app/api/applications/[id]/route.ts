import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const { data: existingApp, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingApp) {
      return NextResponse.json(
        { error: 'Application not found or unauthorized' },
        { status: 404 }
      )
    }

    const { data: updatedApplication, error: updateError } = await supabase
      .from('applications')
      .update({
        status,
        last_updated: new Date().toISOString().split('T')[0]
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating application:', updateError)
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication
    })

  } catch (error) {
    console.error('Error in application PATCH API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    const { data: existingApp, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingApp) {
      return NextResponse.json(
        { error: 'Application not found or unauthorized' },
        { status: 404 }
      )
    }

    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting application:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete application' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully'
    })

  } catch (error) {
    console.error('Error in application DELETE API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}