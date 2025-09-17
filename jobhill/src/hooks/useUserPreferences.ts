'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthModal } from '@/contexts/AuthModalContext'

export interface UserPreferences {
  user_id: string;
  hidden_jobs: string[];
  hidden_companies: string[];
  preferred_companies: string[];
  preferred_categories: string[];
  favorite_jobs: string[];
  requires_sponsorship: boolean;
  american_citizen: boolean;
  dont_show_conf_hide: boolean;
  hide_et: boolean;
  hide_ng: boolean;
  hide_internships: boolean;
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


export function useUpdatePreferenceArray() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      arrayName, 
      itemId, 
      action 
    }: { 
      arrayName: 'hidden_jobs' | 'favorite_jobs' | 'hidden_companies' | 'preferred_companies' | 'preferred_categories'
      itemId: string
      action: 'add' | 'remove'
    }) => {
      const endpoint = getEndpointForArray(arrayName)
      const method = action === 'add' ? 'POST' : 'DELETE'
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          job_id: itemId,
          company_id: itemId,
          item_id: itemId 
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} ${arrayName.replace('_', ' ')}`)
      }
      
      return response.json()
    },
    onMutate: async ({ arrayName, itemId, action }) => {
      await queryClient.cancelQueries({ queryKey: userPreferencesKeys.preferences() })
      const previousPreferences = queryClient.getQueryData<UserPreferencesResponse>(
        userPreferencesKeys.preferences()
      )
      
      if (previousPreferences) {
        const updatedPreferences = { ...previousPreferences }
        const currentArray = [...updatedPreferences.preferences[arrayName]]
        
        if (action === 'add' && !currentArray.includes(itemId)) {
          currentArray.push(itemId)
        } else if (action === 'remove') {
          const index = currentArray.indexOf(itemId)
          if (index > -1) {
            currentArray.splice(index, 1)
          }
        }
        
        updatedPreferences.preferences = {
          ...updatedPreferences.preferences,
          [arrayName]: currentArray
        }
        
        queryClient.setQueryData(
          userPreferencesKeys.preferences(),
          updatedPreferences
        )
      }
      
      return { previousPreferences }
    },
    onError: (err, variables, context) => {
      if (context?.previousPreferences) {
        queryClient.setQueryData(
          userPreferencesKeys.preferences(),
          context.previousPreferences
        )
      }
    },
  })
}

function getEndpointForArray(arrayName: string): string {
  switch (arrayName) {
    case 'hidden_jobs':
      return '/api/user-preferences/hide-job'
    case 'favorite_jobs':
      return '/api/user-preferences/favorite-job'
    case 'hidden_companies':
      return '/api/user-preferences/hide-company'
    case 'preferred_companies':
      return '/api/user-preferences/prefer-company'
    case 'preferred_categories':
      return '/api/user-preferences/prefer-category'
    default:
      throw new Error(`Unknown array type: ${arrayName}`)
  }
}

export function useFavoriteJob() {
  const updateArray = useUpdatePreferenceArray()
  
  return useMutation({
    mutationFn: (jobId: string) => 
      updateArray.mutateAsync({ 
        arrayName: 'favorite_jobs', 
        itemId: jobId, 
        action: 'add' 
      }),
  })
}

export function useUnfavoriteJob() {
  const updateArray = useUpdatePreferenceArray()
  
  return useMutation({
    mutationFn: (jobId: string) => 
      updateArray.mutateAsync({ 
        arrayName: 'favorite_jobs', 
        itemId: jobId, 
        action: 'remove' 
      }),
  })
}

export function useHideJobPreference() {
  const updateArray = useUpdatePreferenceArray()
  
  return useMutation({
    mutationFn: (jobId: string) => 
      updateArray.mutateAsync({ 
        arrayName: 'hidden_jobs', 
        itemId: jobId, 
        action: 'add' 
      }),
  })
}