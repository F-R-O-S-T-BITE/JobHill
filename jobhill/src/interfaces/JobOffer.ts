export interface Company {
  id: number;
  name: string;
  logo_url: string;
}

export interface JobOffer {
  id: string;
  company_id: number;
  job_title: string;
  location: string[];
  modality: string;
  period: string;
  categories: string[];
  status: string;
  created_at: string;
  updated_at: string;
  application_link: string;
  noSponsor: number;
  usaCitizen: number;
  emergingTalent: number;
  newGrad: number;
  company: Company;
}

export interface JobOfferResponse extends JobOffer {
  is_applied?: boolean;
  is_favorite?: boolean;
  preference_score?: number;
  relevance_tier?: number;
  is_preferred_company?: boolean;
  matching_categories?: string[];
}

export interface JobOffersFilters {
  categories?: string[];
  modality?: string[];
  location?: string[];
  company?: string[];
  period?: string[];
  search?: string;
}

export interface JobOffersApiResponse {
  jobs: JobOfferResponse[];
  total: number;
  userPreferences?: UserPreferences;
}

export interface UserPreferences {
  user_id: string;
  hidden_jobs: string[];
  hidden_companies: number[];
  preferred_companies: number[];
  preferred_categories: string[];
  requires_sponsorship: boolean;
  american_citizen: boolean;
  hideNG: boolean;
  hideET: boolean;
  hideInternships: boolean;
  dont_show_conf_hide: boolean;
  favorite_jobs: string[];
}

export interface OnboardingData {
  preferred_companies: number[];
  preferred_categories: string[];
  hidden_companies: number[];
  hide_not_sponsor: boolean;
  hide_not_american: boolean;
  hideNG: boolean;
  hideET: boolean;
  hideInternships: boolean;

}