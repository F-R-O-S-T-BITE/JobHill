"use client";
import { useEffect, useState } from "react";
import { DataFilterStyles } from "@/styles/DataFilterStyles";
import { Application, ApplicationFilters, APPLICATION_STATUSES } from "@/interfaces/Application";
import { AutocompleteInput, MultiSelectDropdown, SelectDropdownWithIcon, InputWithIcons } from "./InputFilter";
import { getUniqueValues } from "@/utils/getUniqueValues";
import { DateFilterButton } from "./DateFilterButton";

interface ApplicationFilterPanelProps {
  data: Application[];
  filteredData: Application[];
  filters: ApplicationFilters;
  setFilters: (filters: ApplicationFilters) => void;
}

const ApplicationFilterPanel: React.FC<ApplicationFilterPanelProps> = ({
  data,
  filteredData,
  filters,
  setFilters
}) => {
  const [hasBeenFiltered, setHasBeenFiltered] = useState(false);

  const companies = getUniqueValues(data, "company_name");
  const statusOptions = [...APPLICATION_STATUSES];
  const referralOptions = ["Cold Apply", "Employee Ref", "Referred"];

  useEffect(() => {
    setHasBeenFiltered(
      filters.company.length > 0 ||
      filters.status !== "" ||
      filters.referral !== "" ||
      filters.location !== ""
    );
  }, [filters]);

  const handleReset = () => {
    setFilters({
      company: [],
      category: [],
      status: "",
      referral: "",
      location: "",
      order: "newest",
    });
    setHasBeenFiltered(false);
  };

  return (
    <div className={DataFilterStyles.Wrapper}>
      <div className="flex justify-between items-center mb-4">
        <p className={DataFilterStyles.Title}>
          Showing {filteredData.length} {hasBeenFiltered ? `of ${data.length}` : ""} Application{filteredData.length !== 1 ? 's' : ''}
        </p>
      </div>

      <AutocompleteInput
        iconSrc="resources/Icons/Components_Cards/Company_Filter_Cards.png"
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
        placeholder="Location"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        leftIcon="resources/Icons/Components_Cards/location_icon_cards.png"
        rightIcon="resources/Icons/search_icon.png"
        inputClassName={DataFilterStyles.Input}
      />

      <SelectDropdownWithIcon
        aria_label="Status"
        iconSrc="resources/Icons/Components_Cards/category_icon_cards.png"
        altText="Status"
        value={filters.status}
        onChange={(val) => setFilters({ ...filters, status: val })}
        options={statusOptions}
        placeholder="Status"
        inputClassName="w-[1.5rem] h-[1.5rem]"
      />

      <SelectDropdownWithIcon
        aria_label="Referral"
        iconSrc="resources/Icons/Components_Cards/category_icon_cards.png"
        altText="Referral"
        value={filters.referral}
        onChange={(val) => setFilters({ ...filters, referral: val })}
        options={referralOptions}
        placeholder="Referral"
        inputClassName="w-[1.5rem] h-[1.5rem]"
      />

      <DateFilterButton
        value={filters.order}
        onChange={(val) => setFilters({ ...filters, order: val })}
      />

      <button className={DataFilterStyles.ButtonSecondary} onClick={handleReset}>
        Reset Filters
      </button>
    </div>
  );
};

export default ApplicationFilterPanel;