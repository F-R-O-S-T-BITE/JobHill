'use client'

import { useState } from 'react'
import { Star, EyeOff } from 'lucide-react'
import { InputWithIcons } from '../InputFilter'

interface CompanyPreferencesSectionProps {
  companiesData: { companies: any[] } | undefined
  companiesLoading: boolean
  preferences: any
  pendingChanges: {
    companies: { preferred: number[], hidden: number[] }
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
    <div className={`p-4 border border-gray-200 rounded-lg ${disabled ? 'opacity-50' : 'hover:bg-gray-50'} transition-colors`}>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          {company.logo_url ? (
            <img src={company.logo_url} alt={company.name} className="w-8 h-8 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
               }}/>
          ) : null}
          <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 ${company.logo_url ? 'hidden' : ''}`}>
            {company.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{company.name}</h4>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={!disabled ? onPrefer : undefined}
            disabled={disabled}
            className={`p-2 rounded-lg transition-colors ${
              isPreferred
                ? 'bg-blue-100 text-[#0466C8]'
                : 'bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-[#0466C8]'
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
                : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
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

  const filteredCompanies = companiesData?.companies?.filter(company =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  ) || []

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Company Preferences</h2>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-[#0466C8] fill-current" />
            <span className="text-gray-600">
              {(pendingChanges.companies.preferred.length > 0 ? pendingChanges.companies.preferred : preferences?.preferred_companies || []).length} preferred
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-red-500" />
            <span className="text-gray-600">
              {(pendingChanges.companies.hidden.length > 0 ? pendingChanges.companies.hidden : preferences?.hidden_companies || []).length} hidden
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <InputWithIcons
          placeholder="Search companies..."
          value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
          leftIcon="resources/Icons/Components_Cards/Company_Filter_Cards.png"
          rightIcon="resources/Icons/search_icon.png"
          inputClassName="w-full border border-gray-300 hover:border-[#0466C8] rounded-md pl-10 pr-10 py-2 text-md text-[#0353A4] placeholder-gray-400 focus:ring-2 focus:ring-[#0353A4] focus:border-transparent"
        />
      </div>

      {companiesLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0353A4] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading companies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredCompanies.map((company) => {
            const currentPreferred = pendingChanges.companies.preferred.length > 0
              ? pendingChanges.companies.preferred
              : preferences?.preferred_companies || []
            const currentHidden = pendingChanges.companies.hidden.length > 0
              ? pendingChanges.companies.hidden
              : preferences?.hidden_companies || []

            return (
              <CompanyCard
                key={company.id}
                company={company}
                isPreferred={currentPreferred.includes(company.id)}
                isHidden={currentHidden.includes(company.id)}
                onPrefer={() => handleCompanyPreference(company.id, 'prefer')}
                onHide={() => handleCompanyPreference(company.id, 'hide')}
                disabled={!editMode}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}