import { OfferCardProps } from "@/interfaces/OfferCard";

const OfferCardStyles = {
    Card: "rounded-2xl shadow-md overflow-hidden flex flex-col bg-white w-[320px] sm:w-[420px] md:w-[508px] max-w-full min-h-[213px]",
    CardTop: "flex flex-row p-4 gap-4 items-start bg-[#FAF6F6] flex-1 min-h-0",
    Row:"flex flex-row w-full",
    LogoDiv:"flex flex-col justify-start items-start pr-4",
    Logo: "w-12 h-12 rounded-full object-contain max-w-full max-h-full",
    CardContentRow:"flex flex-col flex-1 min-w-0",
    CardContent: "flex-1 flex flex-col gap-1 min-w-0",
    DateText: "text-md text-[#3C3C43] mb-1 font-mono",
    TitleText: "text-2xl font-mono font-bold text-black leading-tight truncate",
    CompanyText: "text-lg text-[#3C3C43]",
    LocationText: "text-lg text-[#0353A4] font-mono",
    FavoriteIcon: "w-[25px] h-[25px] ml-auto cursor-pointer",
    TagsRow: "flex flex-row flex-wrap gap-4 w-full",
    CategoryTag: "rounded-[100px] bg-[#3C3C43] px-3 py-1 text-md text-white font-mono",
    CommonTag: "rounded-[100px] border border-[#3C3C43] px-3 py-1 text-md text-[#3C3C43] font-mono",
    CardBottom: "flex flex-row flex-wrap items-center justify-between bg-[#D9D9D9] px-4 py-3 gap-x-2 w-full",
    HideButton: "flex items-center gap-2 text-[#FF3D00] text-lg font-mono cursor-pointer",
    HideIcon: "w-[25px] h-[25px]",
    AddApplicationButton: "flex items-center gap-2 bg-[#0353A4] text-white px-4 py-2 rounded-lg font-mono text-lg font-semibold cursor-pointer",
    AddIcon: "w-[22px] h-[22px]",
    ApplyButton: "flex items-center gap-2 border border-[#0353A4] text-[#0353A4] px-4 py-2 rounded-lg font-mono text-lg font-semibold bg-white cursor-pointer",
    ApplyIcon: "w-[22px] h-[22px]",
    GroupedButtons:"ml-auto flex flex-row gap-3"
};


const OfferCard: React.FC<OfferCardProps> = ({
    logoSrc, date, title, company, location, tags,
    onHide, onFavorite, onAdd, onApply,
}) => {

    return  (
        <div className={OfferCardStyles.Card}>
        {/* Top Section */}
            <div className={OfferCardStyles.CardTop}>
                <div className={OfferCardStyles.Row}>
                    {/* Logo*/}
                    <div className={OfferCardStyles.LogoDiv}>
                        <img
                            src={logoSrc}
                            alt="Company Logo"
                            className={OfferCardStyles.Logo}
                        />
                    </div>
                    {/*Info*/}
                    <div className={OfferCardStyles.CardContentRow}>
                        <div className={OfferCardStyles.CardContent}>
                            <span className={OfferCardStyles.DateText}>{date}</span>
                            <span className={OfferCardStyles.TitleText}>{title}</span>
                            <span className={OfferCardStyles.CompanyText}>{company}</span>
                            <span className={OfferCardStyles.LocationText}>{location}</span>
                        </div>
                    </div>
                    {/* Favorite Button */}
                    <button
                        aria-label="Favorite-Button"
                        className={OfferCardStyles.FavoriteIcon}
                        onClick={onFavorite}
                        type="button"
                    >
                        <img
                            src="/resources/Favorite_NOTSelected_Cards.png"
                            alt="Favorite"
                            className={OfferCardStyles.FavoriteIcon}
                        />
                    </button>
                </div>
            </div>
            
            {/*Tags*/}
            <div className={OfferCardStyles.CardTop}>
                <div className={OfferCardStyles.TagsRow}>
                    {tags.map((tag, idx) =>
                        tag.type === "category" ? (
                            <span key={idx} className={OfferCardStyles.CategoryTag}>
                                {tag.label}
                            </span>
                            ) : (
                            <span key={idx} className={OfferCardStyles.CommonTag}>
                                {tag.label}
                            </span>
                        )
                    )}
                </div>
            </div>
            {/* Bottom Section */}
            <div className={OfferCardStyles.CardBottom}>
                {/* Hide Button */}
                <button
                    className={OfferCardStyles.HideButton}
                    onClick={onHide}
                    aria-label="Hide"
                    type="button"
                >
                    <img
                        src="/resources/hide_icon_Cards.png"
                        alt="Hide"
                        className={OfferCardStyles.HideIcon}
                    />
                    Hide
                </button>
                <div className={OfferCardStyles.GroupedButtons}>
                    {/* Add Application Button */}
                    <button
                        aria-label="Add Application"
                        className={OfferCardStyles.AddApplicationButton}
                        onClick={onAdd}
                        type="button"
                    >
                        <img
                            src="/resources/Add_icon_Cards.png"
                            alt="Add"
                            className={OfferCardStyles.AddIcon}
                        />
                        Add Application
                    </button>
                    {/* Apply Button */}
                    <button
                        aria-label="Apply-Button"
                        className={OfferCardStyles.ApplyButton}
                        onClick={onApply}
                        type="button"
                    >
                        <img
                            src="/resources/externallink_icon_cards.png"
                            alt="Apply"
                            className={OfferCardStyles.ApplyIcon}
                        />
                        Apply
                    </button>
                </div>
            </div>
        </div> 
    )
}

export default OfferCard