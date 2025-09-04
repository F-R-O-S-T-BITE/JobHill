import { useOfferCardLogic } from "@/hooks/useOfferCardLogic";
import { OfferCardProps, UserPreferences } from "@/interfaces/OfferCard";
import { OfferCardStyles } from "@/styles/OfferCardStyles";
import ConfirmAppliedModal from "./ConfirmAppliedModal";


const OfferCard = ({card,userPreferences}:{card:OfferCardProps,userPreferences:UserPreferences} ) => {

    const OfferCardLogic ={
        card:card,
        userPreferences:userPreferences
    }

    const { 
        isFavorite,
        handleHideClick, 
        handleFavoriteClick, 
        handleAddClick, 
        handleApplyClick,
        isConfirmationAppliedModalOpen,
        handleCancelShowConfirmationAddModal,
        handleShowConfirmationAddModal,
        isAddModalOpen,
        handleCancelShowAddModal,
        handleShowAddModal
    } = useOfferCardLogic(OfferCardLogic);

    return  (
        <div className="w-full flex justify-center">
            <div className={OfferCardStyles.Card}>
            {/* Top Section */}
                <div className={OfferCardStyles.CardTop}>
                    <div className={OfferCardStyles.Row}>
                        {/* Logo*/}
                        <div className={OfferCardStyles.LogoDiv}>
                            <img
                                src={card.logoSrc}
                                alt="Company Logo"
                                className={OfferCardStyles.Logo}
                            />
                        </div>
                        {/*Info*/}
                        <div className={OfferCardStyles.CardContentRow}>
                            <div className={OfferCardStyles.CardContent}>
                                <span className={OfferCardStyles.DateText}>{card.publish_date}</span>
                                <span className={OfferCardStyles.TitleText}>{card.title}</span>
                                <span className={OfferCardStyles.CompanyText}>{card.company}</span>
                                <span className={OfferCardStyles.LocationText}>
                                    {Array.isArray(card.location)
                                    ? card.location.length > 1
                                        ? `+${card.location.length} locations`
                                        : card.location[0]
                                    : card.location}</span>
                            </div>
                        </div>
                        {/* Favorite Button */}
                        <button
                            aria-label="Favorite-Button"
                            className={OfferCardStyles.FavoriteIcon}
                            onClick={handleFavoriteClick}
                            type="button"
                        >
                            <img
                                src={isFavorite 
                                    ? "/resources/Icons/Cards/Favorite_Selected_Cards.png"
                                    : "/resources/Icons/Cards/Favorite_NOTSelected_Cards.png"
                                }
                                alt="Favorite"
                                className={OfferCardStyles.FavoriteIcon}
                            />
                        </button>
                    </div>
                </div>
                
                {/*Tags*/}
                <div className={`flex flex-col gap-3 items-start sm:flex-row flex-1 bg-[#FAF6F6] pl-3 sm:px-4 pb-2 `}>
                    <div className={OfferCardStyles.TagsRow}>
                        {card.tags.map((tag, idx) =>
                            tag.type === "category" ? (
                                <span key={idx} className={OfferCardStyles.CategoryTag}>
                                    {tag.label}
                                </span>
                                ) : 
                                tag.type === "extra_critical_requirements" ? (
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
                        onClick={handleHideClick}
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
                            onClick={handleAddClick}
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
                            onClick={handleApplyClick}
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
            {isConfirmationAppliedModalOpen && ( 
                <ConfirmAppliedModal
                    onClose={handleCancelShowConfirmationAddModal}
                    onAdd={handleShowAddModal}
                />
            )}
        </div>
    )
}

export default OfferCard