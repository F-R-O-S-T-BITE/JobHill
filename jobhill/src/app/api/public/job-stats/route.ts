// src/app/api/public/job-stats/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()

    // Solo el conteo (head: true): no descarga filas y no se corta en 2500
    const { count, error } = await supabase
      .from('job_offers')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Open')

    if (error) {
      console.error('Error fetching job stats:', error)
      return NextResponse.json({ error: 'Failed to fetch job stats' }, { status: 500 })
    }

    return NextResponse.json({
      total: count ?? 0,
      success: true
    })

  } catch (error) {
    console.error('Error in job stats API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}