'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { JobOffersApiResponse } from '@/interfaces/JobOffer'
import { userPreferencesKeys, type UserPreferences } from './useUserPreferences'
import { applicationsKeys } from './useApplications'
import type { Application } from '@/interfaces/Application'

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
  hiddenJobs: () => [...jobOffersKeys.all, 'hidden'] as const,
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
      status?: string
      applied_date?: string
      company_logo?: string
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
    onSuccess: (createdApplication: Application, variables) => {
      queryClient.setQueryData(
        applicationsKeys.userApplications(),
        (oldData: Application[] | undefined) => {
          if (!oldData) return [createdApplication];
          return [createdApplication, ...oldData];
        }
      );

      if ((window as any).markJobAsAppliedAndUpdate) {
        (window as any).markJobAsAppliedAndUpdate(variables.job_offer_id);
      }

      setTimeout(() => {
        queryClient.setQueryData(
          jobOffersKeys.allJobs(),
          (oldData: JobOffersApiResponse | undefined) => {
            if (!oldData) return oldData

            return {
              ...oldData,
              jobs: oldData.jobs.filter(job => job.id !== variables.job_offer_id),
              total: oldData.total - 1,
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

      const allJobsData = queryClient.getQueryData<JobOffersApiResponse>(jobOffersKeys.allJobs())
      const hiddenJob = allJobsData?.jobs.find(job => job.id === jobId)
      const userPreferencesData = queryClient.getQueryData(['user-preferences', 'preferences']) as any

      // Store previous data for rollback
      const previousAllJobsData = allJobsData
      const previousUserPreferences = userPreferencesData

      // Remove job from main job offers cache
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

      if (hiddenJob) {
        const currentHiddenJobIds = userPreferencesData?.preferences?.hidden_jobs || []
        const updatedHiddenJobIds = [...currentHiddenJobIds, jobId]

        if (userPreferencesData) {
          queryClient.setQueryData(
            ['user-preferences', 'preferences'],
            {
              ...userPreferencesData,
              preferences: {
                ...userPreferencesData.preferences,
                hidden_jobs: updatedHiddenJobIds
              }
            }
          )
        }

        queryClient.setQueryData(
          jobOffersKeys.hiddenJobs(),
          (oldHiddenJobs: any) => {
            const currentHiddenJobs = oldHiddenJobs || []
            return [...currentHiddenJobs, hiddenJob]
          }
        )
      }

      return { hiddenJob, previousAllJobsData, previousUserPreferences }
    },
    onError: (_err, jobId, context) => {
      // On error, restore the previous state
      if (context?.previousAllJobsData) {
        queryClient.setQueryData(
          jobOffersKeys.allJobs(),
          context.previousAllJobsData
        )
      }

      // Restore user preferences cache
      if (context?.previousUserPreferences) {
        queryClient.setQueryData(
          ['user-preferences', 'preferences'],
          context.previousUserPreferences
        )
      }

      // Remove the job from hidden jobs cache if it was added
      if (context?.hiddenJob) {
        queryClient.setQueryData(
          jobOffersKeys.hiddenJobs(),
          (oldHiddenJobs: any) => {
            if (!oldHiddenJobs) return []
            return oldHiddenJobs.filter((job: any) => job.id !== jobId)
          }
        )
      }
    },
  })
}

export function useUnhideJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: 'hidden_jobs',
          value: jobId,
          action: 'remove'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to unhide job')
      }

      return response.json()
    },
    onMutate: async (jobId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: jobOffersKeys.hiddenJobs() })

      const hiddenJobsData = queryClient.getQueryData(jobOffersKeys.hiddenJobs()) as any
      const unhddenJob = hiddenJobsData?.find((job: any) => job.id === jobId)
      const userPreferencesData = queryClient.getQueryData(['user-preferences', 'preferences']) as any

      const previousHiddenJobsData = hiddenJobsData
      const previousUserPreferences = userPreferencesData

      queryClient.setQueryData(
        jobOffersKeys.hiddenJobs(),
        (oldData: any) => {
          if (!oldData) return []
          return oldData.filter((job: any) => job.id !== jobId)
        }
      )

      if (unhddenJob) {
        const currentHiddenJobIds = userPreferencesData?.preferences?.hidden_jobs || []
        const updatedHiddenJobIds = currentHiddenJobIds.filter((id: string) => id !== jobId)

        if (userPreferencesData) {
          queryClient.setQueryData(
            ['user-preferences', 'preferences'],
            {
              ...userPreferencesData,
              preferences: {
                ...userPreferencesData.preferences,
                hidden_jobs: updatedHiddenJobIds
              }
            }
          )
        }

        queryClient.setQueryData(
          jobOffersKeys.allJobs(),
          (oldData: JobOffersApiResponse | undefined) => {
            if (!oldData) return oldData

            return {
              ...oldData,
              jobs: [unhddenJob, ...oldData.jobs],
              total: oldData.total + 1,
            }
          }
        )
      }

      return { unhddenJob, previousHiddenJobsData, previousUserPreferences }
    },
    onSuccess: (_, jobId, context) => {
      if (context?.unhddenJob) {
        toast.success(
          `Job unhidden successfully`,
          {
            duration: 3000,
            position: 'bottom-right',
          }
        )
      }
    },
    onError: (_err, jobId, context) => {
      // On error, restore the previous state
      if (context?.previousHiddenJobsData) {
        queryClient.setQueryData(
          jobOffersKeys.hiddenJobs(),
          context.previousHiddenJobsData
        )
      }

      // Restore user preferences cache
      if (context?.previousUserPreferences) {
        queryClient.setQueryData(
          ['user-preferences', 'preferences'],
          context.previousUserPreferences
        )
      }

      if (context?.unhddenJob) {
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
      }
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
      await queryClient.cancelQueries({ queryKey: userPreferencesKeys.preferences() })

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

      queryClient.setQueryData(
        userPreferencesKeys.preferences(),
        (oldData: { preferences: UserPreferences; success: boolean } | undefined) => {
          if (!oldData) return oldData

          const currentHiddenCompanies = oldData.preferences.hidden_companies || []
          const updatedHiddenCompanies = currentHiddenCompanies.includes(companyId)
            ? currentHiddenCompanies
            : [...currentHiddenCompanies, companyId]

          return {
            ...oldData,
            preferences: {
              ...oldData.preferences,
              hidden_companies: updatedHiddenCompanies
            }
          }
        }
      )
    },
  })
}

export function useHiddenJobOffers(hiddenJobIds: string[]) {
  return useQuery({
    queryKey: jobOffersKeys.hiddenJobs(),
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

export async function fetchJobsForCompanies(companyIds: number[]): Promise<any[]> {
  if (companyIds.length === 0) return []

  const response = await fetch('/api/job-offers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyIds }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs for companies: ${response.statusText}`)
  }

  return response.json()
}

export function recalculateJobScoresInCache(
  queryClient: any,
  newPreferences: any
): void {
  queryClient.setQueryData(
    jobOffersKeys.allJobs(),
    (oldData: JobOffersApiResponse | undefined) => {
      if (!oldData) return oldData

      const updatedJobs = oldData.jobs.map((job) => {
        let preferenceScore = 0

        if (newPreferences) {
          if (newPreferences.preferred_companies?.includes(job.company_id)) {
            preferenceScore += 15
          }

          if (newPreferences.preferred_categories && job.categories) {
            const matchingCategories = job.categories.filter((cat: string) =>
              newPreferences.preferred_categories.includes(cat)
            ).length
            if (matchingCategories > 0) {
              preferenceScore += matchingCategories * 10
            }
          }
        }

        return {
          ...job,
          preference_score: preferenceScore,
        }
      })

      // Re-sort jobs by preference score
      updatedJobs.sort((a, b) => {
        const aScore = a.preference_score || 0
        const bScore = b.preference_score || 0
        if (aScore !== bScore) {
          return bScore - aScore
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      return {
        ...oldData,
        jobs: updatedJobs,
      }
    }
  )
}

export { jobOffersKeys }