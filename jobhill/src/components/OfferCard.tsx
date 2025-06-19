import { OfferCardProps } from "@/interfaces/OfferCard";
import { OfferCardStyles } from "@/styles/OfferCardStyles";


const OfferCard: React.FC<OfferCardProps> = ({
    logoSrc, publish_date, title, company, location, tags,
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
                            <span className={OfferCardStyles.DateText}>{publish_date}</span>
                            <span className={OfferCardStyles.TitleText}>{title}</span>
                            <span className={OfferCardStyles.CompanyText}>{company}</span>
                            <span className={OfferCardStyles.LocationText}>
                                {Array.isArray(location)
                                ? location.length > 1
                                    ? `+${location.length} locations`
                                    : location[0]
                                : location}</span>
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
                            src="/resources/Icons/Cards/Favorite_Selected_Cards.png"
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
                            ) : 
                            tag.type === "critical" ? (
                            <span key={idx} className={OfferCardStyles.CriticalTag}>
                                {tag.label}
                            </span>
                            ) : 
                            (
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
                        src="/resources/Icons/Cards/hide_icon_Cards.png"
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
                            src="/resources/Icons/Cards/Add_icon_Cards.png"
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
                            src="/resources/Icons/Cards/externallink_icon_cards.png"
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