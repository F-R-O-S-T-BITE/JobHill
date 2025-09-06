"use client"

import { useState,useCallback } from "react";
import { OfferCardLogic } from "@/interfaces/OfferCard";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { showHideJobToast } from "@/components/Toast/HideJobToast";
import { hideJob, unhideJob } from "@/components/OfferCard/OfferCardHolder";
import { useHideJob } from "@/hooks/useJobOffers";

export function useOfferCardLogic(CardLogic:OfferCardLogic)  {
    const [isFavorite,setIsFavorite] = useState(false);
    const [isConfirmationAppliedModalOpen,setisConfirmationAppliedModalOpen] = useState(false); //Modal for asking if user applied to the job, after redirecting
    const [isAddModalOpen,setIsAddModalOpen] = useState(false); //Modal for adding new application
    const {user, openLoginModal} = useAuthModal();
    const hideJobMutation = useHideJob();

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
        // TODO: Save to favorites logic
        // FrontLogic
        return requireAuth(() => {
            setIsFavorite(prev => !prev);
        });
        
        // BackendLogic
        // ? Handle logic process of DB logic to mark as favorite
        // ? Handle logic process of DB logic to mark as not favorite if it is already a favorite card
    }, []);

    const handleAddClick = useCallback(() => {
        return requireAuth(() => setIsAddModalOpen(true));
    }, []);

    const handleRegisterNewApplication = useCallback(() => {
        //Logic to add users application to its list of applications
    }, []);

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

    const _addLogic = () => {

    }

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
        handleApplyClick                       
    };                         

}