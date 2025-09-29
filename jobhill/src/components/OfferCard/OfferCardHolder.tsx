import { useState } from "react";
import OfferCard from "./OfferCard";
import { OfferCardProps } from "@/interfaces/OfferCard";
import '../slider.module.css'
import { OfferCardHolderStyles } from "@/styles/OfferCardStyles";

interface OfferCardHolderProps {
    offers: OfferCardProps[];
}

let globalHiddenJobs = new Set<string>();
let globalAppliedJobs = new Set<string>();

export const hideJob = (jobId: string) => {
    globalHiddenJobs.add(jobId);
};

export const unhideJob = (jobId: string) => {
    globalHiddenJobs.delete(jobId);
};

export const unhideJobAndUpdate = (jobId: string) => {
    unhideJob(jobId);
    if ((window as any).updateOfferCardHolder) {
        (window as any).updateOfferCardHolder();
    }
};

export const isJobHidden = (jobId: string) => {
    return globalHiddenJobs.has(jobId);
};

export const markJobAsApplied = (jobId: string) => {
    globalAppliedJobs.add(jobId);
};

export const isJobApplied = (jobId: string) => {
    return globalAppliedJobs.has(jobId);
};

const OfferCardHolder: React.FC<OfferCardHolderProps> = ({ 
    offers
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [, forceUpdate] = useState({});
    const pageSize = 50; 
    
    const visibleOffers = offers.filter(offer => {
        const jobId = offer.id || `${offer.title}-${offer.company}`;
        return !isJobHidden(jobId);
    });
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOffers = visibleOffers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(visibleOffers.length / pageSize);
    
  
    const handleForceUpdate = () => {
        forceUpdate({});
        
        const newTotalPages = Math.ceil(visibleOffers.length / pageSize);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        }
    };
    
    const markJobAsAppliedAndUpdate = (jobId: string) => {
        markJobAsApplied(jobId);
        handleForceUpdate();
    };
    
    (window as any).updateOfferCardHolder = handleForceUpdate;
    (window as any).markJobAsAppliedAndUpdate = markJobAsAppliedAndUpdate;
    
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
                <OfferCard key={offer.id || `${offer.title}-${offer.company}-${idx}`} card={offer} userPreferences={{ showAddModal: true }} />
            ))}
        </div>

        {/* Pagination */}
        {visibleOffers.length > 0 && totalPages > 1 && (
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