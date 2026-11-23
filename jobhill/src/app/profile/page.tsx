'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthModal } from '@/contexts/AuthModalContext'
import { useUserPreferences, useUpdatePreference } from '@/hooks/useUserPreferences'
import { useCompanies } from '@/hooks/useOnboarding'
import { useHiddenJobOffers } from '@/hooks/useJobOffers'
import { Edit3, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ProfileSidebar from '@/components/Profile/ProfileSidebar'
import CompanyPreferencesSection from '@/components/Profile/CompanyPreferencesSection'
import HiddenJobsSection from '@/components/Profile/HiddenJobsSection'
import { handleSignOut, getDisplayName, getAvatarUrl, JOB_CATEGORIES, hasJobFilterChanges, hasCategoryChanges, hasUnhiddenCompanies } from '@/utils/profileUtils'
import { fetchJobsForCompanies, recalculateJobScoresInCache, jobOffersKeys } from '@/hooks/useJobOffers'
import { useQueryClient } from '@tanstack/react-query'

type ActiveSection = 'preferences' | 'apply-extension'

interface PreferenceToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

function PreferenceToggle({ label, description, checked, onChange, disabled = false }: PreferenceToggleProps) {
  return (
    <div className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${disabled ? 'border-slate-100 bg-slate-50/60' : 'border-slate-200 hover:border-brand-200 hover:bg-brand-50/40'}`}>
      <div className="flex-1">
        <p className={`font-medium ${disabled ? 'text-slate-500' : 'text-slate-900'}`}>{label}</p>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      <label className="relative inline-flex shrink-0 items-center cursor-pointer">
        <span className="sr-only">{label}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus-visible:ring-4 peer-focus-visible:ring-brand-200 peer-disabled:opacity-60 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600 peer-disabled:cursor-not-allowed"></div>
      </label>
    </div>
  )
}

function CategoryTag({ category, isSelected, onToggle, disabled = false }: { category: string, isSelected: boolean, onToggle: () => void, disabled?: boolean }) {
  return (
    <button
      onClick={!disabled ? onToggle : undefined}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        isSelected
          ? 'bg-brand-600 text-white shadow-sm'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {category}
    </button>
  )
}

export default function Profile() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('preferences')
  const [editMode, setEditMode] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<{
    categories: string[] | null
    preferences: { [key: string]: any }
    companies: { preferred: number[], hidden: number[] }
  }>({ categories: null, preferences: {}, companies: { preferred: [], hidden: [] } })
  const router = useRouter()

  const { user, loading: authLoading } = useAuthModal()
  const { data: preferencesData, isLoading: preferencesLoading } = useUserPreferences()
  const { data: companiesData, isLoading: companiesLoading } = useCompanies()
  const updatePreference = useUpdatePreference()
  const queryClient = useQueryClient()
  const avatarUrl = getAvatarUrl(user)
  const displayName = getDisplayName(user)

  const preferences = preferencesData?.preferences
  const { data: hiddenJobs, isLoading: hiddenJobsLoading } = useHiddenJobOffers(preferences?.hidden_jobs || [])

  const categories = JOB_CATEGORIES

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (preferencesData?.preferences && !editMode) {
      setPendingChanges({ categories: null, preferences: {}, companies: { preferred: [], hidden: [] } })
    }
  }, [preferencesData?.preferences?.preferred_companies, preferencesData?.preferences?.hidden_companies, editMode])

  const handleUserSignOut = () => handleSignOut(router)

  const handleCategoryToggle = (category: string) => {
    if (!editMode || !preferencesData?.preferences) return

    const currentCategories = pendingChanges.categories !== null
      ? pendingChanges.categories
      : preferencesData.preferences.preferred_categories

    const isSelected = currentCategories.includes(category)
    let newCategories: string[]

    if (isSelected) {
      newCategories = currentCategories.filter(c => c !== category)
    } else {
      if (currentCategories.length >= 4) {
        return 
      }
      newCategories = [...currentCategories, category]
    }

    setPendingChanges(prev => ({ ...prev, categories: newCategories }))
  }
  const handleCompanyPreference = (companyId: number, action: 'prefer' | 'hide') => {
    if (!editMode || !preferencesData?.preferences) return

    const dbPreferred = preferencesData.preferences.preferred_companies || []
    const dbHidden = preferencesData.preferences.hidden_companies || []

    const currentPreferred = pendingChanges.companies.preferred.length > 0
      ? pendingChanges.companies.preferred
      : dbPreferred
    const currentHidden = pendingChanges.companies.hidden.length > 0
      ? pendingChanges.companies.hidden
      : dbHidden

    let newPreferred = [...currentPreferred]
    let newHidden = [...currentHidden]

    if (action === 'prefer') {
      newPreferred = newPreferred.filter(id => id !== companyId)
      newHidden = newHidden.filter(id => id !== companyId)

      if (!currentPreferred.includes(companyId)) {
        newPreferred.push(companyId)
      }
    } else if (action === 'hide') {
      newPreferred = newPreferred.filter(id => id !== companyId)
      newHidden = newHidden.filter(id => id !== companyId)
      if (!currentHidden.includes(companyId)) {
        newHidden.push(companyId)
      }
    }
    setPendingChanges(prev => ({
      ...prev,
      companies: { preferred: newPreferred, hidden: newHidden }
    }))
  }

  if (authLoading || preferencesLoading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-10" aria-busy="true">
          <div className="card flex flex-col items-center gap-3 p-6">
            <div className="skeleton h-24 w-24 rounded-full" />
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-40" />
          </div>
          <div className="space-y-6">
            <div className="skeleton h-9 w-48" />
            <div className="skeleton h-56 w-full rounded-2xl" />
            <div className="skeleton h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-10">
      <ProfileSidebar
        user={user}
        displayName={displayName}
        avatarUrl={avatarUrl}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleSignOut={handleUserSignOut}
      />

      <div className="min-w-0">
        <div>
        {activeSection === 'preferences' && (
          <div className="w-full">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Preferences</h1>
                <p className="mt-1 text-slate-600">Customize your job search experience</p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                {editMode && (
                  <button
                    onClick={() => {
                      setEditMode(false)
                      setPendingChanges({ categories: null, preferences: {}, companies: { preferred: [], hidden: [] } })
                    }}
                    className="btn-secondary flex-1 sm:flex-none"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (editMode) {
                      try {
                        const needsToInvalidate = hasJobFilterChanges(pendingChanges)
                        const hasCategoryUpdates = hasCategoryChanges(pendingChanges, preferences?.preferred_categories)
                        const currentHiddenCompanies = preferences?.hidden_companies || []
                        const unhiddenCompanyIds = hasUnhiddenCompanies(pendingChanges, currentHiddenCompanies)

                        const promises = []

                        if (hasCategoryUpdates) {
                          promises.push(updatePreference.mutateAsync({
                            field: 'preferred_categories',
                            value: pendingChanges.categories || [],
                            action: 'set'
                          }))
                        }

                        if (pendingChanges.companies.preferred.length > 0 || pendingChanges.companies.hidden.length > 0) {
                          if (pendingChanges.companies.preferred.length > 0) {
                            promises.push(updatePreference.mutateAsync({
                              field: 'preferred_companies',
                              value: pendingChanges.companies.preferred,
                              action: 'set'
                            }))
                          }
                          if (pendingChanges.companies.hidden.length > 0) {
                            promises.push(updatePreference.mutateAsync({
                              field: 'hidden_companies',
                              value: pendingChanges.companies.hidden,
                              action: 'set'
                            }))
                          }
                        }

                        Object.entries(pendingChanges.preferences).forEach(([field, value]) => {
                          promises.push(updatePreference.mutateAsync({ field: field as any, value, action: 'set' }))
                        })

                        await Promise.all(promises)

                        if (needsToInvalidate) {
                          // If we changed Job Filters, invalidate to fetch missing offers
                          await queryClient.invalidateQueries({ queryKey: jobOffersKeys.allJobs() })
                        } else {
                          // No job filter changes - handle specific cases
                          if (unhiddenCompanyIds.length > 0) {
                            // Fetch jobs for newly unhidden companies and add to cache
                            const newJobs = await fetchJobsForCompanies(unhiddenCompanyIds)
                            if (newJobs.length > 0) {
                              queryClient.setQueryData(
                                jobOffersKeys.allJobs(),
                                (oldData: any) => {
                                  if (!oldData) return oldData
                                  return {
                                    ...oldData,
                                    jobs: [...oldData.jobs, ...newJobs],
                                    total: oldData.total + newJobs.length,
                                  }
                                }
                              )
                            }
                          }
                          if (hasCategoryUpdates) {
                            const updatedPreferences = {
                              ...preferences,
                              preferred_categories: pendingChanges.categories || []
                            }
                            recalculateJobScoresInCache(queryClient, updatedPreferences)
                          }
                        }
                        setEditMode(false)
                        setPendingChanges({ categories: null, preferences: {}, companies: { preferred: [], hidden: [] } })
                        toast.success('Preferences updated successfully', {
                          duration: 3000,
                          position: 'top-right',
                        })

                      } catch (error) {
                        console.error('Error updating preferences:', error)
                        toast.error('Error updating preferences', {
                          duration: 3000,
                          position: 'top-right',
                        })
                      }
                    } else {
                      setEditMode(true)
                    }
                  }}
                  className="btn-primary flex-1 sm:flex-none sm:px-6"
                >
                  {editMode ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  <span>{editMode ? 'Save' : 'Edit'}</span>
                </button>
              </div>
            </div>

            {/* Job Filters */}
            <div className="card mb-6 p-4 sm:p-6">
              <h2 className="mb-1 text-lg font-semibold text-slate-900">Job Filters</h2>
              <p className="mb-5 text-sm text-slate-500">Choose which jobs you don&apos;t want to see.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PreferenceToggle
                  label="Requires sponsorship"
                  description="Hide jobs that don't offer visa sponsorship"
                  checked={pendingChanges.preferences.requires_sponsorship !== undefined
                    ? pendingChanges.preferences.requires_sponsorship
                    : preferences?.requires_sponsorship || false}
                  onChange={(checked) => setPendingChanges(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, requires_sponsorship: checked }
                  }))}
                  disabled={!editMode}
                />
                <PreferenceToggle
                  label="US Citizenship"
                  description="Hide jobs that require US citizenship"
                  checked={pendingChanges.preferences.american_citizen !== undefined
                    ? pendingChanges.preferences.american_citizen
                    : preferences?.american_citizen || false}
                  onChange={(checked) => setPendingChanges(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, american_citizen: checked }
                  }))}
                  disabled={!editMode}
                />
                <PreferenceToggle
                  label="Hide internships"
                  description="Don't show internship opportunities"
                  checked={pendingChanges.preferences.hideInternships !== undefined
                    ? pendingChanges.preferences.hideInternships
                    : preferences?.hideInternships || false}
                  onChange={(checked) => setPendingChanges(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, hideInternships: checked }
                  }))}
                  disabled={!editMode}
                />
                <PreferenceToggle
                  label="Hide New Grad"
                  description="Don't show positions for recent graduates"
                  checked={pendingChanges.preferences.hideNG !== undefined
                    ? pendingChanges.preferences.hideNG
                    : preferences?.hideNG || false}
                  onChange={(checked) => setPendingChanges(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, hideNG: checked }
                  }))}
                  disabled={!editMode}
                />
                <PreferenceToggle
                  label="Hide Emerging Talent"
                  description="Don't show emerging talent programs (sophomore and freshman programs)"
                  checked={pendingChanges.preferences.hideET !== undefined
                    ? pendingChanges.preferences.hideET
                    : preferences?.hideET || false}
                  onChange={(checked) => setPendingChanges(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, hideET: checked }
                  }))}
                  disabled={!editMode}
                />
              </div>
            </div>

            <div className="card mb-6 p-4 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Preferred Categories</h2>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {(pendingChanges.categories !== null ? pendingChanges.categories : preferences?.preferred_categories || []).length}/4 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const currentCategories = pendingChanges.categories !== null
                    ? pendingChanges.categories
                    : preferences?.preferred_categories || []
                  return (
                    <CategoryTag
                      key={category}
                      category={category}
                      isSelected={currentCategories.includes(category)}
                      onToggle={() => handleCategoryToggle(category)}
                      disabled={!editMode}
                    />
                  )
                })}
              </div>
            </div>
            
            <div className='mb-6'>
              <HiddenJobsSection
              hiddenJobs={hiddenJobs || []}
              isLoading={hiddenJobsLoading}
              />
           </div>

            <CompanyPreferencesSection
              companiesData={companiesData}
              companiesLoading={companiesLoading}
              preferences={preferences}
              pendingChanges={pendingChanges}
              editMode={editMode}
              handleCompanyPreference={handleCompanyPreference}
            />
          </div>
        )}

        {activeSection === 'apply-extension' && (
          <div className="w-full">
            <div className="card p-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Apply Extension</h1>
              <p className="text-slate-600 text-lg">This feature will be available soon.</p>
            </div>
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  )
}