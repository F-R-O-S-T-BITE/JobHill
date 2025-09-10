export const OnboardingModalStyles = {
  // Modal container
  Overlay: "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4",
  Modal: "bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto",
  
  // Header
  Header: "p-4 ",
  HeaderContent: "flex-col items-center ",
  Title: "text-2xl font-bold text-gray-900",
  StepIndicator: "text-sm text-gray-500",
  ProgressBarContainer: "w-1/2 bg-gray-200 rounded-full h-2  justify-center mx-auto",
  ProgressBar: "bg-[#0353A4] h-2 rounded-full transition-all duration-300 ease-out",
  antCircle: "w-18 h-18 border-b  border-gray-300 rounded-full outline-2",
  
  // Content
  Content: "p-6",
  StepTitle: "text-4xl font-bold text-[#0353A4] mb-1 mt-3 text-center",
  StepSubtitle: "text-gray-600 mt-4 text-center max-w-2xl mx-auto",
  
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
  
  // Company Grid
  CompanyGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4",
  CompanyCard: "relative p-3 text-sm rounded-lg border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2",
  CompanyCardDefault: "border-gray-300 bg-white text-gray-700 hover:border-[#0353A4]",
  CompanyCardFavorite: "border-green-500 bg-green-50 text-green-700",
  CompanyCardHidden: "border-red-500 bg-red-50 text-red-700",
  CompanyLogo: "w-8 h-8 rounded-full object-contain mx-auto",
  CompanyName: "text-xs font-medium",
  CompanyBadge: "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
  FavoriteBadge: "bg-green-500 text-white",
  HiddenBadge: "bg-red-500 text-white",
  
  // Categories
  CategoryGrid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto",
  CategoryCard: "p-4 text-sm rounded-lg border-2 transition-all text-center cursor-pointer",
  CategoryCardDefault: "border-gray-300 bg-white text-gray-700 hover:border-[#0353A4]",
  CategoryCardSelected: "border-[#0353A4] bg-[#0353A4] text-white",
  
  // Legal Status
  LegalStatusContainer: "max-w-2xl mx-auto space-y-6",
  LegalSection: "border border-gray-300 rounded-lg p-6",
  LegalSectionTitle: "font-semibold text-lg mb-4 text-gray-900",
  RadioGroup: "space-y-3",
  RadioOption: "flex items-center",
  RadioInput: "mr-3 text-[#0353A4] focus:ring-[#0353A4] w-4 h-4",
  RadioLabel: "text-gray-700",
  
  // Footer
  Footer: "p-6 border-t border-gray-200 flex justify-between items-center",
  BackButton: "px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
  ButtonGroup: "flex gap-3",
  NextButton: "px-6 py-2 bg-[#0353A4] text-white rounded-lg hover:bg-[#024080] transition-colors",
  CompleteButton: "px-6 py-2 bg-[#0353A4] text-white rounded-lg hover:bg-[#024080] transition-colors disabled:opacity-50 flex items-center gap-2",
  LoadingSpinner: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin",
  
  // Icons
  StarIcon: "w-3 h-3",
  EyeSlashIcon: "w-3 h-3",
  ThumbUpIcon: "w-5 h-5 text-green-500",
  EyeOffIcon: "w-5 h-5 text-red-500",
}