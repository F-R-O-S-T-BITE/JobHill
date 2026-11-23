// app/api/applications/bulk/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { APPLICATION_STATUSES } from '@/interfaces/Application'

const MAX_IDS = 500

type BulkBody =
  | { action: 'delete'; ids: string[] }
  | { action: 'update_status'; ids: string[]; status: string }

function parseIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const ids = [...new Set(value.filter((v): v is string => typeof v === 'string' && v.length > 0))]
  if (ids.length === 0 || ids.length > MAX_IDS) return null
  return ids
}

/**
 * Acciones en lote sobre las aplicaciones del usuario.
 * POST { action: 'delete', ids } | { action: 'update_status', ids, status }
 * Solo afecta filas cuyo user_id es el del usuario autenticado.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: Partial<BulkBody>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const ids = parseIds(body.ids)
    if (!ids) {
      return NextResponse.json(
        { error: `ids must be a non-empty array of up to ${MAX_IDS} application ids` },
        { status: 400 }
      )
    }

    if (body.action === 'delete') {
      const { data, error } = await supabase
        .from('applications')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id)
        .select('id')

      if (error) {
        console.error('Error bulk deleting applications:', error)
        return NextResponse.json({ error: 'Failed to delete applications' }, { status: 500 })
      }

      return NextResponse.json({ success: true, affectedIds: (data ?? []).map(row => row.id) })
    }

    if (body.action === 'update_status') {
      const status = (body as { status?: unknown }).status
      if (typeof status !== 'string' || !(APPLICATION_STATUSES as readonly string[]).includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }

      const lastUpdated = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('applications')
        .update({ status, last_updated: lastUpdated })
        .in('id', ids)
        .eq('user_id', user.id)
        .select('id')

      if (error) {
        console.error('Error bulk updating applications:', error)
        return NextResponse.json({ error: 'Failed to update applications' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        affectedIds: (data ?? []).map(row => row.id),
        status,
        last_updated: lastUpdated,
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Error in applications bulk API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
