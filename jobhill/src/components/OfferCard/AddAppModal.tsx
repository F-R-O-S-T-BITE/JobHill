import { useState } from "react";
import { AddAppModalStyles } from "@/styles/OfferCardStyles";

interface AddAppModalProps {
    onClose: () => void;
    onSave: (applicationData: ApplicationData) => void;
    companyLogo: string;
    companyName: string;
    jobTitle: string;
}

interface ApplicationData {
    dateApplied: string;
    referralType: 'Cold Apply' | 'Referred';
    status: string;
}

export default function AddAppModal({ 
    onClose, 
    onSave, 
    companyLogo, 
    companyName, 
    jobTitle 
}: AddAppModalProps) {
    const today = new Date().toISOString().split('T')[0];
    
    const [formData, setFormData] = useState<ApplicationData>({
        dateApplied: today,
        referralType: 'Cold Apply',
        status: 'Applied'
    });

    const statusOptions = [
        'Applied', 'OA', 'Behavioral', 'Technical 1', 'Technical 2', 
        'Technical 3', 'Technical 4', 'Offer', 'Declined', 'Rejected', 'Ghosted'
    ];

    const referralOptions = ['Cold Apply', 'Referred'];

    const handleInputChange = (field: keyof ApplicationData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

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
                        <img 
                            src="/resources/Icons/Components_Cards/quit_component_cards.png" 
                            alt="Close" 
                            className={AddAppModalStyles.CloseIcon} 
                        />
                    </button>
                </div>
                <div className={AddAppModalStyles.FormSection}>
                   {/* Company Information */}
                    <div className={AddAppModalStyles.FormRow}>

                        <div className={AddAppModalStyles.CompanyRow}>
                            <div className="w-12 h-12 flex-shrink-0">
                                <img 
                                    src={companyLogo} 
                                    alt={`${companyName} logo`} 
                                    className={AddAppModalStyles.CompanyLogo} 
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <div className={`w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 ${companyLogo ? 'hidden' : ''}`}>
                                    {companyName.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className={AddAppModalStyles.CompanyInfo}>
                                <div className={AddAppModalStyles.CompanyName}>{companyName}</div>
                                <div className={AddAppModalStyles.JobTitle}>{jobTitle}</div>
                            </div>
                        </div>
                    </div>

                    {/* Date Applied Section */}
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

                    {/* Status Section */}
                    <div className={AddAppModalStyles.FormRow}>

                        <div className={AddAppModalStyles.FormGroup}>
                            <h3 className={AddAppModalStyles.FormLabel}>Status</h3>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className={AddAppModalStyles.FormSelect}
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* Referral Type Section */}
                    <div className={AddAppModalStyles.FormRow}>

                        <div className={AddAppModalStyles.FormGroup}>
                            <h3 className={AddAppModalStyles.FormLabel}>Referral</h3>
                            <select
                                value={formData.referralType}
                                onChange={(e) => handleInputChange('referralType', e.target.value as 'Cold Apply' | 'Referred')}
                                className={AddAppModalStyles.FormSelect}
                            >
                                {referralOptions.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={AddAppModalStyles.ButtonRow}>
                    <button 
                        onClick={onClose}
                        className={AddAppModalStyles.CancelButton}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className={AddAppModalStyles.SaveButton}
                    >
                        Add Application
                    </button>
                </div>
            </div>
        </div>
    );
}