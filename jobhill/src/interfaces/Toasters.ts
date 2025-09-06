export interface HideJobToastProps {
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  onUndo: () => void;
  onExpire?: () => void;
  toastId: string;
}