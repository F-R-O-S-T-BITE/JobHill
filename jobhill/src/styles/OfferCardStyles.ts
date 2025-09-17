export const OfferCardStyles = {
    Card: "rounded-2xl shadow-lg overflow-hidden flex flex-col bg-white w-full w-full xm:w-[95%] sm:w-[90%] md:w-[90%] lg:w-[95%] xl:w-[95%] 2xl:w-[95%] 3xl:w-[95%] 4xl:w-[90%]  max-w-[95vw] min-h-[213px] transition-all duration-500 ease-in-out",
    CardHiding: "opacity-0 scale-95 pointer-events-none",
    CardVisible: "opacity-100 scale-100",
    CardWrapper: "w-full flex justify-center transition-all duration-500 ease-in-out",
    CardWrapperHiding: "h-0 mb-0 overflow-hidden",
    CardTop: "flex flex-col sm:flex-row p-3 sm:p-4 gap-3 sm:gap-4 items-start bg-[#FAF6F6] flex-1",
    Row: "flex flex-col sm:flex-row w-full gap-2 sm:gap-4",
    LogoDiv: "flex flex-col justify-start items-start sm:pr-4 mt-2 sm:mt-3",
    Logo: "w-[4rem] h-[4rem] sm:w-20 sm:h-20 rounded-full object-contain max-w-full max-h-full",
    CardContentRow: "flex flex-col flex-1",
    CardContent: "flex flex-col flex-1",
    DateText: "text-sm sm:text-[1rem] text-[#3C3C43] font-mono",
    TitleText: "text-base xm:text-[1.125rem] sm:text-[1.125rem] font-mono font-bold text-black leading-tight",
    CompanyText: "text-sm xm:text-[1.125rem] text-[#3C3C43]",
    LocationText: "text-sm xm:text-[1.125rem] text-[#0353A4] font-mono",
    FavoriteIcon: "w-[20px] h-[20px] ml-auto cursor-pointer hidden sm:block",
    TagsRow: "flex flex-wrap gap-2 w-full",
    CategoryTag: "rounded-[100px] bg-[#3C3C43] px-3 py-1 text-sm sm:text-md text-white font-mono",
    CriticalTag: "rounded-[100px] border border-[#FF3D00] px-3 py-1 text-sm sm:text-md text-[#FF3D00] font-mono",
    CommonTag: "rounded-[100px] border border-[#3C3C43] px-3 py-1 text-sm sm:text-md text-[#3C3C43] font-mono",
    CardBottom: "flex flex-col sm:flex-row flex-wrap items-center justify-start sm:justify-between bg-[#D9D9D9] px-3 py-2 gap-2 w-full",
    HideButton: "flex items-center gap-2 text-[#FF3D00] px-3 py-1 rounded-lg font-mono text-sm font-semibold cursor-pointer",
    HideIcon: "w-[20px] h-[20px]",
    AddApplicationButton: "flex items-center justify-center gap-2 bg-[#0353A4] text-white w-full sm:w-auto px-3 py-1.5 rounded-lg font-mono text-sm font-semibold cursor-pointer",
    AddIcon: "w-[20px] h-[20px]",
    ApplyButton: "flex items-center justify-center gap-2 bg-white text-[#0353A4] w-full sm:w-auto px-3 py-1.5 rounded-lg font-mono text-sm font-semibold cursor-pointer",
    ApplyIcon: "w-[20px] h-[20px]",
    GroupedButtons: "flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto",
};

export const CompanyCardStyles = {
    Card: "rounded-2xl shadow-lg overflow-hidden bg-white w-full h-[200px] border-2 transition-all duration-200",
    CardTop: "flex flex-col items-center p-4 bg-white h-full",
    IconContainer: "flex justify-between items-center w-full ",
    HideIcon: "w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 p-2 rounded-full text-gray-500 hover:bg-gray-100",
    PreferIcon: "w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 p-2 rounded-full text-gray-500 hover:bg-gray-100",
    HideIconActive: "bg-red-50 border border-red-300 text-red-600 hover:bg-red-100",
    PreferIconActive: "bg-green-50 border border-green-300 text-green-600 hover:bg-green-100",
    Logo: "w-16 h-16 object-contain rounded-lg",
    LogoContainer: "w-24 h-24 flex items-center justify-center",
    CardContent: "flex flex-col items-center text-center w-full mt-2",
    CompanyName: "text-lg font-semibold text-gray-900 truncate w-full",
    OfferCount: "text-sm text-gray-500",
    ModalTitle: "text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-[#023E7D]",
    Modal: "bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 w-full sm:w-[80%] md:w-[60%] lg:w-1/2 max-w-2xl text-center flex flex-col" ,
};

export const OfferCardHolderStyles = {
    Wrapper: "mt-6 w-full max-w-[95vw] lg:max-w-[1250px]  mx-auto px-4 md:px-6 lg:px-8 lg:max-h-[940px] xl:max-h-[1200px] lg:overflow-y-auto border rounded-xl p-10 shadow-md",
    Grid: "grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8  justify-items-center flex-grow",
    CompanyGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 justify-items-center flex-grow"
};


export const OfferCardModalStyles = {
    Overlay: "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4",
    Modal: "bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 w-full sm:w-[80%] md:w-[60%] lg:w-1/2 max-w-2xl text-center flex flex-col",
    Title: "text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-[#023E7D]",
    Subtitle: "text-base sm:text-lg font-semibold text-black",
    ButtonRow: "flex flex-col sm:flex-row gap-3 justify-center mt-4 sm:mt-6",
    ConfirmButton: "w-full sm:w-auto bg-[#0353A4] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl hover:bg-[#03459E] transition-colors cursor-pointer text-sm sm:text-base",
    CancelButton: "w-full sm:w-auto bg-white border text-black px-4 sm:px-6 py-2 rounded-xl hover:bg-gray-100 transition-colors border-black outline cursor-pointer text-sm sm:text-base"
};

export const AddAppModalStyles = {
    Overlay: "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4",
    Modal: "bg-white rounded-xl shadow-lg w-full max-w-sm flex flex-col max-h-[85vh] overflow-y-auto relative",
    Header: "bg-[#023E7D] text-center px-6 pt-6 pb-2 relative rounded-t-xl",
    Title: "text-xl md:text-2xl font-bold text-white",
    CloseButton: "absolute top-2 right-2 w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors",
    CloseIcon: "w-5 h-5 mt-0.5" ,
    FormSection: "p-6 flex-1 overflow-y-auto",
    SectionTitle: "text-lg font-bold text-[#84878E] mb-2 flex items-center gap-2",
    CompanyRow: "flex items-center gap-3 p-3 bg-gray-100 rounded-lg w-full",
    CompanyLogo: "w-12 h-12 rounded-full object-contain",
    CompanyInfo: "flex-1",
    CompanyName: "text-lg font-semibold text-black",
    JobTitle: "text-sm text-gray-600",
    FormRow: "flex items-center gap-4 mb-4 last:mb-0",
    FormGroup: "flex-1",
    FormLabel: "block text-sm font-semibold text-[#84878E] mb-1",
    FormInput: "w-full px-4 py-3 border border-[#D9D9D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#99BDE2] focus:border-transparent text-black",
    FormSelect: "w-full px-4 py-3 border border-[#D9D9D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#99BDE2] focus:border-transparent bg-white cursor-pointer text-black",
    ButtonRow: "flex flex-row gap-3 justify-center border-t border-gray-200 p-4 shrink-0",
    SaveButton: "w-full sm:w-auto bg-[#0353A4] text-white px-8 py-3 rounded-xl hover:bg-[#03459E] transition-colors cursor-pointer text-base font-semibold",
    CancelButton: "w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-base font-semibold"
};

export const HideJobToastStyles = {
    ToastWrapper: "relative",
    ToastShadow: "absolute inset-0 bg-[#0353A4] rounded-lg -translate-x-1 translate-y-1",
    Container: "relative flex flex-col bg-white rounded-lg shadow-lg border border-gray-200 w-[280px] overflow-hidden",
    ContentRow: "flex items-center gap-2 p-3",
    LogoContainer: "flex-shrink-0",
    Logo: "w-8 h-8 rounded-full object-contain",
    Content: "flex-1 min-w-0",
    JobTitle: "text-xs font-semibold text-gray-900 truncate max-w-[140px]",
    CompanyName: "text-[10px] text-gray-600 truncate",
    HiddenText: "text-[10px] font-semibold text-gray-900",
    HiddenIcon: "w-3 h-3 mr-1",
    HiddenRow: "flex items-center ",
    UndoContainer: "flex-shrink-0",
    UndoButton: "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#0353A4] hover:text-[#023E7D] hover:bg-blue-50 rounded-md transition-colors",
    UndoIcon: "w-3 h-3",
    BottomRow: "flex items-center justify-between px-3 pb-2 -mt-3",
    ProgressContainer: "flex-1 mr-3",
    ProgressHeader: "flex justify-between items-center",
    ProgressLabel: "text-[10px] text-gray-500",
    SecondsDisplay: "text-[10px] font-mono text-gray-600",
    ProgressBar: "h-1.5 bg-gray-200 rounded-full relative overflow-hidden",
    ProgressFill: "h-full bg-[#0353A4] transition-all duration-100 ease-linear rounded-full",
    BottomUndoButton: "flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#0353A4] hover:text-[#023E7D] hover:bg-blue-50 rounded-md transition-colors flex-shrink-0"
};

export const ApplicationSuccessToastStyles = {
    ToastWrapper: "relative",
    ToastShadow: "absolute inset-0 bg-[#28a745] rounded-lg -translate-x-1 translate-y-1",
    Container: "relative flex items-center bg-white rounded-lg shadow-lg border border-gray-200 w-[280px] p-4",
    LogoContainer: "flex-shrink-0 mr-3",
    Logo: "w-8 h-8 rounded-full object-contain",
    Content: "flex-1 min-w-0",
    MessageText: "text-sm font-semibold text-gray-900 mb-1",
    JobTitle: "text-xs font-semibold text-gray-900 truncate",
    CompanyName: "text-[10px] text-gray-600 truncate",
    CheckIcon: "w-5 h-5 text-[#28a745] mr-2 flex-shrink-0",
    MessageContainer: "flex items-center"
};

export const HideCompanyToastStyles = {
    ToastWrapper: "relative",
    ToastShadow: "absolute inset-0 bg-[#0353A4] rounded-lg -translate-x-1 translate-y-1",
    Container: "relative flex flex-col bg-white rounded-lg shadow-lg border border-gray-200 w-[280px] overflow-hidden",
    ContentRow: "flex items-center gap-2 p-3",
    LogoContainer: "flex-shrink-0",
    Logo: "w-8 h-8 rounded-full object-contain",
    Content: "flex-1 min-w-0",
    CompanyName: "text-sm font-semibold text-gray-900 truncate",
    JobCount: "text-xs text-gray-600",
    HiddenText: "text-xs font-semibold text-gray-900",
    HiddenIcon: "w-3 h-3 mr-1",
    HiddenRow: "flex items-center mb-1",
    UndoContainer: "flex-shrink-0",
    UndoButton: "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#0353A4] hover:text-[#023E7D] hover:bg-blue-50 rounded-md transition-colors",
    UndoIcon: "w-3 h-3",
    BottomRow: "flex items-center justify-between px-3 pb-2",
    ProgressContainer: "flex-1 mr-3",
    ProgressHeader: "flex justify-between items-center mb-1",
    ProgressLabel: "text-[10px] text-gray-500",
    SecondsDisplay: "text-[10px] font-mono text-gray-600",
    ProgressBar: "h-1.5 bg-gray-200 rounded-full relative overflow-hidden",
    ProgressFill: "h-full bg-[#0353A4] transition-all duration-100 ease-linear rounded-full",
    BottomUndoButton: "flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#0353A4] hover:text-[#023E7D] hover:bg-blue-50 rounded-md transition-colors flex-shrink-0"
};