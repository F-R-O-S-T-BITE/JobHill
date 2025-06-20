"use client";
import { useState } from "react";
import { DataFilterStyles } from "@/styles/DataFilterStyles";
import { useDataFilterLogic } from "@/hooks/useDataFilterLogic";
import { OfferCardProps } from "@/interfaces/OfferCard";
import { InputWithIcons, SelectWithIcon } from "./InputFilter";
import { getUniqueTagsByType, getUniqueValues } from "@/utils/getUniqueValues";
import { DateFilterButton } from "./DateFilterButton";

interface DataFilterPanelProps {
  data: OfferCardProps[];
  onFilter: (filtered: OfferCardProps[]) => void;
}


const DataFilterPanel: React.FC<DataFilterPanelProps> = ({ data, onFilter }) => {
    const [hasBeenFiltered,setHasBeenFiltered] = useState(false);
    const [appliedData, setAppliedData] = useState<OfferCardProps[]>(data);
    const locations = getUniqueValues(data, "location");
    const categories = getUniqueTagsByType(data, "category");
    const modalities = getUniqueTagsByType(data, "modality");

    const {
        filteredData,
        filters,
        setFilters,
        showFavoritesOnly,
        setShowFavoritesOnly,
        showHiddenOnly,
        setShowHiddenOnly,
    } = useDataFilterLogic(data);


    const handleApply = () => {
        onFilter(filteredData);
        setAppliedData(filteredData); 
        setHasBeenFiltered(true);
    };

    const handleReset = () => {
        setFilters({
        company: "",
        role: "",
        category: "",
        modality: "",
        location: "",
        order: "newest",
        });
        setShowFavoritesOnly(false);
        setShowHiddenOnly(false);
        onFilter(data);
        setAppliedData(data);
        setHasBeenFiltered(false);
    };

    return (
        <div className={DataFilterStyles.Wrapper}>
            
            <p className={DataFilterStyles.Title}>
                Showing {hasBeenFiltered  ? appliedData.length : data.length} of {data.length} Jobs
            </p>
            
            <label className={DataFilterStyles.Checkbox}>
                <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                />
                Show Favorites Only
            </label>

            <label className={DataFilterStyles.Checkbox}>
                <input
                type="checkbox"
                checked={showHiddenOnly}
                onChange={() => setShowHiddenOnly(!showHiddenOnly)}
                />
                Show Hidden Only
            </label> 

            <InputWithIcons
                placeholder="Company"
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                leftIcon="resources/Icons/Components_Cards/Company_Filter_Cards.png"
                rightIcon="resources/Icons/search_icon.png"
                inputClassName={DataFilterStyles.Input}
                />

            <InputWithIcons
                placeholder="Role"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                leftIcon="resources/Icons/Components_Cards/role_filters_Cards.png"
                rightIcon="resources/Icons/search_icon.png"
                inputClassName={DataFilterStyles.Input}
            />
            
            <SelectWithIcon
                aria_label="Category"
                iconSrc="resources/Icons/Components_Cards/category_icon_cards.png"
                altText="Category"
                value={filters.category}
                onChange={(val) => setFilters({ ...filters, category: val })}
                options={categories}
                placeholder="Category"
            />

            <SelectWithIcon
                aria_label="Modality"
                iconSrc="resources/Icons/Components_Cards/Modality_Icon_Cards.png"
                altText="Modality"
                value={filters.modality}
                onChange={(val) => setFilters({ ...filters, modality: val })}
                options={modalities}
                placeholder="Modality"
                inputClassName="-translate-x-1/6 w-[2rem] h-[2rem]"
            />
            <SelectWithIcon
                aria_label="Location"
                iconSrc="resources/Icons/Components_Cards/location_icon_cards.png"
                altText="Location"
                value={filters.location}
                onChange={(val) => setFilters({ ...filters, location: val })}
                options={locations}
                placeholder="Location"
            />
            
            
            <DateFilterButton
                value={filters.order as "newest"|"oldest"}
                onChange={(val) => setFilters({ ...filters, order: val })}
            />

            <button className={DataFilterStyles.ButtonPrimary} onClick={handleApply}>
                Show Companies
            </button>
            <button className={DataFilterStyles.ButtonSecondary} onClick={handleReset}>
                Reset Filters
            </button>
        </div>
    );
};

export default DataFilterPanel;
