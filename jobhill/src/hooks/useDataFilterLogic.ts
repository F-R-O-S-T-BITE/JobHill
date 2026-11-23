import { useState, useMemo } from "react";
import { OfferCardProps } from "@/interfaces/OfferCard";
import { useUserPreferences } from "@/hooks/useUserPreferences";

export function useDataFilterLogic(data: OfferCardProps[], selectedCompany?: {id: number, name: string} | null) {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [showAppliedJobs, setShowAppliedJobs] = useState(false);
  const { data: userPreferencesData } = useUserPreferences();

  const [filters, setFilters] = useState({
    company: [] as string[],
    role: "",
    category: [] as string[],
    modality: "",
    location: "",
    order: "newest",
    newGrad: ""
  });

  const favoriteJobs = userPreferencesData?.preferences?.favorite_jobs;

  const filteredData = useMemo(() => {
    // Las favoritas se leen de las preferencias (se actualizan al instante al marcar la estrella)
    const favoriteIds = favoriteJobs ? new Set<string>(favoriteJobs) : null;
    const isFavorite = (item: OfferCardProps) =>
      favoriteIds ? !!item.id && favoriteIds.has(item.id) : !!item.isFavorite;
    const toTime = (item: OfferCardProps) => (item.createdAt ? Date.parse(item.createdAt) || 0 : 0);
    const lowercasedCategories = filters.category.map(c => c.toLowerCase());
    const lowercasedCompanies = filters.company.map(c => c.toLowerCase());

    return data
      .filter((item) => {
        if (selectedCompany && item.company !== selectedCompany.name) {
          return false;
        }

        if (showFavoritesOnly && !isFavorite(item)) return false;

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
        // Sort by tier first (lower tier = higher priority)
        const aTier = a.relevanceTier || 3;
        const bTier = b.relevanceTier || 3;

        if (aTier !== bTier) {
          return aTier - bTier;
        }

        // Within same tier, sort by date
        return filters.order === "newest"
          ? toTime(b) - toTime(a)
          : toTime(a) - toTime(b);
      });
  }, [data, showFavoritesOnly, filters, selectedCompany, favoriteJobs]);

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
