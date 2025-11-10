// src/app/api/public/companies/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: companies, error } = await supabase
      .from('companies')
      .select('id, name, logo_url')
      .order('name');

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