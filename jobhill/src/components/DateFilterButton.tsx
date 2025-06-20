import { DataFilterStyles } from "@/styles/DataFilterStyles";
import { useState } from "react";

type DateOrder = "newest" | "oldest";

export const DateFilterButton = ({ value, onChange }: {
  value: DateOrder;
  onChange: (val: DateOrder) => void;
}) => {
  const [open, setOpen] = useState(false);

  const labelMap: Record<DateOrder, string> = {
    newest: "Order by Newest First",
    oldest: "Order by Oldest First",
  };

  const handleSelect = (val: DateOrder) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(prev => !prev)}
        className={DataFilterStyles.ButtonDateSelector}
      >
        <span>{labelMap[value]}</span>
        <img
          src="/resources/Icons/Components_Cards/OrderbyFirst_Icon_Cards.png"
          alt="Chevron"
          className={`${DataFilterStyles.IconDateSelector} ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-[#D9D9D9] rounded-md shadow-md mt-1 ">
          {Object.entries(labelMap).map(([val, label]) => (
            <div
              key={val}
              onClick={() => handleSelect(val as DateOrder)}
              className={DataFilterStyles.ValueDateSelector}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
