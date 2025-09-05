"use-client"

import { useState,useCallback } from "react";
import { OfferCardLogic } from "@/interfaces/OfferCard";
import { useAuthModal } from "@/contexts/AuthModalContext";

export function useOfferCardLogic(CardLogic:OfferCardLogic)  {
    const [isFavorite,setIsFavorite] = useState(false);
    const [isConfirmationAppliedModalOpen,setisConfirmationAppliedModalOpen] = useState(false); //Modal for asking if user applied to the job, after redirecting
    const [isAddModalOpen,setIsAddModalOpen] = useState(false); //Modal for adding new application
    const {user, openLoginModal} = useAuthModal();

    const requireAuth = useCallback((action: () => void) => {
        if (!user) {
            openLoginModal();
            return;
        }
        action();
    }, [user, openLoginModal]);
    

    const handleHideClick= useCallback(() => {
        // TODO: Implement hide logic
        // FrontLogic
        
        // BackendLogic
         
    }, []);

    const handleFavoriteClick = useCallback(() => {
        // TODO: Save to favorites logic
        // FrontLogic
        setIsFavorite(prev => !prev);
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
        isFavorite,                            //Boolean value for style changing in favorite icon
        isConfirmationAppliedModalOpen,            //Boolean value for opening confirmation add modal
        isAddModalOpen,                        //Boolean value for opening add modal
        handleHideClick,                       //Function for hiding a card offer 
        handleFavoriteClick,                   //Function for including a card offer to favorites
        handleAddClick,                        //Function for starting the add process in 
        handleCancelShowConfirmationAddModal,  //Function for closing the confirmation add modal 
        handleShowAddModal,                    //Function for showing the  add modal to the user when clicking add or having for default add process 
        handleCancelShowAddModal,              //Function for cancel the adding card offer process final step
        handleApplyClick                       //Function for applying to an card offer
    };                         

}