"use client"

import { useState, useCallback, useMemo, useRef } from "react";
import { OfferCardLogic } from "@/interfaces/OfferCard";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { showHideJobToast } from "@/components/Toast/HideJobToast";
import { showApplicationSuccessToast } from "@/components/Toast/ApplicationSuccessToast";
import { useUserPreferences, useFavoriteJob, useUnfavoriteJob } from "@/hooks/useUserPreferences";
import { useCreateApplication, useHideJob } from "@/hooks/useJobOffers";
import { useQueryClient } from '@tanstack/react-query';
import { jobOffersKeys } from "@/hooks/useJobOffers";
import type { JobOffersApiResponse } from '@/interfaces/JobOffer';

export function useOfferCardLogic(CardLogic:OfferCardLogic)  {
    const [isConfirmationAppliedModalOpen,setisConfirmationAppliedModalOpen] = useState(false); //Modal for asking if user applied to the job, after redirecting
    const [isAddModalOpen,setIsAddModalOpen] = useState(false); //Modal for adding new application
    const {user, openLoginModal} = useAuthModal();
    const queryClient = useQueryClient();

    // Get user preferences and mutations
    const { data: userPreferencesData } = useUserPreferences();
    const favoriteJobMutation = useFavoriteJob();
    const unfavoriteJobMutation = useUnfavoriteJob();
    const hideJobMutation = useHideJob();
    const createApplicationMutation = useCreateApplication();

    // Track pending hide to handle undo
    const pendingHideRef = useRef<{ jobId: string; cancelled: boolean } | null>(null);
    
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
    

    const handleHideClick = useCallback(() => {
        return requireAuth(() => {
            const jobId = CardLogic.card.id || `${CardLogic.card.title}-${CardLogic.card.company}`;

            // Store the hidden job data and current state for potential restoration
            const allJobsData = queryClient.getQueryData<JobOffersApiResponse>(jobOffersKeys.allJobs());
            const hiddenJob = allJobsData?.jobs.find(job => job.id === jobId);
            const userPreferencesData = queryClient.getQueryData(['user-preferences', 'preferences']) as any;
            const previousPreferences = userPreferencesData;

            // Set up pending hide tracking
            pendingHideRef.current = { jobId, cancelled: false };

            // Optimistically update all caches immediately
            // 1. Remove from job offers
            queryClient.setQueryData(
                jobOffersKeys.allJobs(),
                (oldData: JobOffersApiResponse | undefined) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        jobs: oldData.jobs.filter(job => job.id !== jobId),
                        total: oldData.total - 1,
                    };
                }
            );

            // 2. Add to user preferences hidden_jobs
            if (userPreferencesData && hiddenJob) {
                const currentHiddenJobIds = userPreferencesData.preferences?.hidden_jobs || [];
                queryClient.setQueryData(
                    ['user-preferences', 'preferences'],
                    {
                        ...userPreferencesData,
                        preferences: {
                            ...userPreferencesData.preferences,
                            hidden_jobs: [...currentHiddenJobIds, jobId]
                        }
                    }
                );

                // 3. Add to hidden jobs cache
                queryClient.setQueryData(
                    jobOffersKeys.hiddenJobs(),
                    (oldHiddenJobs: any) => {
                        const currentHiddenJobs = oldHiddenJobs || [];
                        return [...currentHiddenJobs, hiddenJob];
                    }
                );
            }

            // Show toast with undo option
            showHideJobToast({
                companyLogo: CardLogic.card.logoSrc,
                jobTitle: CardLogic.card.title,
                companyName: CardLogic.card.company,
                onUndo: () => {
                    // Mark as cancelled
                    if (pendingHideRef.current?.jobId === jobId) {
                        pendingHideRef.current.cancelled = true;
                    }

                    // Restore all caches
                    if (hiddenJob) {
                        // 1. Restore to job offers
                        queryClient.setQueryData(
                            jobOffersKeys.allJobs(),
                            (oldData: JobOffersApiResponse | undefined) => {
                                if (!oldData) return oldData;
                                return {
                                    ...oldData,
                                    jobs: [hiddenJob, ...oldData.jobs],
                                    total: oldData.total + 1,
                                };
                            }
                        );

                        // 2. Remove from user preferences
                        queryClient.setQueryData(
                            ['user-preferences', 'preferences'],
                            previousPreferences
                        );

                        // 3. Remove from hidden jobs cache
                        queryClient.setQueryData(
                            jobOffersKeys.hiddenJobs(),
                            (oldHiddenJobs: any) => {
                                if (!oldHiddenJobs) return [];
                                return oldHiddenJobs.filter((job: any) => job.id !== jobId);
                            }
                        );
                    }
                },
                onExpire: () => {
                    // Only persist to server if not cancelled
                    if (pendingHideRef.current?.jobId === jobId && !pendingHideRef.current.cancelled) {
                        hideJobMutation.mutate(jobId);
                    }
                    pendingHideRef.current = null;
                }
            });
        });
    }, [CardLogic.card.logoSrc, CardLogic.card.title, CardLogic.card.company, CardLogic.card.id, requireAuth, hideJobMutation, queryClient]);

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