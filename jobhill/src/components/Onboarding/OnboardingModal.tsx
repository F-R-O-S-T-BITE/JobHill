'use client'

import { useState } from 'react'
import { useSubmitOnboarding } from '@/hooks/useOnboarding'
import type { OnboardingData } from '@/interfaces/JobOffer'
import { OnboardingModalStyles as styles } from '@/styles/OnboardingModalStyles'

interface OnboardingModalProps {
  onComplete: () => void
  isVisible: boolean
}

// Sample data - you should fetch these from your API
const SAMPLE_COMPANIES = [
  'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla',
  'Spotify', 'Adobe', 'Salesforce', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn',
  'Stripe', 'Dropbox', 'Slack', 'Zoom', 'Shopify', 'Square', 'PayPal',
  'Intel', 'NVIDIA', 'AMD', 'IBM', 'Oracle', 'SAP', 'Cisco'
]

const SAMPLE_CATEGORIES = [
  'Software Engineering', 'Data Science', 'Product Management', 'Design',
  'Marketing', 'Sales', 'Finance', 'Operations', 'HR', 'Legal',
  'Customer Success', 'Business Development', 'Research', 'Consulting',
  'Back End', 'Front End', 'Full Stack', 'Mobile Dev', 'Game Dev',
  'AI & ML', 'Cybersecurity', 'DevOps', 'QA & Testing'
]

export default function OnboardingModal({ onComplete, isVisible }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0) // 0: Welcome, 1: Companies, 2: Categories, 3: Legal
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<OnboardingData>({
    preferred_companies: [],
    preferred_categories: [],
    hidden_companies: [],
    hide_not_sponsor: false,
    hide_not_american: false,
  })

  const submitOnboarding = useSubmitOnboarding()

  const filteredCompanies = SAMPLE_COMPANIES.filter(company =>
    company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCompanySelect = (company: string, type: 'favorite' | 'hide' | 'remove') => {
    setFormData(prev => {
      const newData = { ...prev }
      
      // Remove from both arrays first
      newData.preferred_companies = prev.preferred_companies.filter(c => c !== company)
      newData.hidden_companies = prev.hidden_companies.filter(c => c !== company)
      
      // Add to the appropriate array if not removing
      if (type === 'favorite') {
        newData.preferred_companies.push(company)
      } else if (type === 'hide') {
        newData.hidden_companies.push(company)
      }
      
      return newData
    })
  }

  const getCompanyState = (company: string): 'favorite' | 'hidden' | 'default' => {
    if (formData.preferred_companies.includes(company)) return 'favorite'
    if (formData.hidden_companies.includes(company)) return 'hidden'
    return 'default'
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_categories: prev.preferred_categories.includes(category)
        ? prev.preferred_categories.filter(c => c !== category)
        : [...prev.preferred_categories, category]
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
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

  if (!isVisible) return null

  return (
    <div className={styles.Overlay}>
      <div className={styles.Modal}>
        {/* Header */}
        {currentStep > 0 && (
          <div className={styles.Header}>
            <div className={styles.HeaderContent}>
              <h2 className={styles.Title}>Set Your Preferences</h2>
              <div className={styles.StepIndicator}>Step {currentStep} of 3</div>
            </div>
            <p className={styles.Subtitle}>Personalize your JobHill experience</p>
            
            {/* Progress Bar */}
            <div className={styles.ProgressBarContainer}>
              <div 
                className={styles.ProgressBar}
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
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
            <h3 className={styles.StepTitle}>Set Your Company Preferences</h3>
            <p className={styles.StepSubtitle}>
              👍 We'll show jobs from your favorite companies first<br/>
              👎 We'll hide jobs from companies you don't want to see
            </p>
            
            <div className={styles.CompanyPreferencesContainer}>
              {/* Search */}
              <div className={styles.SearchContainer}>
                <input
                  type="text"
                  placeholder="Company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.SearchInput}
                />
                <svg className={styles.SearchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Company Grid */}
              <div className={styles.CompanyGrid}>
                {filteredCompanies.map(company => {
                  const state = getCompanyState(company)
                  return (
                    <div
                      key={company}
                      className={`${styles.CompanyCard} ${
                        state === 'favorite' ? styles.CompanyCardFavorite :
                        state === 'hidden' ? styles.CompanyCardHidden :
                        styles.CompanyCardDefault
                      }`}
                      onClick={() => {
                        if (state === 'favorite') {
                          handleCompanySelect(company, 'hide')
                        } else if (state === 'hidden') {
                          handleCompanySelect(company, 'remove')
                        } else {
                          handleCompanySelect(company, 'favorite')
                        }
                      }}
                    >
                      {/* Company Logo Placeholder */}
                      <div className={styles.CompanyLogo}>
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                          {company.charAt(0)}
                        </div>
                      </div>
                      <span className={styles.CompanyName}>{company}</span>
                      
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

              <div className={styles.SelectionCounter}>
                Favorites: {formData.preferred_companies.length} • Hidden: {formData.hidden_companies.length}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Role Preferences */}
        {currentStep === 2 && (
          <div className={styles.Content}>
            <h3 className={styles.StepTitle}>Select Your Roles Preferences</h3>
            <p className={styles.StepSubtitle}>
              Select your areas of interest to personalize your job recommendations.
            </p>
            
            <div className={styles.CategoryGrid}>
              {SAMPLE_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`${styles.CategoryCard} ${
                    formData.preferred_categories.includes(category)
                      ? styles.CategoryCardSelected
                      : styles.CategoryCardDefault
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <p className={styles.SelectionCounter}>
              Selected: {formData.preferred_categories.length} categories
            </p>
          </div>
        )}

        {/* Step 3: Work Authorization */}
        {currentStep === 3 && (
          <div className={styles.Content}>
            <h3 className={styles.StepTitle}>Set your job preferences</h3>
            <p className={styles.StepSubtitle}>
              Choose which jobs you'd like us to show you. We'll hide the ones that don't match your criteria.
            </p>
            
            <div className={styles.LegalStatusContainer}>
              <div className={styles.LegalSection}>
                <h4 className={styles.LegalSectionTitle}>Work Authorization Filters</h4>
                <p className="text-sm text-gray-600 mb-4">Hide jobs that:</p>
                
                <div className={styles.RadioGroup}>
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      checked={formData.hide_not_sponsor}
                      onChange={(e) => setFormData(prev => ({ ...prev, hide_not_sponsor: e.target.checked }))}
                      className={styles.RadioInput}
                    />
                    <span className={styles.RadioLabel}>Don't offer Visa Sponsorship</span>
                  </label>
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      checked={formData.hide_not_american}
                      onChange={(e) => setFormData(prev => ({ ...prev, hide_not_american: e.target.checked }))}
                      className={styles.RadioInput}
                    />
                    <span className={styles.RadioLabel}>Require U.S Citizenship</span>
                  </label>
                </div>
              </div>

              <div className={styles.LegalSection}>
                <h4 className={styles.LegalSectionTitle}>Role Levels You're Interested In</h4>
                <p className="text-sm text-gray-600 mb-4">We'll <strong>hide</strong> the rest.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      className={styles.RadioInput}
                    />
                    <span className={styles.RadioLabel}>Emerging Talent Programs</span>
                  </label>
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      className={styles.RadioInput}
                    />
                    <span className={styles.RadioLabel}>New Grad</span>
                  </label>
                  <label className={styles.RadioOption}>
                    <input
                      type="checkbox"
                      className={styles.RadioInput}
                    />
                    <span className={styles.RadioLabel}>Internships</span>
                  </label>
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
            
            <div className={styles.ButtonGroup}>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className={styles.NextButton}
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
                    'Complete Setup'
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