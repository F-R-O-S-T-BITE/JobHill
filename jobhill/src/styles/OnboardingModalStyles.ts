// styles/OnboardingModalStyles.ts
export const OnboardingModalStyles = {
  // Contenedor: hoja inferior en móvil, modal centrado en desktop
  Overlay: "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4",
  Modal: "flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-pop animate-slide-up sm:max-h-[90dvh] sm:rounded-2xl",

  // Header
  HeaderContent: "flex-col items-center",

  // Contenido (es lo que hace scroll)
  Content: "min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6",
  StepTitle: "mt-3 text-center font-display text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl",
  StepSubtitle: "mx-auto mt-1.5 max-w-xl text-center text-sm text-slate-600 sm:text-base",
  instruction: "text-center text-sm text-slate-600",

  // Bienvenida
  WelcomeContainer: "px-2 py-10 text-center sm:py-14",
  WelcomeTitle: "mb-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl",
  WelcomeSubtitle: "mx-auto mb-8 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg",
  BeginButton: "btn-primary px-8 py-3 text-base",

  // Preferencias de empresas
  CompanyPreferencesContainer: "mx-auto max-w-4xl",
  PreferencesSection: "mb-8",
  PreferencesTitle: "mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900",
  PreferencesDescription: "mb-4 text-sm text-slate-600",
  SearchContainer: "sticky top-0 z-10 -mx-1 mb-4 bg-white px-1 pb-2 pt-1",
  SearchInput: "field pl-10",
  SearchIcon: "absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400",
  Input: "w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10",

  // Grid de empresas
  CompanyGrid: "grid grid-cols-2 gap-3 pt-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  CompanyCard: "relative flex cursor-pointer select-none flex-col items-center gap-2 rounded-xl border-2 p-3 text-center text-sm transition-all duration-150 active:scale-[0.97]",
  CompanyCardDefault: "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50/50",
  CompanyCardFavorite: "border-amber-300 bg-amber-50 text-amber-900",
  CompanyCardHidden: "border-red-300 bg-red-50 text-red-800",
  CompanyLogo: "mx-auto h-12 w-12 flex-shrink-0 rounded-lg object-contain",
  CompanyName: "text-xs font-semibold leading-tight",
  CompanyBadge: "absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-sm",
  FavoriteBadge: "bg-amber-400 text-white",
  HiddenBadge: "bg-red-500 text-white",

  // Categorías
  CategoryGrid: "grid grid-cols-1 gap-2.5 pt-2 xs:grid-cols-2 md:grid-cols-3",
  CategoryCard: "rounded-xl border-2 p-3.5 text-center text-sm font-medium transition-all disabled:cursor-not-allowed",
  CategoryCardDefault: "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50/50",
  CategoryCardSelected: "border-brand-600 bg-brand-600 text-white shadow-sm",
  CategoryCardDisabled: "border-slate-100 bg-slate-50 text-slate-400",

  // Autorización de trabajo
  LegalStatusContainer: "text-center",
  LegalSection: "py-3",
  LegalSectionTitle: "font-display text-lg font-semibold text-slate-900 sm:text-xl",
  LegalSubtitle: "mx-auto mb-4 mt-1 max-w-lg text-base leading-relaxed text-slate-600",

  RadioGroup: "flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap",
  RadioOption: "relative flex cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 px-4 py-3 transition-all hover:border-brand-300 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50",
  RadioInput: "mr-2.5 h-4 w-4 accent-brand-600",
  RadioLabel: "flex items-center gap-2 text-sm font-medium text-slate-700",

  // Tooltip
  TooltipContainer: "group relative inline-block",
  TooltipIcon: "h-4 w-4 cursor-help text-slate-400 hover:text-slate-600",
  Tooltip: "invisible absolute left-1/2 top-full z-50 mt-1 max-w-xs -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-all duration-200",
  TooltipVisible: "visible opacity-100",

  // Footer
  Footer: "flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3 sm:px-6 sm:py-4",
  BackButton: "btn-secondary",
  ButtonGroup: "flex items-center gap-2 sm:gap-3",
  NextButton: "btn-primary px-6",
  CompleteButton: "btn-primary px-6",
  LoadingSpinner: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent",
  StepIndicator: "text-sm font-medium text-slate-500",

  // Revisión
  ReviewContainer: "mx-auto max-w-4xl space-y-6 pt-2",
  ReviewSectionTitle: "mb-3 flex items-center gap-2 font-semibold text-slate-900",
  ReviewSectionTitlePreferred: "mb-3 flex items-center gap-2 font-semibold text-slate-900",
  ReviewSectionTitleHidden: "mb-3 flex items-center gap-2 font-semibold text-slate-900",

  CompanyReviewGrid: "grid grid-cols-1 gap-2 rounded-xl border p-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  CompanyReviewGridPreferred: "border-amber-200 bg-amber-50/60",
  CompanyReviewGridHidden: "border-red-200 bg-red-50/60",
  CompanyReviewCard: "flex min-w-0 items-center gap-2 rounded-lg bg-white p-2 shadow-sm",
  CompanyReviewLogo: "h-8 w-8 rounded object-contain",
  CompanyReviewLogoFallback: "flex h-8 w-8 items-center justify-center rounded bg-brand-50 text-xs font-bold text-brand-700",
  CompanyReviewName: "truncate text-sm font-medium text-slate-700",

  CategoryReviewGrid: "flex flex-wrap gap-2 rounded-xl border border-brand-100 bg-brand-50/60 p-3",
  CategoryReviewCard: "rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-brand-100",
  CategoryReviewName: "text-sm font-medium text-brand-700",

  WorkAuthReviewItem: "flex items-center gap-2",
  WorkAuthReviewIndicatorHide: "h-2 w-2 rounded-full bg-red-500",
  WorkAuthReviewIndicatorShow: "h-2 w-2 rounded-full bg-brand-500",

  RoleLevelsReviewIndicatorHide: "h-2 w-2 rounded-full bg-red-500",
  RoleLevelsReviewIndicatorShow: "h-2 w-2 rounded-full bg-brand-500",

  // Íconos
  StarIcon: "h-3 w-3",
  EyeSlashIcon: "h-3 w-3",
  ThumbUpIcon: "h-5 w-5 text-brand-500",
  EyeOffIcon: "h-5 w-5 text-red-500",
  PreferredIcon: "text-amber-500",
  HiddenIcon: "text-red-500",
}
