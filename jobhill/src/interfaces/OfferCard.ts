export interface OfferCardTag {
    label: string;
    type: "category"|"common"|"critical"
}

export interface OfferCardProps {
    //CardInfo
    logoSrc: string; 
    publish_date: string;
    title: string;
    company: string;
    location: string[];
    tags: OfferCardTag[];
    //Actions
    onHide?: () => void;
    onFavorite?: () => void;
    onAdd?: () => void;
    onApply?: () => void;
}