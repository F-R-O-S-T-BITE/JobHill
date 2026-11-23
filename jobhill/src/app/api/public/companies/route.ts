// src/app/api/public/companies/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { fetchAllRows } from '@/utils/supabase/fetchAllRows';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createClient();

    // Paginado: hay más de 4,500 empresas y Supabase corta en 2500 filas
    const { data: companies, error } = await fetchAllRows<{ id: number; name: string; logo_url: string | null }>(
      (withCount) =>
        supabase
          .from('companies')
          .select('id, name, logo_url', withCount ? { count: 'exact' } : undefined)
          .order('name')
          .order('id')
    );

    if (error) {
      console.error('Error fetching companies:', error);
      return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
    }

    return NextResponse.json({ 
      companies: companies || [],
      success: true 
    });

  } catch (error) {
    console.error('Error in companies API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}