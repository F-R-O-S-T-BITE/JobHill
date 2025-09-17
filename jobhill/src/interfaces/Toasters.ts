export interface HideJobToastProps {
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  onUndo: () => void;
  onExpire?: () => void;
  toastId: string;
}

export interface ApplicationSuccessToastProps {
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  toastId: string;
}

export interface HideCompanyToastProps {
  companyLogo: string;
  companyName: string;
  jobCount: number;
  onUndo: () => void;
  onExpire?: () => void;
  toastId: string;
}