// styles/DataFilterStyles.ts
const fieldBase = "w-full rounded-lg border border-slate-200 bg-white text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

export const DataFilterStyles = {
  Wrapper: "flex w-full flex-col gap-3 lg:card lg:p-5",
  Title: "text-sm font-medium text-slate-500",
  Checkbox: "flex select-none items-center gap-2.5 rounded-lg px-1 py-1 text-sm font-medium text-slate-700",
  CheckboxInput: "h-4 w-4 rounded accent-brand-600",
  Input: `${fieldBase} py-2.5 pl-10 pr-10`,
  Dropdown: `${fieldBase} appearance-none px-3 py-2.5 pl-10 pr-10`,
  ButtonPrimary: "btn-primary w-full",
  ButtonSecondary: "btn-secondary w-full",
  LeftFieldImage: "pointer-events-none absolute z-10 left-3 top-1/2 h-5 w-5 max-h-full max-w-full -translate-y-1/2 object-contain opacity-80",
  RightFieldImage: "pointer-events-none absolute z-10 right-3 top-1/2 h-5 w-5 max-h-full max-w-full -translate-y-1/2 object-contain opacity-60",
  ValueDateSelector: "cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700",
  IconDateSelector: "h-4 w-4 opacity-60 transition-transform",
  ButtonDateSelector: `${fieldBase} flex items-center justify-between gap-2 px-3.5 py-2.5 text-left`,
};
