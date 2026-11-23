export interface OfferCardTag {
    label: string;
    type: "category"|"hours_job_type"|"extra_critical_requirements"|"modality"|"work_branch"
}

export interface OfferCardProps {
    id?: string;
    logoSrc: string;
    publish_date: string;
    title: string;
    company: string;
    location: string[];
    tags: OfferCardTag[];
    isHidden?: boolean;
    isFavorite?: boolean;
    isApplied?: boolean;
    applicationLink?: string;
    companyId?: number;
    preferenceScore?: number;
    relevanceTier?: number;
    isPreferredCompany?: boolean;
    matchingCategories?: string[];
}

export interface UserPreferences {
    showAddModal:boolean;
}
export interface OfferCardLogic {
    card:OfferCardProps;
    userPreferences?:UserPreferences;
}

export interface CompanyCardProps {
    id: number;
    name: string;
    logoSrc: string;
    offerCount: number;
    isPreferred?: boolean;
    isHidden?: boolean;
    jobOffers: string[];
}

export interface CompanyCardLogic {
    card: CompanyCardProps;
}

export interface CompanyData {
    [companyName: string]: {
        id: number;
        logoSrc: string;
        offers: OfferCardProps[];
    };
}