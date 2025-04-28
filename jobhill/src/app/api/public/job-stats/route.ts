// src/app/api/public/job-stats/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Obtenemos la fecha de hace una semana
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekStr = lastWeek.toISOString();
    
    // Obtenemos todos los trabajos en la última semana
    const { data: weeklyJobs, error: weeklyError } = await supabase
      .from('job_offers')
      .select('id, categories')
      .gte('created_at', lastWeekStr)
      .eq('status', 'Open');
    
    if (weeklyError) {
      console.error('Error fetching weekly jobs:', weeklyError);
      return NextResponse.json({ error: 'Failed to fetch weekly jobs' }, { status: 500 });
    }
    
    // Obtenemos el total de oportunidades abiertas
    const { count: totalCount, error: totalError } = await supabase
      .from('job_offers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Open');
    
    if (totalError) {
      console.error('Error fetching total opportunities:', totalError);
      return NextResponse.json({ error: 'Failed to fetch total opportunities' }, { status: 500 });
    }
    
        // Como mencionaste que todos son intern roles, contamos el total de ofertas semanales
    const internRoles = weeklyJobs.length;
    
    // Contamos por categorías específicas usando los arrays
    const dataMLPositions = weeklyJobs.filter(job => 
      job.categories && (
        job.categories.includes('AI & ML') || 
        job.categories.includes('Data & Analytics')
      )
    ).length;
    
    const swePositions = weeklyJobs.filter(job => 
      job.categories && job.categories.includes('SWE')
    ).length;
    
    return NextResponse.json({
      stats: {
        newInternRoles: internRoles,
        newDataMLPositions: dataMLPositions,
        newSWEPositions: swePositions,
        totalOpportunities: totalCount || 0
      }
    });
  } catch (error) {
    console.error('Error in job stats API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}