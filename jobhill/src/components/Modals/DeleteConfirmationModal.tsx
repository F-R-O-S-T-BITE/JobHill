"use client";

import { CompanyCardStyles } from "@/styles/OfferCardStyles";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-center z-50">
      <div className={CompanyCardStyles.Modal}>
        <h3 className={CompanyCardStyles.ModalTitle}>
          Delete Application
        </h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete your application for <br />
          <strong>{applicationInfo.role}</strong> at <strong>{applicationInfo.companyName}</strong>?
          <br />
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2  bg-[#0353A4] text-white rounded-md hover:bg-[#004181] transition-colors cursor-pointer"
          >
            Delete Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
