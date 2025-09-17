import { CompanyCardProps, OfferCardProps } from "@/interfaces/OfferCard";

export function aggregateCompaniesByOffers(offers: OfferCardProps[]): CompanyCardProps[] {
    const companyMap = offers.reduce<Record<string, CompanyCardProps>>((acc, offer) => {
        const companyName = offer.company;
        
        if (!acc[companyName]) {
            acc[companyName] = {
                id: offer.companyId || 0,
                name: companyName,
                logoSrc: offer.logoSrc,
                offerCount: 0,
                jobOffers: []
            };
        }

        acc[companyName].offerCount++;
        acc[companyName].jobOffers.push(offer.id || `${offer.title}-${offer.company}`);

        return acc;
    }, {});

    return Object.values(companyMap);
}

export function filterCompanies(
    companies: CompanyCardProps[],
    filters: {
        company?: string[];
        category?: string[];
        modality?: string;
        location?: string;
        newGrad?: string;
    },
    originalOffers: OfferCardProps[]
): CompanyCardProps[] {
    return companies.filter(company => {
        if (filters.company && filters.company.length > 0) {
            const matchesCompany = filters.company.some(filterCompany =>
                company.name.toLowerCase().includes(filterCompany.toLowerCase())
            );
            if (!matchesCompany) return false;
        }

        const companyOffers = originalOffers.filter(offer =>
            offer.company === company.name
        );

        if (filters.category && filters.category.length > 0) {
            const hasMatchingCategory = companyOffers.some(offer =>
                offer.tags.some(tag =>
                    tag.type === "category" &&
                    filters.category!.some(filterCategory =>
                        tag.label.toLowerCase().includes(filterCategory.toLowerCase())
                    )
                )
            );
            if (!hasMatchingCategory) return false;
        }

        if (filters.modality) {
            const hasMatchingModality = companyOffers.some(offer =>
                offer.tags.some(tag =>
                    tag.type === "modality" &&
                    tag.label.toLowerCase().includes(filters.modality!.toLowerCase())
                )
            );
            if (!hasMatchingModality) return false;
        }

        if (filters.location) {
            const hasMatchingLocation = companyOffers.some(offer =>
                offer.location.some(loc =>
                    loc.toLowerCase().includes(filters.location!.toLowerCase())
                )
            );
            if (!hasMatchingLocation) return false;
        }

        if (filters.newGrad) {
            const hasMatchingRole = companyOffers.some(offer => {
                if (filters.newGrad === 'New Grad') {
                    return offer.tags.some(tag => tag.label === 'New Grad');
                } else if (filters.newGrad === 'Emerging Talent') {
                    return offer.tags.some(tag => tag.label === 'Emerging Talent');
                }
                return false;
            });
            if (!hasMatchingRole) return false;
        }

        return true;
    });
}

export function updateCompanyOfferCounts(
    companies: CompanyCardProps[],
    filteredOffers: OfferCardProps[]
): CompanyCardProps[] {
    return companies.map(company => {
        const companyOffers = filteredOffers.filter(offer =>
            offer.company === company.name
        );

        return {
            ...company,
            offerCount: companyOffers.length,
            jobOffers: companyOffers.map(offer => offer.id || `${offer.title}-${offer.company}`)
        };
    }).filter(company => company.offerCount > 0); 
}