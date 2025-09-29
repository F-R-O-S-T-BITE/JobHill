export const OnboardingModalStyles = {
  // Modal container
  Overlay: "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4",
  Modal: "bg-white rounded-2xl shadow-xl w-[900px] max-h-[90vh] flex flex-col overflow-hidden",  
  // Header
  HeaderContent: "flex-col items-center ",
  
  // Content
  Content: "p-6 -mt-5", 
  StepTitle: "text-2xl sm:text-3xl md:text-4xl font-bold text-[#0353A4] mt-2 sm:mt-3 text-center",
  StepSubtitle: "text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2 text-center max-w-xl sm:max-w-2xl mx-auto",
  instruction: "text-sm text-[#33415C] text-center",
  
  // Welcome Step
  WelcomeContainer: "text-center py-12",
  WelcomeTitle: "text-3xl font-bold text-[#0353A4] mb-6",
  WelcomeSubtitle: "text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed",
  BeginButton: "bg-[#0353A4] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#024080] transition-colors",
  
  // Company Preferences
  CompanyPreferencesContainer: "max-w-4xl mx-auto",
  PreferencesSection: "mb-8",
  PreferencesTitle: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",
  PreferencesDescription: "text-sm text-gray-600 mb-4",
  SearchContainer: "relative mb-6",
  SearchInput: "w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0353A4] focus:border-transparent",
  SearchIcon: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400",
  Input: "w-full border border-[#D9D9D9] hover:border-[#0466C8] rounded-md pl-10 pr-10 py-2 text-md text-[#0353A4] placeholder-dataFilter",

  
  // Company Grid
  CompanyGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto rounded-lg ",
  CompanyCard: "relative p-4 text-sm rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md",
  CompanyCardDefault: "border-gray-200 bg-white text-gray-700 hover:border-[#0353A4] hover:bg-blue-50",
  CompanyCardFavorite: "border-[#0466C8] bg-blue-50 text-blue-700 shadow-blue-100",
  CompanyCardHidden: "border-red-500 bg-red-50 text-red-700 shadow-red-100",
  CompanyLogo: "w-12 h-12 rounded-lg object-contain mx-auto flex-shrink-0",
  CompanyName: "text-xs font-semibold leading-tight",
  CompanyBadge: "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm border-2 border-white",
  FavoriteBadge: "bg-[#0466C8] text-white",
  HiddenBadge: "bg-red-500 text-white",
  
  // Categories
  CategoryGrid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 h-[400px] overflow-y-auto",
  CategoryCard: "p-4 text-sm rounded-lg border-2 transition-all text-center cursor-pointer disabled:cursor-not-allowed",
  CategoryCardDefault: "border-gray-300 bg-white text-gray-700 hover:border-[#0353A4]",
  CategoryCardSelected: "border-[#0353A4] bg-[#0353A4] text-white",
  CategoryCardDisabled: "border-gray-200 bg-gray-100 text-gray-400",
  
  // Legal Status
  LegalStatusContainer: " text-center -mt-2",
  LegalSection: "p-2",
  LegalSectionTitle: "font-semibold text-2xl  text-[#0466C8]",
  LegalSubtitle: "text-lg text-gray-600 smax-w-lg mx-auto leading-relaxed",

  RadioGroup: "flex justify-center flex-wrap gap-6",
  RadioOption: "flex items-center border border-[#0353A4] rounded-lg p-2 cursor-pointer hover:border-[#0353A4] transition-all relative ",
  RadioInput: "mr-2 text-[#0353A4] focus:ring-[#0353A4] w-3 h-3",
  RadioLabel: "text-gray-700 flex items-center gap-2",

  // Tooltip styles
  TooltipContainer: "relative inline-block group",
  TooltipIcon: "w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help",
  Tooltip: "absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg opacity-0 invisible transition-all duration-200 whitespace-nowrap z-50 max-w-xs",
  TooltipVisible: "opacity-100 visible",
  
  // Footer
  Footer: "p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0",
  BackButton: "px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
  ButtonGroup: "flex gap-3",
  NextButton: "px-6 py-2 bg-[#0353A4] text-white rounded-lg hover:bg-[#024080] transition-colors",
  CompleteButton: "px-6 py-2 bg-[#0353A4] text-white rounded-lg hover:bg-[#024080] transition-colors disabled:opacity-50 flex items-center gap-2",
  LoadingSpinner: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin",
  StepIndicator: "text-sm text-gray-500",

  
  // Review Step (Step 4)
  ReviewContainer: "max-w-4xl mx-auto space-y-6 max-h-96 overflow-y-auto",
  ReviewSectionTitle: "font-semibold text-gray-900 mb-3 flex items-center gap-2",
  ReviewSectionTitlePreferred: "font-semibold text-gray-900 mb-3 flex items-center gap-2",
  ReviewSectionTitleHidden: "font-semibold text-gray-900 mb-3 flex items-center gap-2",
  
  // Company Review Cards
  CompanyReviewGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 rounded-lg border",
  CompanyReviewGridPreferred: "bg-blue-50 border-blue-200",
  CompanyReviewGridHidden: "bg-red-50 border-red-200",
  CompanyReviewCard: "flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm",
  CompanyReviewLogo: "w-8 h-8 object-contain rounded",
  CompanyReviewLogoFallback: "w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600",
  CompanyReviewName: "text-sm font-medium text-gray-700 truncate",
  
  // Category Review Cards
  CategoryReviewGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200",
  CategoryReviewCard: "p-3 bg-white rounded-lg shadow-sm border border-blue-100",
  CategoryReviewName: "text-sm font-medium text-blue-700",
  
  // Work Authorization Review
  WorkAuthReviewItem: "flex items-center gap-2",
  WorkAuthReviewIndicatorHide: "w-2 h-2 rounded-full bg-red-500",
  WorkAuthReviewIndicatorShow: "w-2 h-2 rounded-full bg-[#0466C8]",

  RoleLevelsReviewIndicatorHide: "w-2 h-2 rounded-full bg-red-500 text-black",
  RoleLevelsReviewIndicatorShow: "w-2 h-2 rounded-full bg-[#0466C8] text-black",

  // Icons
  StarIcon: "w-3 h-3",
  EyeSlashIcon: "w-3 h-3",
  ThumbUpIcon: "w-5 h-5 text-[#0466C8]",
  EyeOffIcon: "w-5 h-5 text-red-500",
  PreferredIcon: "text-[#0466C8]",
  HiddenIcon: "text-red-500",
}