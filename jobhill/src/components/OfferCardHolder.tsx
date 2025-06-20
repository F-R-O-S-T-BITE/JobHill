import { useState } from "react";
import OfferCard from "./OfferCard";
import { OfferCardProps } from "@/interfaces/OfferCard";
import './slider.module.css'
import { OfferCardHolderStyles } from "@/styles/OfferCardStyles";


interface OfferCardHolderProps {
    offers: OfferCardProps[];
}

const OfferCardHolder: React.FC<OfferCardHolderProps> = ({ offers }) => {
    const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const limits = [6, 12, 24, 50];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOffers = offers.slice(startIndex, endIndex);

  const totalPages = Math.ceil(offers.length / pageSize);

  return (
    <div className={OfferCardHolderStyles.Wrapper}>
        {/* Grid de Tarjetas */}
        <div className={OfferCardHolderStyles.Grid}>
            {paginatedOffers.map((offer, idx) => (
            <OfferCard key={idx} card={offer} userPreferences={{ showAddModal: true }} />
            ))}
        </div>

        {offers.length > 0 &&
        <div className="flex flex-col gap-4 items-center mt-6">
            {/* Selector de cantidad por página */}
            <div className="flex gap-2 flex-wrap justify-center">
                {limits.map(limit => (
                <button
                    key={limit}
                    onClick={() => {
                        setPageSize(limit);
                        setCurrentPage(1);
                    }}
                    className={`px-4 py-1 rounded-md text-sm font-medium border transition-colors duration-200 ${
                    pageSize === limit
                        ? 'bg-[#0353A4] text-white border-[#0353A4]'
                        : 'border-blue-600 text-blue-600 hover:bg-[#0353A4] hover:text-white'
                    }`}
                >
                    {limit}
                </button>
                ))}
            </div>

            {/* Botones de navegación */}
            {offers.length > pageSize && (
                <div className="flex gap-4 items-center">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-1 rounded-md text-sm font-medium border border-blue-600 text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0353A4] hover:text-white"
                >
                    Previous
                </button>

                <span className="text-sm text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    disabled={endIndex >= offers.length}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-1 rounded-md text-sm font-medium border border-blue-600 text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0353A4] hover:text-white"
                >
                    Next
                </button>
                </div>
            )}
        </div>
        }
    </div>
    
  );
};


export default OfferCardHolder;