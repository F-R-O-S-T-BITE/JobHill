// components/OfferCard/OfferCardHolder.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OfferCard from "./OfferCard";
import { OfferCardProps } from "@/interfaces/OfferCard";
import { OfferCardHolderStyles } from "@/styles/OfferCardStyles";

interface OfferCardHolderProps {
    offers: OfferCardProps[];
}

const PAGE_SIZE = 50;

const OfferCardHolder: React.FC<OfferCardHolderProps> = ({ offers }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(offers.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedOffers = offers.slice(startIndex, startIndex + PAGE_SIZE);

    // Ajusta la página si los filtros reducen el total
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={OfferCardHolderStyles.Wrapper}>
            <div className={OfferCardHolderStyles.Grid}>
                {paginatedOffers.map((offer, idx) => (
                    <OfferCard
                        key={offer.id || `${offer.title}-${offer.company}-${idx}`}
                        card={offer}
                        userPreferences={{ showAddModal: true }}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <nav className="mt-8 flex items-center justify-between gap-3 sm:justify-center sm:gap-4" aria-label="Pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="btn-secondary"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden xs:inline">Previous</span>
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        Page <span className="text-slate-900">{currentPage}</span> of {totalPages}
                    </span>
                    <button
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="btn-secondary"
                    >
                        <span className="hidden xs:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </nav>
            )}
        </div>
    );
};

export default OfferCardHolder;
