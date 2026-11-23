'use client'

import { useState } from 'react'
import { Star, EyeOff, Eye } from 'lucide-react'
import { InputWithIcons } from '../InputFilter'

interface CompanyPreferencesSectionProps {
  companiesData: { companies: any[] } | undefined
  companiesLoading: boolean
  preferences: any
  pendingChanges: {
    companies: { preferred: number[] | null, hidden: number[] | null }
  }
  editMode: boolean
  handleCompanyPreference: (companyId: number, action: 'prefer' | 'hide') => void
}

function CompanyCard({ company, isPreferred, isHidden, onPrefer, onHide, disabled = false }: {
  company: any
  isPreferred: boolean
  isHidden: boolean
  onPrefer: () => void
  onHide: () => void
  disabled?: boolean
}) {
  return (
    <div className={`p-4 border border-slate-200 rounded-lg ${disabled ? 'opacity-50' : 'hover:bg-slate-50'} transition-colors`}>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
          {company.logo_url ? (
            <img src={company.logo_url} alt={company.name} className="w-8 h-8 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
               }}/>
          ) : null}
          <div className={`w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-sm font-bold text-slate-600 ${company.logo_url ? 'hidden' : ''}`}>
            {company.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-slate-900">{company.name}</h4>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={!disabled ? onPrefer : undefined}
            disabled={disabled}
            className={`p-2 rounded-lg transition-colors ${
              isPreferred
                ? 'bg-brand-100 text-brand-500'
                : 'bg-slate-100 text-slate-400 hover:bg-brand-50 hover:text-brand-500'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
            title={isPreferred ? 'Remove from preferred' : 'Mark as preferred'}
          >
            <Star className={`w-4 h-4 ${isPreferred ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={!disabled ? onHide : undefined}
            disabled={disabled}
            className={`p-2 rounded-lg transition-colors ${
              isHidden
                ? 'bg-red-100 text-red-600'
                : 'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
            title={isHidden ? 'Show company' : 'Hide company'}
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CompanyPreferencesSection({
  companiesData,
  companiesLoading,
  preferences,
  pendingChanges,
  editMode,
  handleCompanyPreference
}: CompanyPreferencesSectionProps) {
  const [companySearch, setCompanySearch] = useState('')
  const [filterMode, setFilterMode] = useState<'all' | 'preferred' | 'hidden'>('all')

  const basePreferredIds = preferences?.preferred_companies || []
  const baseHiddenIds = preferences?.hidden_companies || []

  // null = sin cambios pendientes; una lista vacía sí es un cambio
  const currentPreferredIds = pendingChanges.companies.preferred ?? basePreferredIds
  const currentHiddenIds = pendingChanges.companies.hidden ?? baseHiddenIds

  const actualPreferredCount = currentPreferredIds.filter((id: number) => !currentHiddenIds.includes(id)).length

  const filteredCompanies = companiesData?.companies?.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(companySearch.toLowerCase())
    if (!matchesSearch) return false

    switch (filterMode) {
      case 'preferred':
        return currentPreferredIds.includes(company.id) && !currentHiddenIds.includes(company.id)
      case 'hidden':
        return currentHiddenIds.includes(company.id)
      case 'all':
      default:
        return true
    }
  }) || []

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Company Preferences</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            onClick={() => setFilterMode(filterMode === 'preferred' ? 'all' : 'preferred')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
              filterMode === 'preferred'
                ? 'bg-brand-100 text-brand-500'
                : 'hover:bg-brand-50 text-slate-600 hover:text-brand-500'
            }`}
            title={filterMode === 'preferred' ? 'Show all companies' : 'Show only preferred companies'}
          >
            <Star className={`w-4 h-4 ${filterMode === 'preferred' ? 'text-brand-500 fill-current' : 'text-brand-500 fill-current'}`} />
            <span>
              {actualPreferredCount} preferred
            </span>
          </button>
          <button
            onClick={() => setFilterMode(filterMode === 'hidden' ? 'all' : 'hidden')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
              filterMode === 'hidden'
                ? 'bg-red-100 text-red-600'
                : 'hover:bg-red-50 text-slate-600 hover:text-red-500'
            }`}
            title={filterMode === 'hidden' ? 'Show all companies' : 'Show only hidden companies'}
          >
            <EyeOff className="w-4 h-4 text-red-500" />
            <span>
              {currentHiddenIds.length} hidden
            </span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <InputWithIcons
          placeholder="Search companies..."
          value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
          leftIcon="/resources/Icons/Components_Cards/Company_Filter_Cards.png"
          rightIcon="/resources/Icons/search_icon.png"
          inputClassName="w-full border border-slate-300 hover:border-brand-500 rounded-md pl-10 pr-10 py-2 text-md text-brand-600 placeholder-slate-400 focus:ring-2 focus:ring-brand-600 focus:border-transparent"
        />
      </div>

      {companiesLoading ? (
        <div className="text-center py-8">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600"></div>
          <p className="text-slate-600">Loading companies...</p>
        </div>
      ) : (
        <>
          {filterMode !== 'all' && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                Showing {filterMode === 'preferred' ? 'preferred' : 'hidden'} companies only.{' '}
                <button
                  onClick={() => setFilterMode('all')}
                  className="text-brand-500 hover:underline font-medium"
                >
                  Show all companies
                </button>
              </p>
            </div>
          )}

          {filteredCompanies.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-4">
                {filterMode === 'preferred' ? (
                  <Star className="w-12 h-12 mx-auto" />
                ) : filterMode === 'hidden' ? (
                  <Eye className="w-12 h-12 mx-auto" />
                ) : (
                  <svg className="w-12 h-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
              <p className="text-slate-500 font-medium">
                {filterMode === 'preferred' && 'No preferred companies found'}
                {filterMode === 'hidden' && 'No hidden companies found'}
                {filterMode === 'all' && 'No companies match your search'}
              </p>
              {filterMode !== 'all' && (
                <p className="text-sm text-slate-400 mt-2">
                  {filterMode === 'preferred'
                    ? 'Start preferring companies to see them here'
                    : 'Companies you hide will appear here'}
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredCompanies.map((company) => {
                const isHidden = currentHiddenIds.includes(company.id)
                const isPreferred = currentPreferredIds.includes(company.id) && !isHidden 

                return (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    isPreferred={isPreferred}
                    isHidden={isHidden}
                    onPrefer={() => handleCompanyPreference(company.id, 'prefer')}
                    onHide={() => handleCompanyPreference(company.id, 'hide')}
                    disabled={!editMode}
                  />
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}