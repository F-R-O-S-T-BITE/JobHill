import { useState } from "react";
import OfferCard from "./OfferCard";
import { OfferCardProps } from "@/interfaces/OfferCard";
import './slider.module.css'
import { OfferCardHolderStyles } from "@/styles/OfferCardStyles";


interface OfferCardHolderProps {
    offers: OfferCardProps[];
    totalCount?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}

const OfferCardHolder: React.FC<OfferCardHolderProps> = ({ 
    offers, 
    totalCount, 
    currentPage: externalCurrentPage, 
    onPageChange 
}) => {
    const [internalCurrentPage, setInternalCurrentPage] = useState(1);
    const pageSize = 20; // Fixed page size

    // Use external pagination if provided, otherwise use internal
    const currentPage = externalCurrentPage || internalCurrentPage;
    const isExternalPagination = !!onPageChange;
    
    // For internal pagination, slice the offers
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOffers = isExternalPagination ? offers : offers.slice(startIndex, endIndex);

    // Calculate total pages based on whether we're using external data
    const totalPages = isExternalPagination && totalCount 
        ? Math.ceil(totalCount / pageSize)
        : Math.ceil(offers.length / pageSize);

    // Handle page changes
    const handlePageChange = (newPage: number) => {
        if (isExternalPagination && onPageChange) {
            onPageChange(newPage);
        } else {
            setInternalCurrentPage(newPage);
        }
    };

  return (
    <div className={OfferCardHolderStyles.Wrapper}>
        {/* Grid de Tarjetas */}
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