// src/lib/data-fetchers.ts
import { createClient } from '@/utils/supabase/server';

export type CompanyLogo = {
  id: string;
  name: string;
  logo_url: string;
};

export type JobStats = {
  newInternRoles: number;
  newDataMLPositions: number;
  newSWEPositions: number;
  totalOpportunities: number;
};

/**
 * Obtiene los logos de las compañías que publicaron ofertas en las últimas 4 días
 */
export async function getRecentCompanyLogos(): Promise<CompanyLogo[]> {
  const supabase = await createClient();
  
  // Obtenemos la fecha de hace 4 días
  const fourDaysAgo = new Date();
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
  
  // Primero obtenemos los job_offers recientes
  const { data: jobOffers, error: jobOffersError } = await supabase
    .from('job_offers')
    .select('company_id')
    .gte('created_at', fourDaysAgo.toISOString()) // Filter by the last 4 days
    .order('created_at', { ascending: false }) // Prioritize the most recent offers
    .eq('status', 'Open');
  
  if (jobOffersError) {
    console.error('Error fetching recent job offers:', jobOffersError);
    return [];
  }
  
  // Extractamos los company_ids únicos
  const companyIds = [...new Set(jobOffers.map(offer => offer.company_id))];
  
  if (companyIds.length === 0) {
    return [];
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
    return [];
  }
  
  return data as CompanyLogo[];
}

/**
 * Obtiene estadísticas de trabajos de la última semana
 */
export async function getWeeklyJobStats(): Promise<JobStats> {
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
    return {
      newInternRoles: 0,
      newDataMLPositions: 0,
      newSWEPositions: 0,
      totalOpportunities: 0
    };
  }
  
  // Obtenemos el total de oportunidades abiertas
  const { count: totalCount, error: totalError } = await supabase
    .from('job_offers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Open');
  
  if (totalError) {
    console.error('Error fetching total opportunities:', totalError);
    return {
      newInternRoles: 0,
      newDataMLPositions: 0,
      newSWEPositions: 0,
      totalOpportunities: 0
    };
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
  
  return {
    newInternRoles: internRoles,
    newDataMLPositions: dataMLPositions,
    newSWEPositions: swePositions,
    totalOpportunities: totalCount || 0
  };
}