import { toast } from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { HideCompanyToastStyles } from '@/styles/OfferCardStyles';
import { HideCompanyToastProps } from '@/interfaces/Toasters';

export default function HideCompanyToast({
  companyLogo,
  companyName,
  jobCount,
  onUndo,
  onExpire,
  toastId
}: HideCompanyToastProps) {

  const [progress, setProgress] = useState(100);
  const [secondsLeft, setSecondsLeft] = useState(7);
  const hasExpiredRef = useRef(false);

  const handleUndo = () => {
    onUndo();
    toast.dismiss(toastId);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.max(0, prev - (100 / 70)); // 70 intervals over 7 seconds
        const newSecondsLeft = Math.max(0, Math.ceil((newProgress / 100) * 7));
        setSecondsLeft(newSecondsLeft);

        if (newProgress <= 0 && !hasExpiredRef.current) {
          hasExpiredRef.current = true;
          if (onExpire) {
            onExpire();
          }
          setTimeout(() => toast.dismiss(toastId), 0);
          return 0;
        }

        return newProgress;
      });
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [toastId, onExpire]);

  return (
    <div className={HideCompanyToastStyles.ToastWrapper}>
      <div className={HideCompanyToastStyles.ToastShadow}></div>
      <div className={HideCompanyToastStyles.Container}>
        <div className={HideCompanyToastStyles.ContentRow}>
          <div className={HideCompanyToastStyles.LogoContainer}>
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${companyName} logo`}
                className={HideCompanyToastStyles.Logo}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 ${companyLogo ? 'hidden' : ''}`}>
              {companyName.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className={HideCompanyToastStyles.Content}>
            <div className={HideCompanyToastStyles.HiddenRow}>
              <svg className={HideCompanyToastStyles.HiddenIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
              <p className={HideCompanyToastStyles.HiddenText}>
                Hiding Company
              </p>
            </div>
            <p className={HideCompanyToastStyles.CompanyName}>
              {companyName}
            </p>
            <p className={HideCompanyToastStyles.JobCount}>
              {jobCount} {jobCount === 1 ? 'job' : 'jobs'} will be hidden
            </p>
          </div>
        </div>

        <div className={HideCompanyToastStyles.BottomRow}>
          <div className={HideCompanyToastStyles.ProgressContainer}>
            <div className={HideCompanyToastStyles.ProgressHeader}>
              <button
                onClick={handleUndo}
                className={HideCompanyToastStyles.BottomUndoButton}
              >
                <svg
                  className={HideCompanyToastStyles.UndoIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Undo
              </button>
              <span className={HideCompanyToastStyles.SecondsDisplay}>{secondsLeft}s</span>
            </div>
            <div className={HideCompanyToastStyles.ProgressBar}>
              <div
                className={HideCompanyToastStyles.ProgressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function showHideCompanyToast({
  companyLogo,
  companyName,
  jobCount,
  onUndo,
  onExpire
}: Omit<HideCompanyToastProps, 'toastId'>) {

  return toast.custom((t) => (
    <HideCompanyToast
      companyLogo={companyLogo}
      companyName={companyName}
      jobCount={jobCount}
      onUndo={onUndo}
      onExpire={onExpire}
      toastId={t.id}
    />
  ), {
    duration: 6400, // Slightly shorter than the internal timer to ensure it disappears smoothly
  });
}