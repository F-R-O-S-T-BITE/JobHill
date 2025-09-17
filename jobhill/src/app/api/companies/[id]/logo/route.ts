// src/app/api/companies/[id]/logo/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { logo_url } = await request.json();

    if (!logo_url) {
      return NextResponse.json({ error: 'logo_url is required' }, { status: 400 });
    }

    const companyId = parseInt(params.id);
    if (isNaN(companyId)) {
      return NextResponse.json({ error: 'Invalid company ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('companies')
      .update({ logo_url })
      .eq('id', companyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating company logo:', error);
      return NextResponse.json({ error: 'Failed to update company logo' }, { status: 500 });
    }

    return NextResponse.json({ success: true, company: data });
  } catch (error) {
    console.error('Error in company logo update API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}