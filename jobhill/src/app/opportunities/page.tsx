// app/opportunities/page.tsx
"use client"

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { AlertTriangle, ArrowLeft, Briefcase, Building2, SearchX, SlidersHorizontal, X } from "lucide-react";
import OfferCardHolder from "@/components/OfferCard/OfferCardHolder";
import CompanyCardHolder from "@/components/CompanyCard/CompanyCardHolder";
import DataFilterPanel from "@/components/DataFilter";
import EmptyState from "@/components/ui/EmptyState";
import { OfferCardProps } from "@/interfaces/OfferCard";
import { useJobOffers } from "@/hooks/useJobOffers";
import { formatPublishDate, createJobTags } from "@/utils/jobUtils";
import { aggregateCompaniesByOffers } from "@/utils/companyUtils";

function OfferCardSkeleton() {
    return (
        <div className="card flex flex-col gap-4 p-5" aria-hidden="true">
            <div className="flex gap-4">
                <div className="skeleton h-14 w-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-24" />
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                </div>
            </div>
            <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-6 w-14 rounded-full" />
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <div className="skeleton h-10 w-24 rounded-lg" />
                <div className="skeleton h-10 w-24 rounded-lg" />
            </div>
        </div>
    );
}

export default function OpportunitiesPage() {
    const [showCompanies, setShowCompanies] = useState<boolean>(false);
    const [selectedCompany, setSelectedCompany] = useState<{id: number, name: string} | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { data: jobOffersData, isLoading, error, isError, refetch } = useJobOffers();

    const allOffers = useMemo(() => {
        if (!jobOffersData?.jobs) return [];

        return jobOffersData.jobs.map(job => ({
            id: job.id,
            logoSrc: job.company?.logo_url || '',
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
            preferenceScore: job.preference_score || 0,
            relevanceTier: job.relevance_tier || 3,
            isPreferredCompany: job.is_preferred_company || false,
            matchingCategories: job.matching_categories || []
        } as OfferCardProps));
    }, [jobOffersData?.jobs, jobOffersData?.total]);

    // null = el panel de filtros todavía no ha calculado resultados.
    // Antes se usaba [] y, si los filtros daban 0 resultados, se mostraban TODAS las ofertas.
    const [filteredData, setFilteredData] = useState<OfferCardProps[] | null>(null);
    const displayOffers = filteredData ?? allOffers;

    const companies = useMemo(() => aggregateCompaniesByOffers(displayOffers), [displayOffers]);

    const handleCompanyClick = (companyId: number, companyName: string) => {
        setSelectedCompany({ id: companyId, name: companyName });
        setShowCompanies(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = useCallback((filtered: OfferCardProps[]) => {
        setFilteredData(filtered);
        // Note: We intentionally don't auto-clear selected company when filters return 0 results
        // This allows users to see "No jobs match your filters" while staying in company view
    }, []);

    const handleBack = () => {
        setSelectedCompany(null);
        setShowCompanies(true);
    };

    const showJobsTab = () => {
        setSelectedCompany(null);
        setShowCompanies(false);
    };

    const showCompaniesTab = () => {
        setSelectedCompany(null);
        setShowCompanies(true);
    };

    // Drawer de filtros (móvil): bloquear scroll y cerrar con Escape
    useEffect(() => {
        if (!filtersOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFiltersOpen(false);
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [filtersOpen]);

    const isCompaniesView = showCompanies && !selectedCompany;
    const resultLabel = isCompaniesView
        ? `${companies.length} ${companies.length === 1 ? 'company' : 'companies'}`
        : `${displayOffers.length} ${displayOffers.length === 1 ? 'job' : 'jobs'}`;

    if (isLoading) {
        return (
            <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8" aria-busy="true">
                <div className="skeleton mb-6 h-8 w-56" />
                <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">
                    <div className="hidden lg:block">
                        <div className="skeleton h-[520px] w-full rounded-2xl" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, i) => <OfferCardSkeleton key={i} />)}
                    </div>
                </div>
                <span className="sr-only">Loading job opportunities…</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16">
                <EmptyState
                    icon={AlertTriangle}
                    title="We couldn't load opportunities"
                    description={error?.message || "Something went wrong. Please try again."}
                    action={
                        <button onClick={() => refetch()} className="btn-primary">
                            Try again
                        </button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-6">
                <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Opportunities
                </h1>
                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                    {allOffers.length.toLocaleString()} open roles, updated daily.
                </p>
            </div>

            <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">
                {/* Fondo del drawer (solo móvil) */}
                {filtersOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm animate-fade-in lg:hidden"
                        onClick={() => setFiltersOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Filtros: drawer en móvil, columna fija en desktop. Siempre montado para conservar su estado. */}
                <aside
                    aria-label="Filters"
                    className={`fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col bg-white shadow-pop transition-[transform,visibility] duration-300 ease-out
                        lg:visible lg:sticky lg:top-24 lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:self-start lg:bg-transparent lg:shadow-none
                        ${filtersOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'}`}
                >
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 lg:hidden">
                        <h2 className="font-display text-lg font-bold text-slate-900">Filters</h2>
                        <button
                            onClick={() => setFiltersOpen(false)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            aria-label="Close filters"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:-m-1 lg:max-h-[calc(100dvh-7rem)] lg:p-1">
                        <DataFilterPanel
                            data={allOffers}
                            onFilter={handleFilterChange}
                            selectedCompany={selectedCompany}
                        />
                    </div>

                    <div className="border-t border-slate-100 p-4 lg:hidden">
                        <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full py-3">
                            Show {resultLabel}
                        </button>
                    </div>
                </aside>

                {/* Resultados */}
                <section className="min-w-0" aria-label="Results">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1" role="tablist" aria-label="View">
                            <button
                                role="tab"
                                aria-selected={!isCompaniesView && !selectedCompany}
                                onClick={showJobsTab}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                                    !isCompaniesView && !selectedCompany ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Briefcase className="h-4 w-4" />
                                Jobs
                            </button>
                            <button
                                role="tab"
                                aria-selected={isCompaniesView || !!selectedCompany}
                                onClick={showCompaniesTab}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                                    isCompaniesView || selectedCompany ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Building2 className="h-4 w-4" />
                                Companies
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="hidden text-sm font-medium text-slate-500 sm:inline">{resultLabel}</span>
                            <button
                                onClick={() => setFiltersOpen(true)}
                                className="btn-secondary lg:hidden"
                                aria-expanded={filtersOpen}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {selectedCompany && !showCompanies && (
                        <div className="mb-4 flex flex-col gap-1">
                            <button
                                onClick={handleBack}
                                className="inline-flex w-fit items-center gap-1.5 rounded-lg py-1 text-sm font-semibold text-brand-600 hover:text-brand-800"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                All companies
                            </button>
                            <h2 className="font-display text-xl font-bold text-slate-900">
                                Jobs at {selectedCompany.name}
                            </h2>
                        </div>
                    )}

                    {isCompaniesView ? (
                        <CompanyCardHolder
                            companies={companies}
                            onCompanyClick={handleCompanyClick}
                        />
                    ) : displayOffers.length === 0 ? (
                        <EmptyState
                            icon={SearchX}
                            title={selectedCompany
                                ? `No ${selectedCompany.name} jobs match your filters`
                                : 'No opportunities match your filters'}
                            description="Try adjusting your search criteria or clear some filters."
                        />
                    ) : (
                        <OfferCardHolder offers={displayOffers} />
                    )}
                </section>
            </div>
        </div>
    );
}
