"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCreateApplication } from "@/hooks/useApplications";
import { ApplicationStatus, APPLICATION_STATUSES } from "@/interfaces/Application";
import { AddAppModalStyles } from "@/styles/OfferCardStyles";
import { SimpleDropdown } from "@/components/InputFilter";
import { X } from 'lucide-react';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    company_name: "",
    role: "",
    location: "",
    dateApplied: today,
    referral_type: "Cold Apply" as "Cold Apply" | "Employee Ref" | "Referred",
    status: "Applied" as ApplicationStatus,
    application_link: "",
  });

  const createApplicationMutation = useCreateApplication();

  const statusOptions = [...APPLICATION_STATUSES];
  const referralOptions = ['Cold Apply', 'Employee Ref', 'Referred'];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Aplicación manual: no se manda job_offer_id porque no viene de una oferta de Jobhill
      await createApplicationMutation.mutateAsync({
        company_name: formData.company_name,
        role: formData.role,
        location: formData.location,
        referral_type: formData.referral_type,
        status: formData.status,
        applied_date: formData.dateApplied,
        application_link: formData.application_link,
        company_logo: undefined,
      });

      setFormData({
        company_name: "",
        role: "",
        location: "",
        dateApplied: today,
        referral_type: "Cold Apply",
        status: "Applied",
        application_link: "",
      });

      toast.success("Application added");
      onClose();
    } catch (error) {
      console.error("Error creating application:", error);
      toast.error(error instanceof Error ? error.message : "Couldn't add the application. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
<div className={AddAppModalStyles.Overlay}>
      <div className={AddAppModalStyles.Modal}>
        <div className={AddAppModalStyles.Header}>
          <h2 className={AddAppModalStyles.Title}>Add New Application</h2>
          <button
            onClick={onClose}
            className={AddAppModalStyles.CloseButton}
            aria-label="Close modal"
          >
<X className={AddAppModalStyles.CloseIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className={AddAppModalStyles.FormSection}>
            {/* Company Name */}
            <div className={AddAppModalStyles.FormRow}>
              <div className={AddAppModalStyles.FormGroup}>
                <h3 className={AddAppModalStyles.FormLabel}>Company Name</h3>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  required
                  className={AddAppModalStyles.FormInput}
                />
              </div>
            </div>

            {/* Role */}
            <div className={AddAppModalStyles.FormRow}>
              <div className={AddAppModalStyles.FormGroup}>
                <h3 className={AddAppModalStyles.FormLabel}>Role</h3>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  required
                  className={AddAppModalStyles.FormInput}
                />
              </div>
            </div>

            {/* Location */}
            <div className={AddAppModalStyles.FormRow}>
              <div className={AddAppModalStyles.FormGroup}>
                <h3 className={AddAppModalStyles.FormLabel}>Location</h3>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  className={AddAppModalStyles.FormInput}
                />
              </div>
            </div>

            {/* Date Applied */}
            <div className={AddAppModalStyles.FormRow}>
              <div className={AddAppModalStyles.FormGroup}>
                <h3 className={AddAppModalStyles.FormLabel}>Date Applied</h3>
                <input
                  type="date"
                  value={formData.dateApplied}
                  onChange={(e) => handleInputChange('dateApplied', e.target.value)}
                  className={AddAppModalStyles.FormInput}
                />
              </div>
            </div>

            {/* Status */}
            <div className={AddAppModalStyles.FormRow}>
              <div className={AddAppModalStyles.FormGroup}>
                <h3 className={AddAppModalStyles.FormLabel}>Status</h3>
                <SimpleDropdown
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  options={statusOptions}
                  placeholder="Select Status"
                />
              </div>
            </div>

            {/* Referral Type */}
            <div className={AddAppModalStyles.FormRow}>
              <div className={AddAppModalStyles.FormGroup}>
                <h3 className={AddAppModalStyles.FormLabel}>Referral</h3>
                <SimpleDropdown
                  value={formData.referral_type}
                  onChange={(value) => handleInputChange('referral_type', value as 'Cold Apply' | 'Employee Ref' | 'Referred')}
                  options={referralOptions}
                  placeholder="Select Referral Type"
                />
              </div>
            </div>

            {/* Application Link */}
            <div className={AddAppModalStyles.FormRow}>
              <div className={AddAppModalStyles.FormGroup}>
                <h3 className={AddAppModalStyles.FormLabel}>Application Link</h3>
                <input
                  type="url"
                  value={formData.application_link}
                  onChange={(e) => handleInputChange('application_link', e.target.value)}
                  placeholder="https://..."
                  className={AddAppModalStyles.FormInput}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={AddAppModalStyles.ButtonRow}>
            <button
              type="button"
              onClick={onClose}
              className={AddAppModalStyles.CancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createApplicationMutation.isPending}
              className={AddAppModalStyles.SaveButton}
            >
              {createApplicationMutation.isPending ? "Adding..." : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplicationModal;