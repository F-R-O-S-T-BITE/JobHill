import { useState, useMemo } from "react";
import { OfferCardProps } from "@/interfaces/OfferCard";

export function useDataFilterLogic(data: OfferCardProps[]) {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filters, setFilters] = useState({
    company: "",
    role: "",
    category: "",
    modality: "",
    location: "",
    order: "newest", // newest | oldest
  });

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        if (showFavoritesOnly && !item.isFavorite) return false;
        if (showHiddenOnly && !item.isHidden) return false;
        if (filters.company && !item.company.toLowerCase().includes(filters.company.toLowerCase())) {
          return false;
        }
        if (filters.role && !item.title.toLowerCase().includes(filters.role.toLowerCase())) {
          return false;
        }
        if (filters.category && !item.tags.some(tag => tag.type === "category" && tag.label.toLowerCase().includes(filters.category.toLowerCase()))) {
          return false;
        }
        if (filters.modality && !item.tags.some(tag => tag.type === "modality" && tag.label.toLowerCase().includes(filters.modality.toLowerCase()))) {
          return false;
        }
        if (filters.location && !item.location.some(loc => loc.toLowerCase().includes(filters.location.toLowerCase()))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        return filters.order === "newest"
          ? b.publish_date.localeCompare(a.publish_date)
          : a.publish_date.localeCompare(b.publish_date);
      });
  }, [data, showFavoritesOnly, showHiddenOnly, filters]);

  return {
    filteredData,
    filters,
    setFilters,
    showFavoritesOnly,
    setShowFavoritesOnly,
    showHiddenOnly,
    setShowHiddenOnly,
  };
}
