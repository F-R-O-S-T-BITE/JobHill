"use client";
//auth/forgot-password/page.tsx

import React, { useState} from "react";
import Link from "next/link";
import '../../globals.css';
import { LoginStyles } from '@/styles/LoginStyles';
import { useLoginRegister } from '@/hooks/useLoginRegister';

export default function ForgotPassword() {

    const [emailSent, setEmailSent] = useState(false);
      const {
        isMounted,
        isLoading,
        errorMessage,
        formData,
        handleChange,
        handleForgotPassword
    } = useLoginRegister("forgot-password");

    const onSubmit = async (e: React.FormEvent) => {
        try {
            await handleForgotPassword(e);
            setEmailSent(true);
        } catch (error) {
           
        }
    };

    if (!isMounted) return null;


    if (emailSent) {
        return (
            <div className={LoginStyles.container}>
                <div
                    className={LoginStyles.leftPanel}
                    style={{
                        backgroundImage: "url('/resources/ants/Login_background.png')",
                        transform: "translateZ(0)",
                    }}
                />
                <div className={LoginStyles.rightPanel}>
                    <div className={LoginStyles.box}>
                        <h1 className={LoginStyles.title}>JOBHILL</h1>
                        <p className={LoginStyles.subtitle}>Check your email!</p>
                        <p className={LoginStyles.text}>
                            We've sent a password reset link to <strong>{formData.email}</strong>
                        </p>
                        
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-6">
                            Click the link in your email to reset your password. The link will expire in 10 minutes.
                        </div>

                        <div className="text-center space-y-4">
                            <p className="text-sm text-gray-600">
                                Didn't receive the email? Check your spam folder or{" "}
                                <button 
                                    onClick={() => setEmailSent(false)}
                                    className="text-[#0353A4] hover:underline"
                                >
                                    try again
                                </button>
                            </p>
                            
                            <Link 
                                href="/login" 
                                className="text-[#0353A4] font-medium hover:underline"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={LoginStyles.container}>
            <div
                className={LoginStyles.leftPanel}
                style={{
                    backgroundImage: "url('/resources/ants/Login_background.png')",
                    transform: "translateZ(0)",
                }}
            />
            <div className={LoginStyles.rightPanel}>
                <div className={LoginStyles.box}>
                    <h1 className={LoginStyles.title}>JOBHILL</h1>
                    <p className={LoginStyles.subtitle}>Forgot Password?</p>
                    <p className={LoginStyles.text}>
                        Enter your email address and we'll send you a link to reset your password
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4 text-left">
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                                {errorMessage}
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                name="email"
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={LoginStyles.input}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={LoginStyles.button}
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-[14px] font-poppins text-black">
                        Remember your password?{" "}
                        <Link href="/login" className="text-[#0353A4] font-medium hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}