"use client";
import { useEffect, useState, useMemo } from "react";
import { DataFilterStyles } from "@/styles/DataFilterStyles";
import { Application, ApplicationFilters } from "@/interfaces/Application";
import { AutocompleteInput, MultiSelectDropdown, SelectDropdownWithIcon } from "./InputFilter";
import { getUniqueValues } from "@/utils/getUniqueValues";
import { DateFilterButton } from "./DateFilterButton";

interface ApplicationFilterPanelProps {
  data: Application[];
  onFilter: (filtered: Application[]) => void;
  filters: ApplicationFilters;
  setFilters: (filters: ApplicationFilters) => void;
}

const ApplicationFilterPanel: React.FC<ApplicationFilterPanelProps> = ({ 
  data, 
  onFilter, 
  filters, 
  setFilters
}) => {
  const [hasBeenFiltered, setHasBeenFiltered] = useState(false);

  const companies = getUniqueValues(data, "company_name");
  const locations = getUniqueValues(data, "location");
  const statusOptions = ["Delivered", "Process", "Canceled"];
  const referralOptions = ["Cold Apply", "Employee Ref", "Referred"];

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (filters.company.length > 0) {
      filtered = filtered.filter(app => 
        filters.company.includes(app.company_name)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.referral) {
      filtered = filtered.filter(app => app.referral_type === filters.referral);
    }

    if (filters.location) {
      filtered = filtered.filter(app => app.location === filters.location);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.applied_date).getTime();
      const dateB = new Date(b.applied_date).getTime();
      return filters.order === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [data, filters]);

  useEffect(() => {
    onFilter(filteredData);
    setHasBeenFiltered(
      filters.company.length > 0 || 
      filters.status !== "" || 
      filters.referral !== "" || 
      filters.location !== ""
    );
  }, [filteredData]);

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
          Showing {hasBeenFiltered ? filteredData.length : data.length} of {data.length} Applications
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

      <SelectDropdownWithIcon
        aria_label="Location"
        iconSrc="resources/Icons/Components_Cards/location_icon_cards.png"
        altText="Location"
        value={filters.location}
        onChange={(val) => setFilters({ ...filters, location: val })}
        options={locations}
        placeholder="Location"
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