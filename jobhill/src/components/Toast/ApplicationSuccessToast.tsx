import { toast } from 'react-hot-toast';
import { ApplicationSuccessToastStyles } from '@/styles/OfferCardStyles';
import { ApplicationSuccessToastProps } from '@/interfaces/Toasters';

export default function ApplicationSuccessToast({ 
  companyLogo, 
  jobTitle, 
  companyName, 
  toastId 
}: ApplicationSuccessToastProps) {

  return (
    <div className={ApplicationSuccessToastStyles.ToastWrapper}>
      <div className={ApplicationSuccessToastStyles.ToastShadow}></div>
      <div className={ApplicationSuccessToastStyles.Container}>
        <div className={ApplicationSuccessToastStyles.LogoContainer}>
          <img
            src={companyLogo}
            alt={`${companyName} logo`}
            className={ApplicationSuccessToastStyles.Logo}
          />
        </div>
        
        <div className={ApplicationSuccessToastStyles.Content}>
          <div className={ApplicationSuccessToastStyles.MessageContainer}>
            {/* Check icon */}
            <svg 
              className={ApplicationSuccessToastStyles.CheckIcon} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <span className={ApplicationSuccessToastStyles.MessageText}>
              Applied to:
            </span>
          </div>
          <div className={ApplicationSuccessToastStyles.JobTitle}>
            {jobTitle}
          </div>
          <div className={ApplicationSuccessToastStyles.CompanyName}>
            {companyName}
          </div>
        </div>
      </div>
    </div>
  );
}

export function showApplicationSuccessToast({
  companyLogo,
  jobTitle,
  companyName
}: Omit<ApplicationSuccessToastProps, 'toastId'>) {
  
  return toast.custom((t) => (
    <ApplicationSuccessToast
      companyLogo={companyLogo}
      jobTitle={jobTitle}
      companyName={companyName}
      toastId={t.id}
    />
  ), {
    duration: 4000, // 4 seconds - shorter than hide toast since no interaction needed
  });
}