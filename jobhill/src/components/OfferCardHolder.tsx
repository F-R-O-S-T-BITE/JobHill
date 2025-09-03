import { useState } from "react";
import OfferCard from "./OfferCard";
import { OfferCardProps } from "@/interfaces/OfferCard";
import './slider.module.css'
import { OfferCardHolderStyles } from "@/styles/OfferCardStyles";

interface OfferCardHolderProps {
    offers: OfferCardProps[];
}

const OfferCardHolder: React.FC<OfferCardHolderProps> = ({ 
    offers
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50; 
    
    // Client-side pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOffers = offers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(offers.length / pageSize);
    
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  return (
    <div className={OfferCardHolderStyles.Wrapper}>
        {/* Card Grid */}
        <div className={OfferCardHolderStyles.Grid}>
            {paginatedOffers.map((offer, idx) => (
            <OfferCard key={idx} card={offer} userPreferences={{ showAddModal: true }} />
            ))}
        </div>

        {/* Pagination */}
        {offers.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 mb-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-6 py-2 rounded-md text-sm font-medium border border-blue-600 text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0353A4] hover:text-white"
                >
                    Previous
                </button>

                <span className="text-sm text-gray-700 font-medium px-4">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-6 py-2 rounded-md text-sm font-medium border border-blue-600 text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0353A4] hover:text-white"
                >
                    Next
                </button>
            </div>
        )}
    </div>
  );
};


export default OfferCardHolder;