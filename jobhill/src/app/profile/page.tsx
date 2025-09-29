'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthModal } from '@/contexts/AuthModalContext'
import { useUserPreferences, useUpdatePreference } from '@/hooks/useUserPreferences'
import { useCompanies } from '@/hooks/useOnboarding'
import { useHiddenJobOffers } from '@/hooks/useJobOffers'
import { Edit3, Save, X, Menu } from 'lucide-react'
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
    <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${disabled ? 'opacity-50' : 'hover:bg-gray-50'} transition-colors`}>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0353A4] peer-disabled:cursor-not-allowed"></div>
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
          ? 'bg-[#0353A4] text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {category}
    </button>
  )
}

export default function Profile() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('preferences')
  const [editMode, setEditMode] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0353A4] mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading profile...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      <ProfileSidebar
        user={user}
        displayName={displayName}
        avatarUrl={avatarUrl}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleSignOut={handleUserSignOut}
        isSidebarOpen={isSidebarOpen}
      />


      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
        {activeSection === 'preferences' && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Preferences</h1>
                <p className="text-gray-600 mt-2">Customize your job search experience</p>
              </div>
              <div className="flex gap-3">
                {editMode && (
                  <button
                    onClick={() => {
                      setEditMode(false)
                      setPendingChanges({ categories: null, preferences: {}, companies: { preferred: [], hidden: [] } })
                    }}
                    className="flex items-center gap-2 px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
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
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                    editMode
                      ? 'bg-[#0466C8] hover:bg-[#0353A4] text-white'
                      : 'bg-[#0353A4] hover:bg-[#024080] text-white'
                  }`}
                >
                  {editMode ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  <span>{editMode ? 'Save' : 'Edit'}</span>
                </button>
              </div>
            </div>

            {/* Job Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Filters</h2>
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

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Preferred Categories</h2>
                <span className="text-sm text-gray-500">
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
            
            <div className='mb-8'>
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
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Apply Extension</h1>
              <p className="text-gray-600 text-lg">This feature will be available soon.</p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}