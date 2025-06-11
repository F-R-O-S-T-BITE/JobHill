export interface OfferCardTag {
    label: string;
    type: "category"|"common"
}

export interface OfferCardProps {
    //CardInfo
    logoSrc: string; 
    date: string;
    title: string;
    company: string;
    location: string;
    tags: OfferCardTag[];
    //Actions
    onHide?: () => void;
    onFavorite?: () => void;
    onAdd?: () => void;
    onApply?: () => void;
}