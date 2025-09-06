import { OfferCardModalStyles } from "@/styles/OfferCardStyles"

export default function ConfirmAppliedModal({onClose, onAdd}:{onClose:()=>void, onAdd:()=>void}) {
  return (
    <div className={OfferCardModalStyles.Overlay}>
        <div className={OfferCardModalStyles.Modal}>
            <h2 className={OfferCardModalStyles.Title}>Did you apply to the job?</h2>
            <p className={OfferCardModalStyles.Subtitle}>
                Add it to your applications!
            </p>
            <div className={OfferCardModalStyles.ButtonRow}>
                <button className={OfferCardModalStyles.ConfirmButton} onClick={() => {onAdd()}}>
                    Add
                </button>
                <button className={OfferCardModalStyles.CancelButton} onClick={() => {onClose()}}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
  )
}