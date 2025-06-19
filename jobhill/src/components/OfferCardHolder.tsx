import OfferCard from "./OfferCard";
import { OfferCardProps } from "@/interfaces/OfferCard";
import './slider.module.css'

const OfferCardHolderStyles = {
    Wrapper: "mt-10 w-full max-w-[90%] sm:max-w-[95%] md:max-w-[1250px] max-h-[925px] shadow-lg mx-auto py-10 px-8 overflow-y-auto",
    Grid: "grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center",
};

interface OfferCardHolderProps {
    offers: OfferCardProps[];
}

const OfferCardHolder: React.FC<OfferCardHolderProps> = ({ offers }) => {
    return (
        <div className={OfferCardHolderStyles.Wrapper}>
            <div className={OfferCardHolderStyles.Grid}>
                {offers.map((offer, idx) => (
                    <OfferCard key={idx} {...offer} />
                ))}
            </div>
        </div>
    );
};

export default OfferCardHolder;