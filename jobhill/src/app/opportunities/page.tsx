"use client"

import React, { useState, useMemo } from "react";
import OfferCardHolder from "@/components/OfferCard/OfferCardHolder";
import DataFilterPanel from "@/components/DataFilter";
import { OfferCardProps } from "@/interfaces/OfferCard";
import { useJobOffers } from "@/hooks/useJobOffers";
import { formatPublishDate, createJobTags } from "@/utils/jobUtils";
import type { JobOffersFilters } from "@/interfaces/JobOffer";

export default function OpportunitiesPage() {
    const [filters] = useState<JobOffersFilters>({});
    const [localFilters, setLocalFilters] = useState<OfferCardProps[]>([]);
    const { data: jobOffersData, isLoading, error, isError } = useJobOffers(filters);
    
    const adaptedOffers = useMemo(() => {
        if (!jobOffersData?.jobs) return [];
        
        return jobOffersData.jobs.map(job => ({
            id: job.id,
            logoSrc: job.company?.logo_url || '/resources/Icons/default-company-logo.svg',
            publish_date: formatPublishDate(job.created_at),
            title: job.job_title,
            company: job.company?.name || 'Unknown Company',
            location: job.location || [],
            tags: createJobTags(job),
            isHidden: false,
            isFavorite: job.is_favorite || false,
            isApplied: job.is_applied || false,
            applicationLink: job.application_link,
            companyId: job.company_id,
            preferenceScore: job.preference_score || 0
        } as OfferCardProps));
    }, [jobOffersData?.jobs]);
    
    // Handle client-side filtering from DataFilterPanel
    const displayOffers = localFilters.length > 0 ? localFilters : adaptedOffers;

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen flex flex-col">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 px-4 sm:px-6 xl:px-20 3xl:px-40 w-full max-w-[1700px] mx-auto">
                    <div className="w-full flex items-center justify-center mb-12 h-[400px]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0353A4]"></div>
                            <span className="text-base font-mono text-gray-600">Loading job opportunities...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white min-h-screen flex flex-col">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 px-4 sm:px-6 xl:px-20 3xl:px-40 w-full max-w-[1700px] mx-auto">
                    <div className="w-full flex items-center justify-center mb-12 h-[400px]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-red-500 text-6xl">⚠️</div>
                            <span className="text-base font-mono text-red-600">
                                {error?.message || "Failed to load job opportunities"}
                            </span>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-[#0353A4] text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-6 xl:px-20 3xl:px-40 w-full max-w-[1700px] mx-auto py-6">
    
                {/* Filter Panel - Sticky on large screens */}
                <div className="lg:w-[350px] lg:flex-shrink-0">
                    <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                        <DataFilterPanel 
                            data={adaptedOffers} 
                            onFilter={setLocalFilters} 
                        />
                    </div>
                </div>

                {/* Job Cards */}
                <div className="flex-1 min-w-0">
                    {displayOffers.length === 0 ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <div className="flex flex-col items-center gap-4">
                                <div className="text-gray-400 text-6xl">🔍</div>
                                <span className="text-base xm:text-[1.25rem] sm:text-[1.5rem] font-mono font-bold text-black leading-tight text-center">
                                    No job opportunities match your filters
                                </span>
                                <span className="text-sm text-gray-600 text-center max-w-md">
                                    Try adjusting your search criteria or clear some filters
                                </span>
                            </div>
                        </div>
                    ) : (
                        <OfferCardHolder 
                            offers={displayOffers}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}