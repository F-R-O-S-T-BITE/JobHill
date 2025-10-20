'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Application, ApplicationFilters, CreateApplicationData } from '@/interfaces/Application';

async function fetchAllUserApplications(): Promise<Application[]> {
  const response = await fetch('/api/applications');

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`);
  }

  return response.json();
}

async function updateApplicationStatus(applicationId: string, status: string): Promise<Application> {
  const response = await fetch(`/api/applications/${applicationId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update application status');
  }
  
  return response.json();
}

async function deleteApplication(applicationId: string): Promise<void> {
  const response = await fetch(`/api/applications/${applicationId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete application');
  }
}

const applicationsKeys = {
  all: ['applications'] as const,
  userApplications: () => [...applicationsKeys.all, 'user'] as const,
};

export function useUserApplications() {
  return useQuery({
    queryKey: applicationsKeys.userApplications(),
    queryFn: fetchAllUserApplications,
    staleTime: 6 * 60 * 60 * 1000, 
    placeholderData: (previousData) => previousData,
  });
}

export function useFilteredApplications(filters?: ApplicationFilters) {
  const { data: allApplications, ...rest } = useUserApplications();

  const filteredApplications = useMemo(() => {
    if (!allApplications || !filters) return allApplications;

    return allApplications.filter(app => {
      if (filters.company?.length && !filters.company.includes(app.company_name)) return false;
      if (filters.status && app.status !== filters.status) return false;
      if (filters.referral && app.referral_type !== filters.referral) return false;
      if (filters.location && app.location !== filters.location) return false;
      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.applied_date);
      const dateB = new Date(b.applied_date);
      return filters.order === 'oldest' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  }, [allApplications, filters]);

  return { data: filteredApplications, ...rest };
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: CreateApplicationData & {
      company_name: string;
      role: string;
      location: string;
      company_logo?: string;
      status?: string;
      applied_date?: string;
    }) => {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationsKeys.userApplications(),
      });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationsKeys.userApplications(),
      });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationsKeys.userApplications(),
      });
    },
  });
}

export { applicationsKeys };