'use client'

import { useMemo } from 'react';
import { useJobOffers } from './useJobOffers';
import type { JobOfferResponse } from '@/interfaces/JobOffer';

export interface CompanyLogo {
  id: string;
  name: string;
  logo_url: string;
}

export interface JobStats {
  newInternRoles: number;
  newDataMLPositions: number;
  newSWEPositions: number;
  totalOpportunities: number;
}

const defaultLogos: CompanyLogo[] = [
  { id: 'marchingant1', name: 'MarchingAnt', logo_url: '/resources/ants/AntMarch.png' },
  { id: 'marchingant2', name: 'MarchingAnt2', logo_url: '/resources/ants/AntMarch.png' },
  { id: 'marchingant3', name: 'MarchingAnt3', logo_url: '/resources/ants/AntMarch.png' },
  { id: 'marchingant4', name: 'MarchingAnt4', logo_url: '/resources/ants/AntMarch.png' },
  { id: 'marchingant5', name: 'MarchingAnt5', logo_url: '/resources/ants/AntMarch.png' },
  { id: 'marchingant6', name: 'MarchingAnt6', logo_url: '/resources/ants/AntMarch.png' }
];

const defaultStats: JobStats = {
  newInternRoles: 1230,
  newDataMLPositions: 463,
  newSWEPositions: 828,
  totalOpportunities: 13000
};

export function useLandingData() {
  const { data: jobOffersData, isLoading } = useJobOffers();

  const companyLogos = useMemo((): CompanyLogo[] => {
    if (!jobOffersData?.jobs) return defaultLogos;

    // Get recent companies (last 4 days)
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const recentCompanies = jobOffersData.jobs
      .filter((job: JobOfferResponse) => {
        const jobDate = new Date(job.created_at);
        return jobDate >= fourDaysAgo && job.company?.logo_url;
      })
      .map((job: JobOfferResponse) => ({
        id: job.company!.id.toString(),
        name: job.company!.name,
        logo_url: job.company!.logo_url
      }))
      // Remove duplicates by company name
      .filter((company, index, self) => 
        self.findIndex(c => c.name === company.name) === index
      )
      .slice(0, 20); // Limit to 20 companies

    if (recentCompanies.length >= 5) {
      return recentCompanies;
    }

    // Mix recent companies with defaults if we don't have enough
    const combinedLogos = [...recentCompanies];
    for (const defaultLogo of defaultLogos) {
      if (combinedLogos.length >= 7) break;
      if (!combinedLogos.some(logo => logo.name === defaultLogo.name)) {
        combinedLogos.push(defaultLogo);
      }
    }

    return combinedLogos;
  }, [jobOffersData?.jobs]);

  const jobStats = useMemo((): JobStats => {
    if (!jobOffersData?.jobs) return defaultStats;

    const jobs = jobOffersData.jobs;
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weeklyJobs = jobs.filter((job: JobOfferResponse) => {
      const jobDate = new Date(job.created_at);
      return jobDate >= lastWeek;
    });

    const newInternRoles = weeklyJobs.length;

    const newDataMLPositions = weeklyJobs.filter((job: JobOfferResponse) => 
      job.categories && (
        job.categories.includes('AI & ML') || 
        job.categories.includes('Data & Analytics')
      )
    ).length;

    const newSWEPositions = weeklyJobs.filter((job: JobOfferResponse) => 
      job.categories && job.categories.includes('SWE')
    ).length;

    return {
      newInternRoles,
      newDataMLPositions,
      newSWEPositions,
      totalOpportunities: jobs.length
    };
  }, [jobOffersData?.jobs]);

  return {
    companyLogos,
    jobStats,
    isLoading
  };
}