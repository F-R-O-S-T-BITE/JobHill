'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { JobOffersApiResponse, JobOfferResponse } from '@/interfaces/JobOffer'

async function fetchAllJobOffers(): Promise<JobOffersApiResponse> {
  const response = await fetch('/api/job-offers')

  if (!response.ok) {
    throw new Error(`Failed to fetch job offers: ${response.statusText}`)
  }

  return response.json()
}

const jobOffersKeys = {
  all: ['job-offers'] as const,
  allJobs: () => [...jobOffersKeys.all, 'all'] as const,
  hiddenJobs: (hiddenJobIds: string[]) => [...jobOffersKeys.all, 'hidden', hiddenJobIds] as const,
}

export function useJobOffers() {
  return useQuery({
    queryKey: jobOffersKeys.allJobs(),
    queryFn: fetchAllJobOffers,
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
      if ((window as any).markJobAsAppliedAndUpdate) {
        (window as any).markJobAsAppliedAndUpdate(variables.job_offer_id);
      }
      
      // Update cache to mark job as applied after animation completes
      setTimeout(() => {
        queryClient.setQueryData(
          jobOffersKeys.allJobs(),
          (oldData: JobOffersApiResponse | undefined) => {
            if (!oldData) return oldData

            return {
              ...oldData,
              jobs: oldData.jobs.map(job =>
                job.id === variables.job_offer_id
                  ? { ...job, is_applied: true }
                  : job
              ),
            }
          }
        )
      }, 1000);
    },
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ jobId, isFavorite }: { jobId: string; isFavorite: boolean }) => {
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
      await queryClient.cancelQueries({ queryKey: jobOffersKeys.allJobs() })
      queryClient.setQueryData(
        jobOffersKeys.allJobs(),
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
      queryClient.setQueryData(
        jobOffersKeys.allJobs(),
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
  })
}

export function useHideJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: 'hidden_jobs',
          value: jobId,
          action: 'add'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to hide job')
      }

      return response.json()
    },
    onMutate: async (jobId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: jobOffersKeys.allJobs() })

      // Optimistically update cache immediately when mutation starts
      queryClient.setQueryData(
        jobOffersKeys.allJobs(),
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
    onError: (err, jobId) => {
      // On error, refetch to get the correct state
      queryClient.invalidateQueries({ queryKey: jobOffersKeys.allJobs() });
    },
  })
}

export function useHideCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (companyId: number) => {
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: 'hidden_companies',
          value: companyId,
          action: 'add'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to hide company')
      }

      return response.json()
    },
    onMutate: async (companyId: number) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: jobOffersKeys.allJobs() })

      // Optimistically update cache immediately when mutation starts
      queryClient.setQueryData(
        jobOffersKeys.allJobs(),
        (oldData: JobOffersApiResponse | undefined) => {
          if (!oldData) return oldData

          const filteredJobs = oldData.jobs.filter(job => job.company_id !== companyId)
          const removedCount = oldData.jobs.length - filteredJobs.length

          return {
            ...oldData,
            jobs: filteredJobs,
            total: oldData.total - removedCount,
          }
        }
      )
    },
    onError: (err, companyId) => {
      // On error, refetch to get the correct state
      queryClient.invalidateQueries({ queryKey: jobOffersKeys.allJobs() });
    },
  })
}

export function useHiddenJobOffers(hiddenJobIds: string[]) {
  return useQuery({
    queryKey: jobOffersKeys.hiddenJobs(hiddenJobIds),
    queryFn: async () => {
      if (!hiddenJobIds.length) {
        return []
      }

      const response = await fetch('/api/job-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hiddenJobIds }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch hidden job offers: ${response.statusText}`)
      }

      return response.json()
    },
    enabled: hiddenJobIds.length > 0,
    staleTime: 6 * 60 * 60 * 1000,
  })
}

export { jobOffersKeys }