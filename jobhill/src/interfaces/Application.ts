export const APPLICATION_STATUSES = [
  'Applied',
  'OA',
  'Behavioral',
  'Technical 1',
  'Technical 2',
  'Technical 3',
  'Technical 4',
  'Offer',
  'Declined',
  'Rejected',
  'Ghosted',
  'Delivered',
  'Process',
  'Canceled'
] as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[number];  

export interface Application {
  id: string;
  job_offer_id: string;
  user_id: string;
  company_id: number;
  company_name: string;
  role: string;
  location: string;
  applied_date: string;
  last_updated: string;
  referral_type: 'Cold Apply' | 'Employee Ref' | 'Referred';
  status: ApplicationStatus;
  application_link?: string;
  company_logo?: string | null;
}

export interface ApplicationFilters {
  company: string[];
  category: string[];
  status: string;
  referral: string;
  location: string;
  order: 'newest' | 'oldest';
}

export interface CreateApplicationData {
  job_offer_id: string;
  referral_type: 'Cold Apply' | 'Employee Ref' | 'Referred';
  application_link?: string;
}