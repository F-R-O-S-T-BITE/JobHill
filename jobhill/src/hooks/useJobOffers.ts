'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { JobOffersFilters, JobOffersApiResponse, JobOfferResponse } from '@/interfaces/JobOffer'

async function fetchJobOffers(filters?: JobOffersFilters): Promise<JobOffersApiResponse> {
  const params = new URLSearchParams()
  
  if (filters) {
    if (filters.categories?.length) params.set('categories', filters.categories.join(','))
    if (filters.modality?.length) params.set('modality', filters.modality.join(','))
    if (filters.location?.length) params.set('location', filters.location.join(','))
    if (filters.company?.length) params.set('company', filters.company.join(','))
    if (filters.period?.length) params.set('period', filters.period.join(','))
    if (filters.search) params.set('search', filters.search)
  }

  const response = await fetch(`/api/job-offers?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch job offers: ${response.statusText}`)
  }
  
  return response.json()
}

const jobOffersKeys = {
  all: ['job-offers'] as const,
  lists: () => [...jobOffersKeys.all, 'list'] as const,
  list: (filters?: JobOffersFilters) => [...jobOffersKeys.lists(), filters] as const,
  details: () => [...jobOffersKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobOffersKeys.details(), id] as const,
}

export function useJobOffers(filters?: JobOffersFilters) {
  return useQuery({
    queryKey: jobOffersKeys.list(filters),
    queryFn: () => fetchJobOffers(filters),
    staleTime: 6 * 60 * 60 * 1000,
    placeholderData: (previousData) => previousData, 
  })
}

// Hook for creating/applying to a job application
export function useCreateApplication() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (applicationData: { 
      job_offer_id: string
      company_name: string
      role: string
      referral_type: string
      application_link: string
      location: string
    }) => {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create application')
      }
      
      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.setQueriesData(
        { queryKey: jobOffersKeys.lists() },
        (oldData: JobOffersApiResponse | undefined) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            jobs: oldData.jobs.map((job) =>
              job.id === variables.job_offer_id
                ? { ...job, is_applied: true }
                : job
            ),
          }
        }
      )
    },
  })
}

// Hook for toggling job favorites (placeholder - implement when favorites are added)
export function useToggleFavorite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ jobId, isFavorite }: { jobId: string; isFavorite: boolean }) => {
      // TODO: Implement favorites API endpoint
      const response = await fetch(`/api/favorites/${jobId}`, {
        method: isFavorite ? 'DELETE' : 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to toggle favorite')
      }
      
      return response.json()
    },
    onMutate: async ({ jobId, isFavorite }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: jobOffersKeys.lists() })
      
      // Optimistically update the UI
      queryClient.setQueriesData(
        { queryKey: jobOffersKeys.lists() },
        (oldData: JobOffersApiResponse | undefined) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            jobs: oldData.jobs.map((job) =>
              job.id === jobId
                ? { ...job, is_favorite: !isFavorite }
                : job
            ),
          }
        }
      )
    },
    onError: (err, { jobId, isFavorite }) => {
      // Revert optimistic update on error
      queryClient.setQueriesData(
        { queryKey: jobOffersKeys.lists() },
        (oldData: JobOffersApiResponse | undefined) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            jobs: oldData.jobs.map((job) =>
              job.id === jobId
                ? { ...job, is_favorite: isFavorite }
                : job
            ),
          }
        }
      )
    },
    onSettled: () => {
      // No invalidation needed - optimistic updates handle the UI
    },
  })
}

// Hook for hiding jobs (adds to user preferences hidden_jobs array)
export function useHideJob() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch('/api/user-preferences/hide-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to hide job')
      }
      
      return response.json()
    },
    onSuccess: (_, jobId) => {
      // Remove the job from all job offer queries
      queryClient.setQueriesData(
        { queryKey: jobOffersKeys.lists() },
        (oldData: JobOffersApiResponse | undefined) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            jobs: oldData.jobs.filter(job => job.id !== jobId),
            total: oldData.total - 1,
          }
        }
      )
    },
  })
}

export { jobOffersKeys }