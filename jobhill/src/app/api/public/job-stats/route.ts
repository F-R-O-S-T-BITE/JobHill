// src/app/api/public/job-stats/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Días que cuenta como "nuevos" la landing: los últimos 7 días, incluido hoy */
const NEW_WINDOW_DAYS = 7
/** Días hacia atrás para elegir los logos de empresas recientes */
const LOGO_WINDOW_DAYS = 4
const MAX_LOGOS = 20

/** Fecha (YYYY-MM-DD, UTC) de hace `days` días; created_at es una columna date */
function daysAgo(days: number) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

/**
 * Números de la landing. Se calculan aquí con conteos de Supabase, sin sesión,
 * para que sean iguales para todos: antes salían de la lista de Opportunities,
 * que con sesión ya viene sin aplicadas, ocultas y lo que quitan las preferencias.
 */
export async function GET() {
  try {
    // Cliente anónimo: no depende de la sesión y la respuesta se puede cachear
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    const since = daysAgo(NEW_WINDOW_DAYS - 1)
    const open = () =>
      supabase.from('job_offers').select('id', { count: 'exact', head: true }).eq('status', 'Open')
    const openSince = () => open().gte('created_at', since)

    const [total, interns, newGrads, swe, recent] = await Promise.all([
      open(),
      // Internships y Emerging Talent: todo lo que no es New Grad
      openSince().or('newGrad.is.null,newGrad.neq.1'),
      openSince().eq('newGrad', 1),
      openSince().contains('categories', ['SWE']),
      supabase
        .from('job_offers')
        .select('created_at, company:companies(id, name, logo_url)')
        .eq('status', 'Open')
        .gte('created_at', daysAgo(LOGO_WINDOW_DAYS))
        .order('created_at', { ascending: false })
        .limit(500),
    ])

    const failed = [total, interns, newGrads, swe, recent].find((r) => r.error)
    if (failed) {
      console.error('Error fetching job stats:', failed.error)
      return NextResponse.json({ error: 'Failed to fetch job stats' }, { status: 500 })
    }

    const seen = new Set<string>()
    const companyLogos: { id: string; name: string; logo_url: string }[] = []
    for (const row of (recent.data ?? []) as unknown as {
      company: { id: number; name: string; logo_url: string | null } | null
    }[]) {
      const company = row.company
      if (!company?.logo_url || seen.has(company.name)) continue
      seen.add(company.name)
      companyLogos.push({ id: String(company.id), name: company.name, logo_url: company.logo_url })
      if (companyLogos.length >= MAX_LOGOS) break
    }

    return NextResponse.json(
      {
        success: true,
        total: total.count ?? 0,
        stats: {
          newInternRoles: interns.count ?? 0,
          newGradRoles: newGrads.count ?? 0,
          newSWEPositions: swe.count ?? 0,
          totalOpportunities: total.count ?? 0,
        },
        companyLogos,
      },
      // Es igual para todos: Vercel la guarda 10 minutos en su CDN
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } }
    )
  } catch (error) {
    console.error('Error in job stats API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
