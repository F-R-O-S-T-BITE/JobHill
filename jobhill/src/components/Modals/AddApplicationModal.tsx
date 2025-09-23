"use client";

import { useState } from "react";
import { useCreateApplication } from "@/hooks/useApplications";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    job_offer_id: "",
    company_name: "",
    role: "",
    location: "",
    referral_type: "Cold Apply" as "Cold Apply" | "Employee Ref" | "Referred",
    application_link: "",
  });

  const createApplicationMutation = useCreateApplication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createApplicationMutation.mutateAsync({
        job_offer_id: crypto.randomUUID(),
        company_name: formData.company_name,
        role: formData.role,
        location: formData.location,
        referral_type: formData.referral_type,
        application_link: formData.application_link,
        company_logo: undefined,
      });
      
      setFormData({
        job_offer_id: "",
        company_name: "",
        role: "",
        location: "",
        referral_type: "Cold Apply",
        application_link: "",
      });
      
      onClose();
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Application</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="referral_type" className="block text-sm font-medium text-gray-700 mb-1">
              Referral Type *
            </label>
            <select
              id="referral_type"
              name="referral_type"
              value={formData.referral_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cold Apply">Cold Apply</option>
              <option value="Employee Ref">Employee Ref</option>
              <option value="Referred">Referred</option>
            </select>
          </div>

          <div>
            <label htmlFor="application_link" className="block text-sm font-medium text-gray-700 mb-1">
              Application Link
            </label>
            <input
              type="url"
              id="application_link"
              name="application_link"
              value={formData.application_link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createApplicationMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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