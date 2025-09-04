"use-client"

import { useState,useCallback } from "react";
import { OfferCardLogic } from "@/interfaces/OfferCard";

export function useOfferCardLogic(CardLogic:OfferCardLogic)  {
    const [isFavorite,setIsFavorite] = useState(false);
    const [isConfirmationAppliedModalOpen,setisConfirmationAppliedModalOpen] = useState(false); //Modal for asking if user applied to the job, after redirecting
    const [isAddModalOpen,setIsAddModalOpen] = useState(false); //Modal for adding new application

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
        // TODO: Add Application button logic
        // FrontLogic
        // ? Show add application confirmation modal component
        // ? If not user does not want to continue seeing that modal
        // ? Hide it and continue directly to the Add Modal, else show it until the user clicks in Add or Cancel 
    }, []);

    const handleApplyClick = useCallback(() => {
        window.open(CardLogic.card.applicationLink);
        setisConfirmationAppliedModalOpen(true); 
    }, []);

    const handleShowConfirmationAddModal = useCallback(() => {
        // TODO: Open ConfirmationAddModal Component to user
        // FrontendLogic:
        // ? If user opens it for the first time then always show
        // ? If user does not have set to not show it, show it 
        // ? If user clicks in not show again call backend to update its preferences
    },[]);

    const handleCancelShowConfirmationAddModal = useCallback(() => {
        setisConfirmationAppliedModalOpen(false);
    },[]);
    const handleShowAddModal = useCallback(() => {
        setisConfirmationAppliedModalOpen(false);
        setIsAddModalOpen(true);
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
        handleShowConfirmationAddModal,        //Function for showing the confirmation add modal to the user when starting the add process
        handleCancelShowConfirmationAddModal,  //Function for closing the confirmation add modal 
        handleShowAddModal,                    //Function for showing the  add modal to the user when clicking add or having for default add process 
        handleCancelShowAddModal,              //Function for cancel the adding card offer process final step
        handleApplyClick                       //Function for applying to an card offer
    };                         

}