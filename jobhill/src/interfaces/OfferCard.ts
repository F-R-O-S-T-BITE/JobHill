export interface OfferCardTag {
    label: string;
    type: "category"|"hours_job_type"|"extra_critical_requirements"|"modality"|"work_branch"
}

export interface OfferCardProps {
    //CardInfo
    id?: string; // Job offer ID from API
    logoSrc: string; //URL of the company's logo
    publish_date: string; //Publication date of the offer
    title: string;  //Title of the offer (e.g. Software Engineer)
    company: string; //Company name
    location: string[]; //Location of the inter ship/work
    tags: OfferCardTag[]; //Related tags to the position
    isHidden?: boolean;
    isFavorite?: boolean;
    isApplied?: boolean; // Whether user has applied to this job
    applicationLink?: string; // Direct link to apply
    companyId?: number; // Company ID from API
    preferenceScore?: number; // Score for preferred sorting
}

export interface UserPreferences {
    showAddModal:boolean;
}
export interface OfferCardLogic {
    card:OfferCardProps;
    userPreferences?:UserPreferences;
}