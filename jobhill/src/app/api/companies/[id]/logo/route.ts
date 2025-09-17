// src/app/api/companies/[id]/logo/route.ts
import { createClient } from '@/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { logo_url } = await request.json();
    const { id } = await params;

    console.log('Starting logo update for company:', id);
    console.log('New logo URL:', logo_url);

    if (!logo_url) {
      return NextResponse.json({ error: 'logo_url is required' }, { status: 400 });
    }

    const companyId = parseInt(id);
    if (isNaN(companyId)) {
      return NextResponse.json({ error: 'Invalid company ID' }, { status: 400 });
    }

    // Create Supabase client with service role for admin operations that bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // This appears to be a service role key

    console.log('Using direct Supabase client with service role for admin operation');
    console.log('Service key starts with:', supabaseServiceKey.substring(0, 20) + '...');

    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // First, let's check if the company exists and log all columns
    const { data: existingCompany, error: fetchError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .maybeSingle();

    console.log('Company lookup result:', {
      existingCompany: existingCompany ? {
        id: existingCompany.id,
        name: existingCompany.name,
        logo_url: existingCompany.logo_url,
        allColumns: Object.keys(existingCompany)
      } : null,
      fetchError,
      companyId,
      companyIdType: typeof companyId
    });

    if (fetchError) {
      console.error('Error fetching company:', fetchError);
      return NextResponse.json({ error: 'Database error while fetching company' }, { status: 500 });
    }

    if (!existingCompany) {
      // Let's also try to check what companies exist around this ID
      const { data: nearbyCompanies } = await supabase
        .from('companies')
        .select('id, name')
        .gte('id', companyId - 5)
        .lte('id', companyId + 5)
        .order('id');

      console.log('Nearby companies:', nearbyCompanies);
      return NextResponse.json({ error: 'Company not found', nearby: nearbyCompanies }, { status: 404 });
    }

    // Try update without select first
    const { error: updateError, count, status, statusText } = await supabase
      .from('companies')
      .update({ logo_url })
      .eq('id', companyId);

    console.log('Direct update result:', {
      updateError,
      count,
      status,
      statusText,
      updatePayload: { logo_url },
      whereClause: { id: companyId }
    });

    if (updateError) {
      console.error('Error updating company logo:', updateError);
      return NextResponse.json({ error: 'Failed to update company logo' }, { status: 500 });
    }

    // Now fetch the updated company to confirm the change
    const { data: updatedCompany, error: postUpdateError } = await supabase
      .from('companies')
      .select('id, name, logo_url')
      .eq('id', companyId)
      .single();

    console.log('Post-update company data:', { updatedCompany, postUpdateError });

    if (postUpdateError) {
      console.error('Error fetching updated company:', postUpdateError);
      return NextResponse.json({ error: 'Update may have failed - cannot fetch updated data' }, { status: 500 });
    }

    // Check if the logo was actually updated
    if (updatedCompany.logo_url !== logo_url) {
      console.warn('Logo URL was not updated:', {
        expected: logo_url,
        actual: updatedCompany.logo_url
      });
      return NextResponse.json({
        error: 'Logo update failed - RLS policy or permission issue',
        details: 'The update operation completed but the logo URL was not changed'
      }, { status: 403 });
    }

    console.log('Logo updated successfully:', updatedCompany);
    return NextResponse.json({ success: true, company: updatedCompany });
  } catch (error) {
    console.error('Error in company logo update API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}