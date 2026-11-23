"use client";
// components/CompanyCard/CompanyCard.tsx
import { CompanyCardProps } from "@/interfaces/OfferCard";
import { EyeOff, Star } from "lucide-react";
import { CompanyCardStyles, OfferCardModalStyles } from "@/styles/OfferCardStyles";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useState } from "react";

interface CompanyCardComponentProps {
    card: CompanyCardProps;
    onCompanyClick: (companyId: number, companyName: string) => void;
    onHideCompany?: (companyId: number, isCurrentlyPreferred: boolean) => void;
    onPreferCompany?: (companyId: number, isCurrentlyPreferred: boolean) => void;
}

const CompanyCard = ({ card, onCompanyClick, onHideCompany, onPreferCompany }: CompanyCardComponentProps) => {
    const [showConfirmHide, setShowConfirmHide] = useState(false);
    const { data: userPreferencesData } = useUserPreferences();

    const isHidden = userPreferencesData?.preferences?.hidden_companies?.includes(card.id) || false;
    const isPreferred = (userPreferencesData?.preferences?.preferred_companies?.includes(card.id) || false) && !isHidden; 

    const handleCardClick = () => {
        onCompanyClick(card.id, card.name);
    };

    const handleHideClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirmHide(true);
    };

    const handleConfirmHide = () => {
        onHideCompany?.(card.id, isPreferred);
        setShowConfirmHide(false);
    };

    const handleCancelHide = () => {
        setShowConfirmHide(false);
    };

    const handlePreferClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onPreferCompany?.(card.id, isPreferred);
    };

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                aria-label={`View ${card.offerCount} jobs at ${card.name}`}
                className={`${CompanyCardStyles.Card} ${isHidden ? '!border-red-300 bg-red-50/30' : isPreferred ? '!border-amber-300 ring-1 ring-amber-200' : ''}`}
                onClick={handleCardClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick();
                    }
                }}
            >
                <div className={CompanyCardStyles.IconContainer}>
                    <button
                        type="button"
                        aria-label={`Hide ${card.name}`}
                        title="Hide company"
                        className={`${CompanyCardStyles.IconButton} ${isHidden ? CompanyCardStyles.HideIconActive : ''}`}
                        onClick={handleHideClick}
                        onKeyDown={(e) => e.stopPropagation()}
                    >
                        <EyeOff className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        aria-label={isPreferred ? `Remove ${card.name} from preferred` : `Prefer ${card.name}`}
                        aria-pressed={isPreferred}
                        title={isPreferred ? 'Preferred company' : 'Mark as preferred'}
                        className={`${CompanyCardStyles.IconButton} ${isPreferred ? CompanyCardStyles.PreferIconActive : ''}`}
                        onClick={handlePreferClick}
                        onKeyDown={(e) => e.stopPropagation()}
                    >
                        <Star className={`h-4 w-4 ${isPreferred ? 'fill-current' : ''}`} />
                    </button>
                </div>

                <CompanyLogo src={card.logoSrc} name={card.name} className="mt-6 h-16 w-16" rounded="rounded-2xl" />

                <div className={CompanyCardStyles.CardContent}>
                    <h3 className={CompanyCardStyles.CompanyName} title={card.name}>{card.name}</h3>
                    <p className={CompanyCardStyles.OfferCount}>
                        {card.offerCount} {card.offerCount === 1 ? 'open role' : 'open roles'}
                    </p>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmHide && (
                <div className={OfferCardModalStyles.Overlay} onClick={handleCancelHide}>
                    <div className={OfferCardModalStyles.Modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <EyeOff className="h-6 w-6" />
                        </div>
                        <h3 className={OfferCardModalStyles.Title}>Hide {card.name}?</h3>
                        <p className={OfferCardModalStyles.Subtitle}>
                            All jobs from <strong className="text-slate-900">{card.name}</strong> will be hidden. You can undo this anytime from your preferences.
                        </p>
                        <div className={OfferCardModalStyles.ButtonRow}>
                            <button onClick={handleCancelHide} className={OfferCardModalStyles.CancelButton}>
                                Cancel
                            </button>
                            <button onClick={handleConfirmHide} className="btn-danger w-full py-3 sm:w-auto sm:px-6">
                                Hide company
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CompanyCard;