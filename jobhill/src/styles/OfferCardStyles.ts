// styles/OfferCardStyles.ts
export const OfferCardStyles = {
    Card: "group card flex h-full w-full flex-col p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-card-hover sm:p-5",
    CardTop: "flex items-start gap-3 sm:gap-4",
    CardContent: "min-w-0 flex-1",
    CompanyText: "truncate text-sm font-medium text-slate-500",
    TitleText: "mt-0.5 line-clamp-2 font-display text-base font-semibold leading-snug text-slate-900 sm:text-[1.05rem]",
    MetaRow: "mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500",
    MetaItem: "inline-flex items-center gap-1",
    MetaIcon: "h-3.5 w-3.5 shrink-0",
    LocationText: "inline-flex min-w-0 items-center gap-1 text-brand-600",
    FavoriteButton: "-mr-1 -mt-1 shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-500",
    FavoriteIcon: "h-5 w-5",
    TagsRow: "mt-4 flex flex-wrap gap-1.5",
    CategoryTag: "rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100",
    CriticalTag: "rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-100",
    CommonTag: "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600",
    AppliedBadge: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100",
    CardBottom: "mt-auto flex items-center gap-2 border-t border-slate-100 pt-4",
    Spacer: "mt-4",
    HideButton: "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600",
    ActionIcon: "h-4 w-4",
    GroupedButtons: "ml-auto flex flex-1 gap-2 sm:flex-none",
    AddApplicationButton: "btn-secondary flex-1 px-3 sm:flex-none",
    ApplyButton: "btn-primary flex-1 px-4 sm:flex-none",
};

export const CompanyCardStyles = {
    Card: "group relative card flex h-full w-full cursor-pointer flex-col items-center p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
    IconContainer: "absolute inset-x-2 top-2 flex justify-between",
    IconButton: "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600",
    HideIconActive: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
    PreferIconActive: "bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-600",
    CardContent: "mt-3 flex w-full flex-col items-center",
    CompanyName: "w-full truncate text-sm font-semibold text-slate-900 sm:text-base",
    OfferCount: "mt-0.5 text-xs font-medium text-slate-500",
};

export const OfferCardHolderStyles = {
    Wrapper: "w-full",
    Grid: "grid grid-cols-1 gap-4 2xl:grid-cols-2",
    CompanyGrid: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
};

/* Modales compartidos */
export const OfferCardModalStyles = {
    Overlay: "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4",
    Modal: "relative w-full max-w-lg rounded-t-3xl bg-white p-6 text-center shadow-pop animate-slide-up sm:rounded-2xl sm:p-8",
    Title: "font-display text-xl font-bold text-slate-900 sm:text-2xl",
    Subtitle: "mt-2 text-base text-slate-600",
    ButtonRow: "mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center",
    ConfirmButton: "btn-primary w-full py-3 sm:w-auto sm:px-6",
    CancelButton: "btn-secondary w-full py-3 sm:w-auto sm:px-6"
};

export const AddAppModalStyles = {
    Overlay: "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4",
    Modal: "relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-pop animate-slide-up sm:rounded-2xl",
    Header: "relative border-b border-slate-100 px-6 pb-4 pt-6",
    Title: "font-display text-xl font-bold text-slate-900",
    CloseButton: "absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600",
    CloseIcon: "h-5 w-5",
    FormSection: "flex-1 overflow-y-auto p-6",
    SectionTitle: "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500",
    CompanyRow: "flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100",
    CompanyLogo: "h-12 w-12 rounded-xl bg-white object-contain p-1 ring-1 ring-slate-200",
    CompanyInfo: "min-w-0 flex-1",
    CompanyName: "truncate text-base font-semibold text-slate-900",
    JobTitle: "truncate text-sm text-slate-600",
    FormRow: "mb-4 flex flex-col gap-4 last:mb-0 sm:flex-row sm:items-center",
    FormGroup: "flex-1",
    FormLabel: "mb-1.5 block text-sm font-medium text-slate-700",
    FormInput: "field",
    FormSelect: "field cursor-pointer",
    ButtonRow: "flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 p-4 sm:flex-row sm:justify-end",
    SaveButton: "btn-primary w-full py-3 sm:w-auto sm:px-6",
    CancelButton: "btn-secondary w-full py-3 sm:w-auto sm:px-6"
};

/* Toasts */
const ToastBase = {
    ToastWrapper: "relative",
    ToastShadow: "hidden",
    Logo: "h-9 w-9 rounded-lg bg-white object-contain p-0.5 ring-1 ring-slate-200",
    LogoContainer: "flex-shrink-0",
    Content: "min-w-0 flex-1",
    UndoContainer: "flex-shrink-0",
    UndoButton: "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700",
    UndoIcon: "h-3.5 w-3.5",
    HiddenIcon: "mr-1 h-3.5 w-3.5",
    ProgressContainer: "mr-3 flex-1",
    ProgressLabel: "text-[11px] text-slate-500",
    SecondsDisplay: "font-mono text-[11px] text-slate-500",
    ProgressBar: "relative h-1 overflow-hidden rounded-full bg-slate-100",
    ProgressFill: "h-full rounded-full bg-brand-500 transition-all duration-100 ease-linear",
    BottomUndoButton: "flex flex-shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700",
};

export const HideJobToastStyles = {
    ...ToastBase,
    Container: "relative flex w-[300px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop",
    ContentRow: "flex items-center gap-3 p-3",
    JobTitle: "truncate text-sm font-semibold text-slate-900",
    CompanyName: "truncate text-xs text-slate-500",
    HiddenText: "text-xs font-semibold text-slate-700",
    HiddenRow: "flex items-center",
    BottomRow: "flex items-center justify-between px-3 pb-3",
    ProgressHeader: "mb-1 flex items-center justify-between",
};

export const ApplicationSuccessToastStyles = {
    ToastWrapper: "relative",
    ToastShadow: "hidden",
    Container: "relative flex w-[300px] max-w-[calc(100vw-2rem)] items-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-pop",
    LogoContainer: "mr-3 flex-shrink-0",
    Logo: "h-9 w-9 rounded-lg bg-white object-contain p-0.5 ring-1 ring-slate-200",
    Content: "min-w-0 flex-1",
    MessageText: "text-sm font-semibold text-slate-900",
    JobTitle: "truncate text-xs font-medium text-slate-700",
    CompanyName: "truncate text-xs text-slate-500",
    CheckIcon: "mr-1.5 h-4 w-4 flex-shrink-0 text-emerald-600",
    MessageContainer: "mb-0.5 flex items-center"
};

export const HideCompanyToastStyles = {
    ...ToastBase,
    Container: "relative flex w-[300px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop",
    ContentRow: "flex items-center gap-3 p-3",
    CompanyName: "truncate text-sm font-semibold text-slate-900",
    JobCount: "text-xs text-slate-500",
    HiddenText: "text-xs font-semibold text-slate-700",
    HiddenRow: "mb-0.5 flex items-center",
    BottomRow: "flex items-center justify-between px-3 pb-3",
    ProgressHeader: "mb-1 flex items-center justify-between",
};
