import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export async function handleSignOut(router: any) {
  const supabase = createClient()
  await supabase.auth.signOut()
  router.push('/login')
}

export function getDisplayName(user: User | null): string {
  if (!user) return ''

  const rawUserMetaData = user.user_metadata
  const githubIdentity = user.identities?.find((id: any) => id.provider === 'github')
  const googleIdentity = user.identities?.find((id: any) => id.provider === 'google')

  if (githubIdentity?.identity_data?.preferred_username) {
    return githubIdentity.identity_data.preferred_username
  }

  if (googleIdentity?.identity_data?.name) {
    return googleIdentity.identity_data.name
  }

  if (rawUserMetaData?.preferred_username) {
    return rawUserMetaData.preferred_username
  }

  if (rawUserMetaData?.name) {
    return rawUserMetaData.name
  }

  return user.email?.split('@')[0] || 'User'
}

export function getAvatarUrl(user: User | null): string | null {
  if (!user) return null

  const rawUserMetaData = user.user_metadata
  const githubIdentity = user.identities?.find((id: any) => id.provider === 'github')
  const googleIdentity = user.identities?.find((id: any) => id.provider === 'google')

  if (githubIdentity?.identity_data?.avatar_url) {
    return githubIdentity.identity_data.avatar_url
  }

  if (googleIdentity?.identity_data?.avatar_url) {
    return googleIdentity.identity_data.avatar_url
  }

  if (rawUserMetaData?.avatar_url) {
    return rawUserMetaData.avatar_url
  }

  return null
}

export const JOB_CATEGORIES = [
  'FullStack', 'FrontEnd', 'BackEnd', 'Data & Analytics', 'AI & ML', 'Cybersecurity',
  'DevOps', 'Game Development', 'Mobile Dev', 'SWE', 'Quant', 'AR/VR', 'Research', 'IT', 'QA & Testing'
] as const

export const JOB_FILTER_FIELDS = [
  'requires_sponsorship',
  'american_citizen',
  'hideInternships',
  'hideNG',
  'hideET'
] as const

export type JobFilterField = typeof JOB_FILTER_FIELDS[number]

export function hasJobFilterChanges(pendingChanges: { preferences: { [key: string]: any } }): boolean {
  return JOB_FILTER_FIELDS.some(field =>
    pendingChanges.preferences.hasOwnProperty(field)
  )
}

export function hasCategoryChanges(pendingChanges: { categories: string[] | null }, currentCategories?: string[]): boolean {
  if (pendingChanges.categories === null) return false

  const pendingCats = pendingChanges.categories

  if (!currentCategories) return pendingCats.length > 0

  if (pendingCats.length !== currentCategories.length) return true

  return !pendingCats.every(cat => currentCategories.includes(cat)) ||
         !currentCategories.every(cat => pendingCats.includes(cat))
}

export function hasUnhiddenCompanies(
  pendingChanges: { companies: { hidden: number[] } },
  currentHidden: number[]
): number[] {
  if (pendingChanges.companies.hidden.length === 0) return []
  const unhiddenCompanyIds = currentHidden.filter(
    companyId => !pendingChanges.companies.hidden.includes(companyId)
  )

  return unhiddenCompanyIds
}

export function useAuthRedirect(authLoading: boolean, user: User | null, router: any) {
  if (!authLoading && !user) {
    router.push('/login')
  }
}