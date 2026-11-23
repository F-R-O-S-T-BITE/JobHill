"use client";
// components/Modals/DeleteConfirmationModal.tsx

import { Trash2 } from "lucide-react";
import { OfferCardModalStyles } from "@/styles/OfferCardStyles";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applicationInfo: {
    companyName: string;
    role: string;
  };
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  applicationInfo,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={OfferCardModalStyles.Overlay} onClick={onClose}>
      <div className={OfferCardModalStyles.Modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 className={OfferCardModalStyles.Title}>Delete application?</h3>
        <p className={OfferCardModalStyles.Subtitle}>
          Your application for <strong className="text-slate-900">{applicationInfo.role}</strong> at{' '}
          <strong className="text-slate-900">{applicationInfo.companyName}</strong> will be permanently removed.
        </p>
        <div className={OfferCardModalStyles.ButtonRow}>
          <button onClick={onClose} className={OfferCardModalStyles.CancelButton}>
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn-danger w-full py-3 sm:w-auto sm:px-6">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
