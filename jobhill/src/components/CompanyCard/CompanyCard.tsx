"use client";
import { CompanyCardProps } from "@/interfaces/OfferCard";
import { CompanyCardStyles } from "@/styles/OfferCardStyles"; 
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useState } from "react";

interface CompanyCardComponentProps {
    card: CompanyCardProps;
    onCompanyClick: (companyId: number, companyName: string) => void;
    onHideCompany?: (companyId: number) => void;
    onPreferCompany?: (companyId: number, isCurrentlyPreferred: boolean) => void;
}

const CompanyCard = ({ card, onCompanyClick, onHideCompany, onPreferCompany }: CompanyCardComponentProps) => {
    const [showConfirmHide, setShowConfirmHide] = useState(false);
    const { data: userPreferencesData } = useUserPreferences();

    const isPreferred = userPreferencesData?.preferences?.preferred_companies?.includes(card.id) || false;
    const isHidden = userPreferencesData?.preferences?.hidden_companies?.includes(card.id) || false;

    const handleCardClick = () => {
        onCompanyClick(card.id, card.name);
    };

    const handleHideClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirmHide(true);
    };

    const handleConfirmHide = () => {
        onHideCompany?.(card.id);
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
            <div className="w-full flex justify-center">
                <div className={`${CompanyCardStyles.Card} ${isHidden ? 'border-red-500' : isPreferred ? 'border-green-500 border-2' : 'border-gray-200'}`}
                    onClick={handleCardClick}
                >
                    <div className={CompanyCardStyles.CardTop}>
                        <div className={CompanyCardStyles.IconContainer}>
                            <div className={`${CompanyCardStyles.HideIcon} ${isHidden ? CompanyCardStyles.HideIconActive : ''}`} onClick={handleHideClick} onMouseDown={(e) => e.stopPropagation()}>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            </div>
                            <div className={`${CompanyCardStyles.PreferIcon} ${isPreferred ? CompanyCardStyles.PreferIconActive : ''}`} onClick={handlePreferClick} onMouseDown={(e) => e.stopPropagation()}>
                                {isPreferred ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                )}
                            </div>
                        </div >
                        <div className="flex flex-col items-center">
                                <img
                                src={card.logoSrc}
                                alt={`${card.name} Logo`}
                                className={CompanyCardStyles.Logo}
                                 onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <div className={`w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-600 ${card.logoSrc ? 'hidden' : ''}`}>
                          {card.name.charAt(0).toUpperCase()}
                        </div>
                        </div>
     
           

                        <div className={CompanyCardStyles.CardContent}>
                            <h3 className={CompanyCardStyles.CompanyName}>
                                {card.name}
                            </h3>
                            <p className={CompanyCardStyles.OfferCount}>
                                {card.offerCount} {card.offerCount === 1 ? 'offer' : 'offers'}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmHide && (
                <div className="fixed inset-0 bg-black/40  flex items-center justify-center text-center z-50">
                    <div className={CompanyCardStyles.Modal}>
                        <h3 className={CompanyCardStyles.ModalTitle}>
                            Hide Company
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to hide all jobs from <strong> {card.name}</strong>? <br /> This action can be undone in your preferences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center ">
                            <button
                                onClick={handleCancelHide}
                                className="px-4 py-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmHide}
                                className="px-4 py-2  bg-[#0353A4] text-white rounded-md hover:bg-[#004181] transition-colors cursor-pointer"
                            >
                                Hide Company
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CompanyCard;