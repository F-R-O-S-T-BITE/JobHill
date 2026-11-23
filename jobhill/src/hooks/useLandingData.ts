'use client'

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface CompanyLogo {
  id: string;
  name: string;
  logo_url: string;
}

export interface JobStats {
  newInternRoles: number;
  newGradRoles: number;
  newSWEPositions: number;
  totalOpportunities: number;
}

interface LandingStatsResponse {
  stats: JobStats;
  companyLogos: CompanyLogo[];
}

const defaultLogos: CompanyLogo[] = [
  { id: 'marchingant1', name: 'MarchingAnt', logo_url: '' },
  { id: 'marchingant2', name: 'MarchingAnt2', logo_url: '' },
  { id: 'marchingant3', name: 'MarchingAnt3', logo_url: '' },
  { id: 'marchingant4', name: 'MarchingAnt4', logo_url: '' },
  { id: 'marchingant5', name: 'MarchingAnt5', logo_url: '' },
  { id: 'marchingant6', name: 'MarchingAnt6', logo_url: '' }
];

const defaultStats: JobStats = {
  newInternRoles: 1230,
  newGradRoles: 120,
  newSWEPositions: 828,
  totalOpportunities: 13000
};

async function fetchLandingStats(): Promise<LandingStatsResponse> {
  const response = await fetch('/api/public/job-stats');
  if (!response.ok) {
    throw new Error(`Failed to fetch landing stats (${response.status})`);
  }
  return response.json();
}

/**
 * Números y logos de la landing. Vienen de /api/public/job-stats, que cuenta en el
 * servidor sin sesión: así son iguales para todos y no dependen de lo que cada
 * usuario tenga oculto o filtrado en Opportunities.
 */
export function useLandingData() {
  const { data, isLoading } = useQuery({
    queryKey: ['landing-stats'],
    queryFn: fetchLandingStats,
    staleTime: 10 * 60 * 1000,
  });

  const companyLogos = useMemo((): CompanyLogo[] => {
    const recentCompanies = data?.companyLogos;
    if (!recentCompanies) return defaultLogos;
    if (recentCompanies.length >= 5) return recentCompanies;

    // Si hay pocas empresas recientes, se completan con las hormigas
    const combinedLogos = [...recentCompanies];
    for (const defaultLogo of defaultLogos) {
      if (combinedLogos.length >= 7) break;
      combinedLogos.push(defaultLogo);
    }
    return combinedLogos;
  }, [data?.companyLogos]);

  return {
    companyLogos,
    jobStats: data?.stats ?? defaultStats,
    isLoading
  };
}
