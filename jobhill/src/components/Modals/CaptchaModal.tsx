//src/components/CaptchaModal.tsx
"use client";

import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { CaptchaModalProps } from "@/interfaces/Captcha";

export default function CaptchaModal({ 
    isOpen, 
    onClose, 
    onVerify, 
    title, 
    description,
    isLoading = false 
}: CaptchaModalProps) {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCaptchaVerify = (token: string) => {
        setCaptchaToken(token);
        onVerify(token);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-pop animate-slide-up">

                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                >
                    ×
                </button>

                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-600">
                        {description}
                    </p>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="captcha-container">
                        <HCaptcha
                            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
                            onVerify={handleCaptchaVerify}
                     
                            theme="light"
                        />
                    </div>
                </div>

                {isLoading && (
                    <div className="text-center">
                        <div className="inline-flex items-center text-sm text-slate-600">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}