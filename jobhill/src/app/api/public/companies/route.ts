// src/app/api/public/companies/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Configuramos el revalidate para 4 horas
export const revalidate = 14400;

// Esta ruta API puede ser llamada por cualquier usuario, incluso sin autenticación
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Obtenemos la fecha de hace 24 horas
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Primero obtenemos los job_offers recientes
    const { data: jobOffers, error: jobOffersError } = await supabase
      .from('job_offers')
      .select('company_id')
      .gte('created_at', yesterday.toISOString())
      .eq('status', 'Open');
    
    if (jobOffersError) {
      console.error('Error fetching recent job offers:', jobOffersError);
      return NextResponse.json({ error: 'Failed to fetch job offers' }, { status: 500 });
    }
    
    // Extractamos los company_ids únicos
    const companyIds = [...new Set(jobOffers.map(offer => offer.company_id))];
    
    if (companyIds.length === 0) {
      return NextResponse.json({ companies: [] });
    }
    
    // Ahora obtenemos las compañías con esos IDs
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, logo_url')
      .in('id', companyIds)
      .not('logo_url', 'is', null)
      .limit(20);
    
    if (error) {
      console.error('Error fetching recent company logos:', error);
      return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
    }
    
    return NextResponse.json({ companies: data });
  } catch (error) {
    console.error('Error in companies API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}