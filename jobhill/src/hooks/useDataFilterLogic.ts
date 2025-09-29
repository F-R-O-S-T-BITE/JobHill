import { useState, useMemo } from "react";
import { OfferCardProps } from "@/interfaces/OfferCard";

export function useDataFilterLogic(data: OfferCardProps[], selectedCompany?: {id: number, name: string} | null) {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [showAppliedJobs, setShowAppliedJobs] = useState(false);
  const [filters, setFilters] = useState({
    company: [] as string[],
    role: "",
    category: [] as string[],
    modality: "",
    location: "",
    order: "newest",
    newGrad: ""
  });

  const filteredData = useMemo(() => {
    const lowercasedCategories = filters.category.map(c => c.toLowerCase());
    const lowercasedCompanies = filters.company.map(c => c.toLowerCase());

    return data
      .filter((item) => {
        if (selectedCompany && item.company !== selectedCompany.name) {
          return false;
        }

        if (showFavoritesOnly && !item.isFavorite) return false;

        if (lowercasedCompanies.length > 0 && !lowercasedCompanies.some(company =>
          item.company.toLowerCase().includes(company)
        )) {
          return false;
        }

        if (filters.role && !item.title.toLowerCase().includes(filters.role.toLowerCase())) {
          return false;
        }

        if (filters.newGrad) {
          const hasRequiredTag = item.tags.some(tag =>
            (tag.label === 'New Grad' && filters.newGrad === 'New Grad') ||
            (tag.label === 'Emerging Talent' && filters.newGrad === 'Emerging Talent')
          );
          if (!hasRequiredTag) {
            return false;
          }
        }

        if (lowercasedCategories.length > 0 && !item.tags.some(tag =>
          tag.type === "category" && lowercasedCategories.includes(tag.label.toLowerCase())
        )) {
          return false;
        }

        if (filters.modality && !item.tags.some(tag =>
          tag.type === "modality" && tag.label.toLowerCase().includes(filters.modality.toLowerCase())
        )) {
          return false;
        }

        if (filters.location && !item.location.some(loc =>
          loc.toLowerCase().includes(filters.location.toLowerCase())
        )) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aScore = a.preferenceScore || 0;
        const bScore = b.preferenceScore || 0;

        if (aScore === bScore) {
          return filters.order === "newest"
            ? new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()  
            : new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime(); 
        }

        return bScore - aScore;
      });
  }, [data, showFavoritesOnly, filters, selectedCompany]);

  return {
    filteredData,
    filters,
    setFilters,
    showFavoritesOnly,
    setShowFavoritesOnly,
    showHiddenOnly,
    setShowHiddenOnly,
    showAppliedJobs,
    setShowAppliedJobs,
  };
}
