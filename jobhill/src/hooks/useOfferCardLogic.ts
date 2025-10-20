"use client"

import { useState,useCallback, useMemo } from "react";
import { OfferCardLogic } from "@/interfaces/OfferCard";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { showHideJobToast } from "@/components/Toast/HideJobToast";
import { showApplicationSuccessToast } from "@/components/Toast/ApplicationSuccessToast";
import { hideJob, unhideJob } from "@/components/OfferCard/OfferCardHolder";
import { useUserPreferences, useFavoriteJob, useUnfavoriteJob } from "@/hooks/useUserPreferences";
import { useCreateApplication, useHideJob } from "@/hooks/useJobOffers";

export function useOfferCardLogic(CardLogic:OfferCardLogic)  {
    const [isConfirmationAppliedModalOpen,setisConfirmationAppliedModalOpen] = useState(false); //Modal for asking if user applied to the job, after redirecting
    const [isAddModalOpen,setIsAddModalOpen] = useState(false); //Modal for adding new application
    const {user, openLoginModal} = useAuthModal();
    
    // Get user preferences and mutations
    const { data: userPreferencesData } = useUserPreferences();
    const favoriteJobMutation = useFavoriteJob();
    const unfavoriteJobMutation = useUnfavoriteJob();
    const hideJobMutation = useHideJob();
    const createApplicationMutation = useCreateApplication();
    
    // Check if job is favorited based on cached preferences
    const isFavorite = useMemo(() => {
        if (!CardLogic.card.id || !userPreferencesData?.preferences?.favorite_jobs) {
            return false;
        }
        return userPreferencesData.preferences.favorite_jobs.includes(CardLogic.card.id);
    }, [CardLogic.card.id, userPreferencesData?.preferences?.favorite_jobs]);

    const requireAuth = useCallback((action: () => void) => {
        if (!user) {
            openLoginModal();
            return;
        }
        action();
    }, [user, openLoginModal]);
    

    const handleHideClick= useCallback(() => {
        return requireAuth(() => {
            const jobId = CardLogic.card.id || `${CardLogic.card.title}-${CardLogic.card.company}`;
            // Hide job UI 
            hideJob(jobId);
            // Update the grid display
            if ((window as any).updateOfferCardHolder) {
                (window as any).updateOfferCardHolder();
            }
            showHideJobToast({
                companyLogo: CardLogic.card.logoSrc,
                jobTitle: CardLogic.card.title,
                companyName: CardLogic.card.company,
                onUndo: () => {
                    unhideJob(jobId);
                    if ((window as any).updateOfferCardHolder) {
                        (window as any).updateOfferCardHolder();
                    }
                },
                onExpire: () => {
                    hideJobMutation.mutate(jobId);
                }
            });
        });
    }, [CardLogic.card.logoSrc, CardLogic.card.title, CardLogic.card.company, CardLogic.card.id, requireAuth, hideJobMutation]);

    const handleFavoriteClick = useCallback(() => {
        return requireAuth(() => {
            if (!CardLogic.card.id) return;
            
            if (isFavorite) {
                unfavoriteJobMutation.mutate(CardLogic.card.id);
            } else {
                favoriteJobMutation.mutate(CardLogic.card.id);
            }
        });
    }, [CardLogic.card.id, isFavorite, requireAuth, favoriteJobMutation, unfavoriteJobMutation]);

    const handleAddClick = useCallback(() => {
        return requireAuth(() => setIsAddModalOpen(true));
    }, []);

    const handleRegisterNewApplication = useCallback((applicationData: {
        dateApplied: string;
        referralType: 'Cold Apply' | 'Referred';
        status: string;
    }) => {
        return requireAuth(async () => {
            if (!CardLogic.card.id) {
                console.error('Job ID is missing');
                return;
            }

            try {
                await createApplicationMutation.mutateAsync({
                    job_offer_id: CardLogic.card.id,
                    company_name: CardLogic.card.company,
                    role: CardLogic.card.title,
                    referral_type: applicationData.referralType,
                    application_link: CardLogic.card.applicationLink || '',
                    location: Array.isArray(CardLogic.card.location)
                        ? CardLogic.card.location.join(', ')
                        : CardLogic.card.location,
                    status: applicationData.status,
                    applied_date: applicationData.dateApplied,
                    company_logo: CardLogic.card.logoSrc
                });

                setIsAddModalOpen(false);

                showApplicationSuccessToast({
                    companyLogo: CardLogic.card.logoSrc,
                    jobTitle: CardLogic.card.title,
                    companyName: CardLogic.card.company
                });

            } catch (error) {
                console.error('Failed to register application:', error);
            }
        });
    }, [CardLogic.card.id, CardLogic.card.company, CardLogic.card.title, CardLogic.card.applicationLink, CardLogic.card.location, CardLogic.card.logoSrc, requireAuth, createApplicationMutation]);

    const handleApplyClick = useCallback(() => {
        window.open(CardLogic.card.applicationLink);
        setisConfirmationAppliedModalOpen(true); 
    }, []);
    const handleCancelShowConfirmationAddModal = useCallback(() => {
        setisConfirmationAppliedModalOpen(false);
    },[]);
    const handleShowAddModal = useCallback(() => {
        return requireAuth(() => {
            setisConfirmationAppliedModalOpen(false);
            setIsAddModalOpen(true);
        });
    },[]);
    const handleCancelShowAddModal = useCallback(() => {
        setIsAddModalOpen(false);
    },[]);

    return { 
        isFavorite,                            
        isConfirmationAppliedModalOpen,        
        isAddModalOpen,                        
        handleHideClick,                      
        handleFavoriteClick,                   
        handleAddClick,                       
        handleCancelShowConfirmationAddModal,  
        handleShowAddModal,                    
        handleCancelShowAddModal,              
        handleApplyClick,
        handleRegisterNewApplication                       
    };                         
}