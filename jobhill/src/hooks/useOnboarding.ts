'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { OnboardingData } from '@/interfaces/JobOffer'

interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  needsOnboarding: boolean;
}
interface OnboardingResponse {
  message: string;
  preferences: any;
}

async function fetchOnboardingStatus(): Promise<OnboardingStatus> {
  // Check localStorage first
  const cachedData = storage.get();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-local-storage-data': cachedData ? JSON.stringify(cachedData) : ''
  };

  const response = await fetch('/api/onboarding', { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch onboarding status: ${response.statusText}`);
  }
  return response.json();
}

async function submitOnboarding(data: OnboardingData): Promise<OnboardingResponse> {
  const response = await fetch('/api/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Failed to submit onboarding: ${response.statusText}`)
  } 
  return response.json()
}

async function fetchCompanies(): Promise<{ companies: any[] }> {
  const response = await fetch('/api/onboarding?companies=true')
  if (!response.ok) {
    throw new Error(`Failed to fetch companies: ${response.statusText}`)
  }
  return response.json()
}
const onboardingKeys = {
  all: ['onboarding'] as const,
  status: () => [...onboardingKeys.all, 'status'] as const,
  companies: () => [...onboardingKeys.all, 'companies'] as const,
}
const STORAGE_KEY = 'jobhill_onboarding_status';
//local storage for onboarding status
const storage = {
  get: () => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },
  set: (value: OnboardingStatus) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }
};

export function useOnboardingStatus() {
  return useQuery({
    queryKey: onboardingKeys.status(),
    queryFn: async () => {
      // Check localStorage first
      const cachedStatus = storage.get();
      if (cachedStatus && !cachedStatus.needsOnboarding) {
        return cachedStatus;
      }
      // If not in cache or needs onboarding, fetch from server
      const status = await fetchOnboardingStatus();
      storage.set(status);
      return status;
    },
    gcTime: Infinity,
    retry: (failureCount, error) => {
      if (error.message.includes('401')) return false;
      return failureCount < 3;
    },
  });
}

export function useSubmitOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitOnboarding,
    onSuccess: () => {
      // Update localStorage
      storage.set({
        hasCompletedOnboarding: true,
        needsOnboarding: false
      });
      // Update cache
      queryClient.setQueryData(onboardingKeys.status(), {
        hasCompletedOnboarding: true,
        needsOnboarding: false
      });
      // Invalidate job offers to refetch with new preferences when onboarding is done 
      queryClient.invalidateQueries({ queryKey: ['job-offers'] });
    },
    onError: (error) => {
      console.error('Onboarding submission failed:', error);
    },
  });
}

export function useTriggerOnboarding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const status = {
        hasCompletedOnboarding: false,
        needsOnboarding: true,
      };
      // Update localStorage
      storage.set(status);
      // Update cache
      queryClient.setQueryData(onboardingKeys.status(), status);
      return { success: true };
    },
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: onboardingKeys.companies(),
    queryFn: fetchCompanies,
    retry: (failureCount, error) => {
      if (error.message.includes('401')) return false;
      return failureCount < 3;
    },
  });
}

export { onboardingKeys }