// components/DateFilterButton.tsx
import { DataFilterStyles } from "@/styles/DataFilterStyles";
import { useState } from "react";

type DateOrder = "newest" | "oldest";

export const DateFilterButton = ({ value, onChange }: {
  value: DateOrder;
  onChange: (val: DateOrder) => void;
}) => {
  const [open, setOpen] = useState(false);

  const labelMap: Record<DateOrder, string> = {
    newest: "Newest first",
    oldest: "Oldest first",
  };

  const handleSelect = (val: DateOrder) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(prev => !prev)}
        className={DataFilterStyles.ButtonDateSelector}
      >
        <span><span className="text-slate-500">Sort:</span> {labelMap[value]}</span>
        <img
          src="/resources/Icons/Components_Cards/OrderbyFirst_Icon_Cards.png"
          alt=""
          className={`${DataFilterStyles.IconDateSelector} ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white p-1 shadow-pop" role="listbox">
          {Object.entries(labelMap).map(([val, label]) => (
            <button
              type="button"
              role="option"
              aria-selected={val === value}
              key={val}
              onClick={() => handleSelect(val as DateOrder)}
              className={`${DataFilterStyles.ValueDateSelector} block w-full text-left ${val === value ? 'font-semibold text-brand-700' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
