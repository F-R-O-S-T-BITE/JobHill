"use client";
import { CompanyCardProps } from "@/interfaces/OfferCard";
import { OfferCardHolderStyles } from "@/styles/OfferCardStyles";
import CompanyCard from "./CompanyCard";
import { useUpdatePreference, useUserPreferences } from "@/hooks/useUserPreferences";
import { useHideCompany } from "@/hooks/useJobOffers";
import { showHideCompanyToast } from "@/components/Toast/HideCompanyToast";
import { useState, useMemo } from "react";

interface CompanyCardHolderProps {
    companies: CompanyCardProps[];
    onCompanyClick: (companyId: number, companyName: string) => void;
}

const CompanyCardHolder = ({ companies, onCompanyClick }: CompanyCardHolderProps) => {
    const updatePreference = useUpdatePreference();
    const hideCompany = useHideCompany();
    const [hiddenCompanies, setHiddenCompanies] = useState<Set<number>>(new Set());
    const { data: userPreferencesData } = useUserPreferences();

    const handleHideCompany = async (companyId: number, isCurrentlyPreferred: boolean = false) => {
        const company = companies.find(c => c.id === companyId);
        if (!company) return;

        setHiddenCompanies(prev => new Set([...prev, companyId]));

        showHideCompanyToast({
            companyLogo: company.logoSrc,
            companyName: company.name,
            jobCount: company.offerCount,
            onUndo: async () => {
                setHiddenCompanies(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(companyId);
                    return newSet;
                });
            },
            onExpire: async () => {
                try {
                    if (isCurrentlyPreferred) {
                        await updatePreference.mutateAsync({
                            field: 'preferred_companies',
                            value: companyId,
                            action: 'remove'
                        });
                    }
                    await hideCompany.mutateAsync(companyId);
                } catch (error) {
                    console.error('Failed to hide company:', error);
                    setHiddenCompanies(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(companyId);
                        return newSet;
                    });
                }
            }
        });
    };

    const handlePreferCompany = async (companyId: number, isCurrentlyPreferred: boolean) => {
        try {
            const action = isCurrentlyPreferred ? 'remove' : 'add';

            await updatePreference.mutateAsync({
                field: 'preferred_companies',
                value: companyId,
                action: action
            });
        } catch (error) {
            console.error('Failed to update company preference:', error);
        }
    };

    if (companies.length === 0) {
        return (
            <div className={OfferCardHolderStyles.Wrapper}>
                <div className="flex items-center justify-center h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-gray-400 text-6xl">🏢</div>
                        <span className="text-base xm:text-[1.25rem] sm:text-[1.5rem] font-mono font-bold text-black leading-tight text-center">
                            No companies match your filters
                        </span>
                        <span className="text-sm text-gray-600 text-center max-w-md">
                            Try adjusting your search criteria or clear some filters
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    const visibleCompanies = companies.filter(company => !hiddenCompanies.has(company.id));

    const sortedCompanies = useMemo(() => {
        const preferredCompanyIds = userPreferencesData?.preferences?.preferred_companies || [];

        return [...visibleCompanies].sort((a, b) => {
            const aIsPreferred = preferredCompanyIds.includes(a.id);
            const bIsPreferred = preferredCompanyIds.includes(b.id);

            // Preferred companies first
            if (aIsPreferred && !bIsPreferred) return -1;
            if (!aIsPreferred && bIsPreferred) return 1;

            // Then alphabetically by name
            return a.name.localeCompare(b.name);
        });
    }, [visibleCompanies, userPreferencesData?.preferences?.preferred_companies]);

    return (
        <div className={OfferCardHolderStyles.Wrapper}>
            <div className={OfferCardHolderStyles.CompanyGrid}>
                {sortedCompanies.map((company) => (
                    <CompanyCard
                        key={company.id}
                        card={company}
                        onCompanyClick={onCompanyClick}
                        onHideCompany={handleHideCompany}
                        onPreferCompany={handlePreferCompany}
                    />
                ))}
            </div>
        </div>
    );
};

export default CompanyCardHolder;