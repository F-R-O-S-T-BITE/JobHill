"use client";
//auth/reset-password/page.tsx
import React, { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../../globals.css';
import { LoginStyles } from '@/styles/LoginStyles';
import { useLoginRegister } from '@/hooks/useLoginRegister';

export default function ResetPassword() {
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const {
        isMounted,
        isLoading,
        showPassword,
        setShowPassword,
        errorMessage,
        formData,
        passwordValidation,
        handleChange,
        handleResetPassword
    } = useLoginRegister("reset-password");

    const onSubmit = async (e: React.FormEvent) => {
        await handleResetPassword(e, confirmPassword);
    };

    if (!isMounted) {
        return null;
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

                            <Link href="/">
                                  <h1 className={LoginStyles.title}>JOBHILL</h1>
                    </Link>
          
                    <p className={LoginStyles.subtitle}>Reset Password</p>
                    <p className={LoginStyles.text}>Enter your new password</p>

                    <form onSubmit={onSubmit} className="space-y-4 text-left">
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                                {errorMessage}
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete="new-password"
                                    placeholder="Create a new password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={`${LoginStyles.input} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>

                            {formData.password.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs ${passwordValidation.length ? 'text-green-600' : 'text-red-500'}`}>
                                            {passwordValidation.length ? '✓' : '○'} At least 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                                            {passwordValidation.lowercase ? '✓' : '○'} Lowercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                                            {passwordValidation.uppercase ? '✓' : '○'} Uppercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs ${passwordValidation.digit ? 'text-green-600' : 'text-red-500'}`}>
                                            {passwordValidation.digit ? '✓' : '○'} Digit
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs ${passwordValidation.symbol ? 'text-green-600' : 'text-red-500'}`}>
                                            {passwordValidation.symbol ? '✓' : '○'} Symbol (!@#$%^&*...)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className={`${LoginStyles.input} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            {confirmPassword && formData.password !== confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !Object.values(passwordValidation).every(Boolean) || formData.password !== confirmPassword}
                            className={LoginStyles.button}
                        >
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-[14px] font-poppins text-black">
                        <Link href="/login" className="text-[#0353A4] font-medium hover:underline">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}