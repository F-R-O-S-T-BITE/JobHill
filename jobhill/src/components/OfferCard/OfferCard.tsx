// components/OfferCard/OfferCard.tsx
import { CheckCircle2, Clock, EyeOff, ExternalLink, MapPin, Plus, Star } from "lucide-react";
import { useOfferCardLogic } from "@/hooks/useOfferCardLogic";
import { OfferCardProps, UserPreferences } from "@/interfaces/OfferCard";
import { OfferCardStyles as s } from "@/styles/OfferCardStyles";
import CompanyLogo from "@/components/ui/CompanyLogo";
import ConfirmAppliedModal from "./ConfirmAppliedModal";
import AddAppModal from "./AddAppModal";

const formatLocation = (location: string[] | string) => {
    if (!Array.isArray(location)) return location;
    if (location.length > 1) return `${location[0]} +${location.length - 1} more`;
    return location[0] ?? 'Location not specified';
};

const OfferCard = ({ card, userPreferences }: { card: OfferCardProps, userPreferences: UserPreferences }) => {
    const {
        isFavorite,
        handleHideClick,
        handleFavoriteClick,
        handleAddClick,
        handleApplyClick,
        isConfirmationAppliedModalOpen,
        handleCancelShowConfirmationAddModal,
        isAddModalOpen,
        handleCancelShowAddModal,
        handleShowAddModal,
        handleRegisterNewApplication
    } = useOfferCardLogic({ card, userPreferences });

    const allLocations = Array.isArray(card.location) ? card.location.join(' · ') : card.location;

    return (
        <>
            <article className={s.Card}>
                <div className={s.CardTop}>
                    <CompanyLogo src={card.logoSrc} name={card.company} className="h-12 w-12 sm:h-14 sm:w-14" />

                    <div className={s.CardContent}>
                        <p className={s.CompanyText}>{card.company}</p>
                        <h3 className={s.TitleText} title={card.title}>{card.title}</h3>
                        <div className={s.MetaRow}>
                            <span className={s.LocationText} title={allLocations}>
                                <MapPin className={s.MetaIcon} aria-hidden="true" />
                                <span className="truncate">{formatLocation(card.location)}</span>
                            </span>
                            <span className={s.MetaItem}>
                                <Clock className={s.MetaIcon} aria-hidden="true" />
                                {card.publish_date}
                            </span>
                            {card.isApplied && (
                                <span className={s.AppliedBadge}>
                                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                    Applied
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        aria-pressed={isFavorite}
                        className={s.FavoriteButton}
                        onClick={handleFavoriteClick}
                    >
                        <Star className={`${s.FavoriteIcon} ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                </div>

                {card.tags.length > 0 && (
                    <ul className={s.TagsRow} aria-label="Job tags">
                        {card.tags.map((tag, idx) => (
                            <li
                                key={`${tag.type}-${tag.label}-${idx}`}
                                className={
                                    tag.type === "category"
                                        ? s.CategoryTag
                                        : tag.type === "extra_critical_requirements"
                                            ? s.CriticalTag
                                            : s.CommonTag
                                }
                            >
                                {tag.label}
                            </li>
                        ))}
                    </ul>
                )}

                <div className={s.Spacer} />

                <div className={s.CardBottom}>
                    <button
                        type="button"
                        className={s.HideButton}
                        onClick={handleHideClick}
                        aria-label="Hide this job"
                    >
                        <EyeOff className={s.ActionIcon} />
                        <span className="hidden xs:inline">Hide</span>
                    </button>
                    <div className={s.GroupedButtons}>
                        <button type="button" className={s.AddApplicationButton} onClick={handleAddClick}>
                            <Plus className={s.ActionIcon} />
                            <span>Track</span>
                        </button>
                        <button type="button" className={s.ApplyButton} onClick={handleApplyClick}>
                            Apply
                            <ExternalLink className={s.ActionIcon} />
                        </button>
                    </div>
                </div>
            </article>

            {isConfirmationAppliedModalOpen && (
                <ConfirmAppliedModal
                    onClose={handleCancelShowConfirmationAddModal}
                    onAdd={handleShowAddModal}
                />
            )}

            {isAddModalOpen && (
                <AddAppModal
                    onClose={handleCancelShowAddModal}
                    onSave={handleRegisterNewApplication}
                    companyName={card.company}
                    jobTitle={card.title}
                    companyLogo={card.logoSrc}
                />
            )}
        </>
    )
}

export default OfferCard
