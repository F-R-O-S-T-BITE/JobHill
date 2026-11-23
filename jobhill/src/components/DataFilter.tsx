"use client";
// components/DataFilter.tsx
import { useEffect, useState } from "react";
import { DataFilterStyles } from "@/styles/DataFilterStyles";
import { useDataFilterLogic } from "@/hooks/useDataFilterLogic";
import { OfferCardProps } from "@/interfaces/OfferCard";
import { InputWithIcons, MultiSelectDropdown, SelectDropdownWithIcon, AutocompleteInput } from "./InputFilter";
import { getUniqueTagsByType, getUniqueValues, getAvailableRoleTypes } from "@/utils/getUniqueValues";
import { DateFilterButton } from "./DateFilterButton";

interface DataFilterPanelProps {
  data: OfferCardProps[];
  onFilter: (filtered: OfferCardProps[]) => void;
  /** @deprecated El cambio Jobs/Companies vive ahora en la página */
  setShowCompanies?: React.Dispatch<React.SetStateAction<boolean>>;
  /** @deprecated */
  showCompanies?: boolean;
  selectedCompany?: {id: number, name: string} | null;
}

const DataFilterPanel: React.FC<DataFilterPanelProps> = ({ data, onFilter, selectedCompany }) => {
    const locations = getUniqueValues(data, "location");
    const categories = getUniqueTagsByType(data, "category");
    const modalities = getUniqueTagsByType(data, "modality");
    const companies = getUniqueValues(data, "company");
    const availableRoleTypes = getAvailableRoleTypes(data);

    const dynamicRoleLevelOptions: string[] = [];
    if (availableRoleTypes.hasNewGrad) dynamicRoleLevelOptions.push("New Grad");
    if (availableRoleTypes.hasEmergingTalent) dynamicRoleLevelOptions.push("Emerging Talent");

    const shouldShowRoleLevelFilter = dynamicRoleLevelOptions.length > 0;

    const {
        filteredData,
        filters,
        setFilters,
        showFavoritesOnly,
        setShowFavoritesOnly,
        showHiddenOnly,
        setShowHiddenOnly,
    } = useDataFilterLogic(data, selectedCompany);

    useEffect(() => {
        onFilter(filteredData);
    }, [filteredData, onFilter]);

    const handleReset = () => {
        setFilters({
            company: [] as string[],
            role: "",
            category: [] as string[],
            modality: "",
            location: "",
            order: "newest",
            newGrad: "",
        });
        setShowFavoritesOnly(false);
        setShowHiddenOnly(false);
    };

    return (
        <div className={DataFilterStyles.Wrapper}>
            
            <div className="hidden items-baseline justify-between lg:flex">
                <h2 className="font-display text-lg font-bold text-slate-900">Filters</h2>
                <p className={DataFilterStyles.Title}>
                    {filteredData.length} of {
                        selectedCompany
                            ? data.filter(job => job.company === selectedCompany.name).length
                            : data.length
                    } jobs
                </p>
            </div>
            
            <label className={DataFilterStyles.Checkbox}>
                <input
                type="checkbox"
                className={DataFilterStyles.CheckboxInput}
                checked={showFavoritesOnly}
                onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                />
                Show Favorites Only
            </label>
    
            <AutocompleteInput
                iconSrc="/resources/Icons/Components_Cards/Company_Filter_Cards.png"
                altText="Company"
                placeholder="Company"
                options={companies}
                value={filters.company}
                aria_label="Company"
                inputClassName="w-[1.5rem] h-[1.5rem]"
                onChange={(selectedCompanies: string[]) =>
                    setFilters({ ...filters, company: selectedCompanies })
                }
            />

            <InputWithIcons
                placeholder="Role"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                leftIcon="/resources/Icons/Components_Cards/role_filters_Cards.png"
                rightIcon="/resources/Icons/search_icon.png"
                inputClassName={DataFilterStyles.Input}
            />

                        <InputWithIcons
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                leftIcon="/resources/Icons/Components_Cards/location_icon_cards.png"
                rightIcon="/resources/Icons/search_icon.png"
                inputClassName={DataFilterStyles.Input}
            />

          

            <MultiSelectDropdown
                iconSrc="/resources/Icons/Components_Cards/category_icon_cards.png"
                altText="Category"
                placeholder="Category"
                options={categories}
                value={filters.category} 
                aria_label="Category"
                inputClassName="w-[1.5rem] h-[1.5rem]"
                onChange={(selectedCategories: string[]) => 
                    setFilters({ ...filters, category: selectedCategories }) 
                }
            />

            <SelectDropdownWithIcon
                aria_label="Modality"
                iconSrc="/resources/Icons/Components_Cards/Modality_Icon_Cards.png"
                altText="Modality"
                value={filters.modality}
                onChange={(val) => setFilters({ ...filters, modality: val })}
                options={modalities}
                placeholder="Modality"
                inputClassName="-translate-x-1/6 w-[2rem] h-[2rem]"
            />

              {shouldShowRoleLevelFilter && (
                <SelectDropdownWithIcon
                    aria_label="Role Level"
                    iconSrc="/resources/Icons/Components_Cards/category_icon_cards.png"
                    altText="Role Level"
                    value={filters.newGrad}
                    onChange={(val) => setFilters({ ...filters, newGrad: val })}
                    options={dynamicRoleLevelOptions}
                    placeholder="Role Level"
                    inputClassName="w-[1.5rem] h-[1.5rem]"
                />
            )}

            
            <DateFilterButton
                value={filters.order as "newest"|"oldest"}
                onChange={(val) => setFilters({ ...filters, order: val })}
            />

            <button type="button" className={`${DataFilterStyles.ButtonSecondary} mt-1`} onClick={handleReset}>
                Reset filters
            </button>
        </div>
    );
};

export default DataFilterPanel;
