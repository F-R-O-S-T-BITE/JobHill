// src/app/api/public/job-stats/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: stats, error } = await supabase
      .from('job_offers')
      .select('status', { count: 'exact' })
      .eq('status', 'Open')

    if (error) {
      console.error('Error fetching job stats:', error)
      return NextResponse.json({ error: 'Failed to fetch job stats' }, { status: 500 })
    }

    return NextResponse.json({
      total: stats.length,
      success: true
    })

  } catch (error) {
    console.error('Error in job stats API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}