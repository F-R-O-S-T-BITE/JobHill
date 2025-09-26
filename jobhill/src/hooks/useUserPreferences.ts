'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthModal } from '@/contexts/AuthModalContext'
import { jobOffersKeys } from './useJobOffers'

export interface UserPreferences {
  user_id: string;
  hidden_jobs: string[];
  hidden_companies: number[];
  preferred_companies: number[];
  preferred_categories: string[];
  favorite_jobs: string[];
  requires_sponsorship: boolean;
  american_citizen: boolean;
  dont_show_conf_hide: boolean;
  hideET: boolean;
  hideNG: boolean;
  hideInternships: boolean;
}

interface UserPreferencesResponse {
  preferences: UserPreferences;
  success: boolean;
}

export const userPreferencesKeys = {
  all: ['user-preferences'] as const,
  preferences: () => [...userPreferencesKeys.all, 'preferences'] as const,
}

async function fetchUserPreferences(): Promise<UserPreferencesResponse> {
  const response = await fetch('/api/user-preferences')
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized')
    }
    throw new Error(`Failed to fetch user preferences: ${response.statusText}`)
  }
  
  return response.json()
}

export function useUserPreferences() {
  const { user } = useAuthModal()

  return useQuery({
    queryKey: userPreferencesKeys.preferences(),
    queryFn: fetchUserPreferences,
    enabled: !!user,
    staleTime:24 * 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message === 'Unauthorized') return false
      return failureCount < 3
    },
  })
}


export function useUpdatePreference() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      field,
      value,
      action
    }: {
      field: 'hidden_jobs' | 'favorite_jobs' | 'hidden_companies' | 'preferred_companies' | 'preferred_categories' | 'requires_sponsorship' | 'american_citizen' | 'hideInternships' | 'hideNG' | 'hideET'
      value: string | number | string[] | number[] | boolean
      action: 'add' | 'remove' | 'set'
    }) => {
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          value,
          action
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${action} ${field.replace('_', ' ')}`)
      }

      return response.json()
    },
    onMutate: async ({ field, value, action }) => {
      await queryClient.cancelQueries({ queryKey: userPreferencesKeys.preferences() })
      const previousPreferences = queryClient.getQueryData<UserPreferencesResponse>(
        userPreferencesKeys.preferences()
      )

      if (previousPreferences) {
        const updatedPreferences = { ...previousPreferences }

        const booleanFields = ['requires_sponsorship', 'american_citizen', 'hideInternships', 'hideNG', 'hideET']
        const isBooleanField = booleanFields.includes(field)

        if (isBooleanField) {
          updatedPreferences.preferences = {
            ...updatedPreferences.preferences,
            [field]: value as boolean
          }
        } else {
          const currentArray = Array.isArray(updatedPreferences.preferences[field])
            ? [...updatedPreferences.preferences[field] as any[]]
            : []

          let newArray
          switch (action) {
            case 'add':
              newArray = currentArray.includes(value) ? currentArray : [...currentArray, value]
              break
            case 'remove':
              newArray = currentArray.filter((item: any) => item !== value)
              break
            case 'set':
              newArray = Array.isArray(value) ? value : [value]
              break
            default:
              newArray = currentArray
          }

          updatedPreferences.preferences = {
            ...updatedPreferences.preferences,
            [field]: newArray
          }
        }

        queryClient.setQueryData(
          userPreferencesKeys.preferences(),
          updatedPreferences
        )

        if (field === 'hidden_jobs' && !isBooleanField) {
          queryClient.setQueryData(
            jobOffersKeys.hiddenJobs(),
            (oldHiddenJobs: any) => {
              // The actual job data will be updated by useHideJob mutation
              return oldHiddenJobs || []
            }
          )
        }
      }

      return { previousPreferences }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPreferences) {
        queryClient.setQueryData(
          userPreferencesKeys.preferences(),
          context.previousPreferences
        )
      }
    },
  })
}

export function useFavoriteJob() {
  const updatePreference = useUpdatePreference()

  return useMutation({
    mutationFn: (jobId: string) =>
      updatePreference.mutateAsync({
        field: 'favorite_jobs',
        value: jobId,
        action: 'add'
      }),
  })
}

export function useUnfavoriteJob() {
  const updatePreference = useUpdatePreference()

  return useMutation({
    mutationFn: (jobId: string) =>
      updatePreference.mutateAsync({
        field: 'favorite_jobs',
        value: jobId,
        action: 'remove'
      }),
  })
}

export function useHideJobPreference() {
  const updatePreference = useUpdatePreference()

  return useMutation({
    mutationFn: (jobId: string) =>
      updatePreference.mutateAsync({
        field: 'hidden_jobs',
        value: jobId,
        action: 'add'
      }),
  })
}

export function useUnhideJobPreference() {
  const updatePreference = useUpdatePreference()

  return useMutation({
    mutationFn: (jobId: string) =>
      updatePreference.mutateAsync({
        field: 'hidden_jobs',
        value: jobId,
        action: 'remove'
      }),
  })
}

export const useUpdatePreferenceArray = useUpdatePreference