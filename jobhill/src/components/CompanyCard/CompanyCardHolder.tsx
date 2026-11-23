"use client";
// components/CompanyCard/CompanyCardHolder.tsx
import { CompanyCardProps } from "@/interfaces/OfferCard";
import { OfferCardHolderStyles } from "@/styles/OfferCardStyles";
import CompanyCard from "./CompanyCard";
import { useUpdatePreference, useUserPreferences } from "@/hooks/useUserPreferences";
import { useHideCompany } from "@/hooks/useJobOffers";
import { showHideCompanyToast } from "@/components/Toast/HideCompanyToast";
import { useState, useMemo } from "react";
import { Building2 } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

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

    const sortedCompanies = useMemo(() => {
        const visibleCompanies = companies.filter(company => !hiddenCompanies.has(company.id));
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
    }, [companies, hiddenCompanies, userPreferencesData?.preferences?.preferred_companies]);

    if (companies.length === 0) {
        return (
            <EmptyState
                icon={Building2}
                title="No companies match your filters"
                description="Try adjusting your search criteria or clear some filters."
            />
        );
    }

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