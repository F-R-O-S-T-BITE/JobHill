import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { HideJobToastStyles } from '@/styles/OfferCardStyles';
import { HideJobToastProps } from '@/interfaces/Toasters';

export default function HideJobToast({ 
  companyLogo, 
  jobTitle, 
  companyName, 
  onUndo, 
  toastId 
}: HideJobToastProps) {
  
  const [progress, setProgress] = useState(100);
  const [secondsLeft, setSecondsLeft] = useState(7);
  
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
        
        // Auto-dismiss toast when timer reaches 0
        if (newProgress <= 0) {
          setTimeout(() => toast.dismiss(toastId), 0);
          return 0;
        }
        
        return newProgress;
      });
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [toastId]);

  return (
    <div className={HideJobToastStyles.ToastWrapper}>
      <div className={HideJobToastStyles.ToastShadow}></div>
      <div className={HideJobToastStyles.Container}>
        <div className={HideJobToastStyles.ContentRow}>
          <div className={HideJobToastStyles.LogoContainer}>
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className={HideJobToastStyles.Logo}
            />
          </div>
          
          <div className={HideJobToastStyles.Content}>
              <div className={HideJobToastStyles.HiddenRow}>
              <img
                src="/resources/Icons/Cards/Hide_Icon_Blue_Component_Cards.png"
                alt="Hidden"
                className={HideJobToastStyles.HiddenIcon}
              />
              <p className={HideJobToastStyles.HiddenText}>
                Hiding Job
              </p>
            </div>
            <p className={HideJobToastStyles.JobTitle}>
              {jobTitle}
            </p>
            <p className={HideJobToastStyles.CompanyName}>
              {companyName}
            </p>
          </div>
        </div>
        
        <div className={HideJobToastStyles.BottomRow}>
          <div className={HideJobToastStyles.ProgressContainer}>
            <div className={HideJobToastStyles.ProgressHeader}>
              <button
            onClick={handleUndo}
            className={HideJobToastStyles.BottomUndoButton}
          >
            <img
              src="/resources/Icons/Components_Cards/undo_icon_component_cards.png"
              alt="Undo"
              className={HideJobToastStyles.UndoIcon}
            />
            Undo
          </button>
              <span className={HideJobToastStyles.SecondsDisplay}>{secondsLeft}s</span>
            </div>
            <div className={HideJobToastStyles.ProgressBar}>
              <div 
                className={HideJobToastStyles.ProgressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function showHideJobToast({
  companyLogo,
  jobTitle,
  companyName,
  onUndo
}: Omit<HideJobToastProps, 'toastId'>) {
  
  return toast.custom((t) => (
    <HideJobToast
      companyLogo={companyLogo}
      jobTitle={jobTitle}
      companyName={companyName}
      onUndo={onUndo}
      toastId={t.id}
    />
  ), {
    duration: 6400, // Slightly Shorter than the internal timer to ensure it disappears smoothly
  });
}