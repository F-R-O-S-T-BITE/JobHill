'use client'

import { useState } from 'react'
import { useSubmitOnboarding, useCompanies } from '@/hooks/useOnboarding'
import type { OnboardingData, Company } from '@/interfaces/JobOffer'
import { OnboardingModalStyles as styles } from '@/styles/OnboardingModalStyles'
import { InputWithIcons } from '../InputFilter'

interface OnboardingModalProps {
  onComplete: () => void
  isVisible: boolean
}

const Categories = [
  'FullStack', 'FrontEnd','BackEnd','Data & Analytics','AI & ML','Cybersecurity','DevOps',
  'Game Development','Mobile Dev','SWE', 'Quant','AR/VR','Research','IT','QA & Testing',
]

// Tooltip component
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block group">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg transition-all duration-200 z-50 max-w-48 text-center ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {content}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
      </div>
    </div>
  )
}


export default function OnboardingModal({ onComplete, isVisible }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0) // 0: Welcome, 1: Companies, 2: Categories, 3: Work Auth, 4: Review
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<OnboardingData>({
    preferred_companies: [],
    preferred_categories: [],
    hidden_companies: [],
    hide_not_sponsor: false,
    hide_not_american: false,
    hideNG: true,
    hideET: true,
    hideInternships: true,
  })

  const submitOnboarding = useSubmitOnboarding()
  const { data: companiesData, isLoading: companiesLoading, error: companiesError } = useCompanies()

  const companies = companiesData?.companies ?? []
  const filteredCompanies = companies.filter((company: Company) => {
    return company.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleCompanySelect = (companyId: number, type: 'favorite' | 'hide' | 'remove') => {
    setFormData(prev => {
      const newData = { ...prev }
      
      newData.preferred_companies = prev.preferred_companies.filter(c => c !== companyId)
      newData.hidden_companies = prev.hidden_companies.filter(c => c !== companyId)
      if (type === 'favorite') {
        newData.preferred_companies.push(companyId)
      } else if (type === 'hide') {
        newData.hidden_companies.push(companyId)
      }
      return newData
    })
  }

  const getCompanyState = (companyId: number): 'favorite' | 'hidden' | 'default' => {
    if (formData.preferred_companies.includes(companyId)) return 'favorite'
    if (formData.hidden_companies.includes(companyId)) return 'hidden'
    return 'default'
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const isCurrentlySelected = prev.preferred_categories.includes(category)
      if (isCurrentlySelected) {
        return {
          ...prev,
          preferred_categories: prev.preferred_categories.filter(c => c !== category)
        }
      } else {
        if (prev.preferred_categories.length < 4) {
          return {
            ...prev,
            preferred_categories: [...prev.preferred_categories, category]
          }
        }
        return prev
      }
    })
  }

  const handleNext = () => {
    if (currentStep === 3 && formData.hideET && formData.hideNG && formData.hideInternships) {
      return 
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBegin = () => {
    setCurrentStep(1)
  }

  const handleSubmit = async () => {
    try {
      await submitOnboarding.mutateAsync(formData)
      onComplete()
    } catch (error) {
      console.error('Failed to submit onboarding:', error)
    }
  }
  const getSelectedCompanies = (companyIds: number[]): Company[] => {
    if (!companies) return []
    return companies.filter(company => companyIds.includes(company.id))
  }

  if (!isVisible) return null

  return (
    <div className={styles.Overlay}>
      <div className={styles.Modal}>
        {/* Header */}
        {currentStep > 0 && (
          <div className="p-4">
            <div className="w-1/2 bg-gray-200 rounded-full h-2 mx-auto">
              <div 
                className="bg-[#0353A4] h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
            <div className={styles.HeaderContent}>
              <div className='flex justify-center items-center '>
                {currentStep === 1 && (
                  <div>
                  <h3 className={styles.StepTitle}>Set Your Company Preferences</h3>
                  <p className={styles.StepSubtitle}>
                    ⭐ We’ll show jobs from your favorite companies first<br/>
                    🚫 We’ll hide jobs from companies you don’t want to see
                  </p>
                </div>
                )}
                {currentStep === 2 && (
                  <div>
                  <h3 className={styles.StepTitle}>Select Your Roles Preferences</h3>
                  <p className={styles.StepSubtitle}>
                    Select your areas of interest to personalize your job recommendations
                  </p>
                </div>
                )}
                {currentStep === 3 && (
                  <div>
                  <h3 className={styles.StepTitle}>Set Your Job Preferences</h3>
                  <p className={styles.StepSubtitle}>
                    Choose which jobs you'd like us to show you <br/>
                    We'll hide the ones that don't match your criteria
                  </p>
                </div>
                )}
                {currentStep === 4 && (
                  <div>
                  <h3 className={styles.StepTitle}>Review Your Preferences</h3>
                  <p className={styles.StepSubtitle}>
                    Review your selections before we personalize your experience
                  </p>
                </div>
                )}
              </div>
            </div>            
          </div>
        )}
        

        {/* Step 0: Welcome */}
        {currentStep === 0 && (
          <div className={styles.Content}>
            <div className={styles.WelcomeContainer}>
              <h1 className={styles.WelcomeTitle}>LETS START BY SETTING YOUR PREFERENCES</h1>
              <p className={styles.WelcomeSubtitle}>
                You can modify this preferences in your profile as well
              </p>
              <button
                onClick={handleBegin}
                className={styles.BeginButton}
              >
                Begin
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Company Preferences */}
        {currentStep === 1 && (
          <div className={styles.Content}>    
            <div className={styles.CompanyPreferencesContainer}>
              {/* Search */}
              <div className={styles.SearchContainer}>

                <InputWithIcons
                  placeholder="Company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon="resources/Icons/Components_Cards/Company_Filter_Cards.png"
                  rightIcon="resources/Icons/search_icon.png"
                  inputClassName={styles.Input}
                 />

              </div>

              {/* Company Grid */}
              <div className={styles.CompanyGrid}>
                {companiesLoading && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Loading companies...
                  </div>
                )}
                {filteredCompanies.map((company: Company) => {
                  const state = getCompanyState(company.id)
                  
                  return (
                    <div
                      key={company.id}
                      className={`${styles.CompanyCard} ${
                        state === 'favorite' ? styles.CompanyCardFavorite :
                        state === 'hidden' ? styles.CompanyCardHidden :
                        styles.CompanyCardDefault
                      }`}
                      onClick={() => {
                        if (state === 'favorite') {
                          handleCompanySelect(company.id, 'hide')
                        } else if (state === 'hidden') {
                          handleCompanySelect(company.id, 'remove')
                        } else {
                          handleCompanySelect(company.id, 'favorite')
                        }
                      }}
                    >
                      {/* Company Logo */}
                      <div className={styles.CompanyLogo}>
                        {company.logo_url ? (
                          <img
                            src={company.logo_url}
                            alt={`${company.name} logo`}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 ${company.logo_url ? 'hidden' : ''}`}>
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <span className="text-xs font-semibold leading-tight">{company.name}</span>
                      
                      {/* Badge */}
                      {state !== 'default' && (
                        <div className={`${styles.CompanyBadge} ${
                          state === 'favorite' ? styles.FavoriteBadge : styles.HiddenBadge
                        }`}>
                          {state === 'favorite' ? (
                            <svg className={styles.StarIcon} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ) : (
                            <svg className={styles.EyeSlashIcon} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Role Preferences */}
        {currentStep === 2 && (
          <div className={styles.Content}>
            <div className={styles.CategoryGrid}>
              {Categories.map(category => {
                const isSelected = formData.preferred_categories.includes(category)
                const isAtLimit = formData.preferred_categories.length >= 4
                const isDisabled = !isSelected && isAtLimit
                
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    disabled={isDisabled}
                    className={`${styles.CategoryCard} ${
                      isSelected
                        ? styles.CategoryCardSelected
                        : isDisabled
                        ? styles.CategoryCardDisabled
                        : styles.CategoryCardDefault
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
            <div className="text-center mt-2">
              <span className={`text-sm ${formData.preferred_categories.length >= 4 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                {formData.preferred_categories.length}/4 selected
              </span>
            </div>
          </div>
        )}

        {/* Step 3: Work Authorization */}
        {currentStep === 3 && (
          <div className={styles.Content}>
            <div className={styles.LegalStatusContainer}>
              <div className={styles.LegalSection}>
                <h4 className={styles.LegalSectionTitle}>Work Authorization Filters</h4>
                <p className={styles.LegalSubtitle}> <strong>Hide</strong> jobs that:</p>
                
                <div className={styles.RadioGroup}>
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      checked={formData.hide_not_sponsor}
                      onChange={(e) => setFormData(prev => ({ ...prev, hide_not_sponsor: e.target.checked }))}
                      className={styles.RadioInput}
                    />
                    <span className={styles.RadioLabel}>
                      Don't offer Visa Sponsorship
                      <Tooltip content="Hide jobs that don't provide work visa sponsorship for international applicants">
                        <svg className={styles.TooltipIcon} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </span>
                  </label>
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      checked={formData.hide_not_american}
                      onChange={(e) => setFormData(prev => ({ ...prev, hide_not_american: e.target.checked }))}
                      className={styles.RadioInput}
                    />
                    <span className={styles.RadioLabel}>
                      Require U.S Citizenship
                      <Tooltip content="Hide jobs that require U.S. citizenship or permanent residency">
                        <svg className={styles.TooltipIcon} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </span>
                  </label>
                </div>
              </div>

              <div className={styles.LegalSection}>
                <h4 className={styles.LegalSectionTitle}>Role Levels You're Interested In</h4>
                <p className="text-sm text-gray-600 mb-4">We'll <strong>hide</strong> the rest.</p>
                
                <div className="  grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      className={styles.RadioInput}
                      checked={!formData.hideET}
                      onChange={(e) => setFormData(prev => ({ ...prev, hideET: !e.target.checked }))}
                    />
                    <span className={styles.RadioLabel}>
                      Emerging Talent Programs
                      <Tooltip content="Sophomore and Freshman programs">
                        <svg className={styles.TooltipIcon} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </span>
                  </label>
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      className={styles.RadioInput}
                      checked={!formData.hideNG}
                      onChange={(e) => setFormData(prev => ({ ...prev, hideNG: !e.target.checked }))}
                    />
                    <span className={styles.RadioLabel}>
                      New Grad
                      <Tooltip content="Positions designed for recent college graduates (0-2 years experience)">
                        <svg className={styles.TooltipIcon} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </span>
                  </label>
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      className={styles.RadioInput}
                      checked={!formData.hideInternships}
                      onChange={(e) => setFormData(prev => ({ ...prev, hideInternships: !e.target.checked }))}
                    />
                    <span className={styles.RadioLabel}>
                      Internships
                      <Tooltip content="Temporary positions for students gaining work experience">
                        <svg className={styles.TooltipIcon} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </Tooltip>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review Preferences */}
        {currentStep === 4 && (
          <div className={styles.Content}>
            <div className={styles.ReviewContainer}>
                            {/* No selections message */}
              {formData.preferred_companies.length === 0 && 
               formData.hidden_companies.length === 0 && 
               formData.preferred_categories.length === 0 && (
                <div className="text-center ">
                  <div className="text-black ">
                    <p className="text-lg font-medium">No specific preferences selected</p>
                    <p className="text-sm">We'll show you all available jobs to get you started!</p>
                  </div>
                </div>
              )}
              {/* Preferred Companies */}
              {getSelectedCompanies(formData.preferred_companies).length > 0 && (
                <div className="mb-6">
                  <h3 className={styles.ReviewSectionTitle}>
                    <span className={styles.PreferredIcon}>⭐</span>
                    Preferred Companies ({getSelectedCompanies(formData.preferred_companies).length})
                  </h3>
                  <div className={`${styles.CompanyReviewGrid} ${styles.CompanyReviewGridPreferred}`}>
                    {getSelectedCompanies(formData.preferred_companies).map(company => (
                      <div key={company.id} className={styles.CompanyReviewCard}>
                        {company.logo_url ? (
                          <img src={company.logo_url} alt={company.name} className={styles.CompanyReviewLogo} />
                        ) : (
                          <div className={styles.CompanyReviewLogoFallback}>
                            {company.name.charAt(0)}
                          </div>
                        )}
                        <span className={styles.CompanyReviewName}>{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hidden Companies */}
              {getSelectedCompanies(formData.hidden_companies).length > 0 && (
                <div className="mb-6">
                  <h3 className={styles.ReviewSectionTitle}>
                    <span className={styles.HiddenIcon}>🚫</span>
                    Hidden Companies ({getSelectedCompanies(formData.hidden_companies).length})
                  </h3>
                  <div className={`${styles.CompanyReviewGrid} ${styles.CompanyReviewGridHidden}`}>
                    {getSelectedCompanies(formData.hidden_companies).map(company => (
                      <div key={company.id} className={styles.CompanyReviewCard}>
                        {company.logo_url ? (
                          <img src={company.logo_url} alt={company.name} className={styles.CompanyReviewLogo} />
                        ) : (
                          <div className={styles.CompanyReviewLogoFallback}>
                            {company.name.charAt(0)}
                          </div>
                        )}
                        <span className={styles.CompanyReviewName}>{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Categories */}
              {formData.preferred_categories.length > 0 && (
                <div className="mb-6">
                  <h3 className={styles.ReviewSectionTitle}>
                    Role Preferences ({formData.preferred_categories.length}/4)
                  </h3>
                  <div className={styles.CategoryReviewGrid}>
                    {formData.preferred_categories.map(category => (
                      <div key={category} className={styles.CategoryReviewCard}>
                        <span className={styles.CategoryReviewName}>{category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Authorization Preferences */}
              <div className="mb-6">
                <h3 className={styles.ReviewSectionTitle}>Work Authorization Preferences</h3>
                <div >
                  <div className="space-y-2">
                    <div className={styles.WorkAuthReviewItem}>
                      <span className={formData.hide_not_sponsor ? styles.WorkAuthReviewIndicatorHide : styles.WorkAuthReviewIndicatorShow}></span>
                      <span className="text-sm text-black">
                        {formData.hide_not_sponsor ? 'Hide jobs that don\'t offer visa sponsorship' : 'Show all jobs regardless of visa sponsorship'}
                      </span>
                    </div>
                    <div className={styles.WorkAuthReviewItem}>
                      <span className={formData.hide_not_american ? styles.WorkAuthReviewIndicatorHide : styles.WorkAuthReviewIndicatorShow}></span>
                      <span className="text-sm text-black">
                        {formData.hide_not_american ? 'Hide jobs that require U.S. citizenship' : 'Show all jobs regardless of citizenship requirements'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Level Preferences */}
              <div className="mb-6">
                <h3 className={styles.ReviewSectionTitle}>Role Level Preferences</h3>
                <div>
                  <div className="space-y-2 ">
                    <div className="flex items-center gap-2">
                      <span className={ formData.hideET ? styles.RoleLevelsReviewIndicatorHide : styles.RoleLevelsReviewIndicatorShow}></span>
                      <span className="text-sm text-black">
                        {formData.hideET ? 'Hide Emerging Talent Programs' : 'Show Emerging Talent Programs'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={formData.hideNG ? styles.RoleLevelsReviewIndicatorHide : styles.RoleLevelsReviewIndicatorShow}></span>
                      <span className="text-sm text-black">
                        {formData.hideNG ? 'Hide New Grad positions' : 'Show New Grad positions'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={formData.hideInternships ? styles.RoleLevelsReviewIndicatorHide : styles.RoleLevelsReviewIndicatorShow}></span>
                      <span className="text-sm text-black">
                        {formData.hideInternships ? 'Hide Internship positions' : 'Show Internship positions'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        )}

        {/* Footer */}
        {currentStep > 0 && (
          <div className={styles.Footer}>
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={styles.BackButton}
            >
              Back
            </button>

            <div className="text-sm text-gray-500">Step {currentStep} of 4</div>

            
            <div className={styles.ButtonGroup}>
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={currentStep === 3 && formData.hideET && formData.hideNG && formData.hideInternships}
                  className={`${styles.NextButton} ${currentStep === 3 && formData.hideET && formData.hideNG && formData.hideInternships ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitOnboarding.isPending}
                  className={styles.CompleteButton}
                >
                  {submitOnboarding.isPending ? (
                    <>
                      <div className={styles.LoadingSpinner} />
                      Completing...
                    </>
                  ) : (
                    'Finish'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}