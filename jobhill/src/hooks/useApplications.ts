'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Application, ApplicationFilters, CreateApplicationData } from '@/interfaces/Application';

async function fetchUserApplications(filters?: ApplicationFilters): Promise<Application[]> {
  const params = new URLSearchParams();
  
  if (filters) {
    if (filters.company?.length) params.set('company', filters.company.join(','));
    if (filters.status) params.set('status', filters.status);
    if (filters.referral) params.set('referral', filters.referral);
    if (filters.location) params.set('location', filters.location);
    if (filters.order) params.set('order', filters.order);
  }

  const response = await fetch(`/api/applications?${params.toString()}`);
  
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
  lists: () => [...applicationsKeys.all, 'list'] as const,
  list: (filters?: ApplicationFilters) => [...applicationsKeys.lists(), filters] as const,
  details: () => [...applicationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationsKeys.details(), id] as const,
};

export function useUserApplications(filters?: ApplicationFilters) {
  return useQuery({
    queryKey: applicationsKeys.list(filters),
    queryFn: () => fetchUserApplications(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (applicationData: CreateApplicationData & {
      company_name: string;
      role: string;
      location: string;
      company_logo?: string;
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
        queryKey: applicationsKeys.lists(),
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
        queryKey: applicationsKeys.lists(),
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
        queryKey: applicationsKeys.lists(),
      });
    },
  });
}