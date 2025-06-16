//app/register/page
"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import '../globals.css';
import {login, signup, signInWithGoogle, signInWithGithub} from '../login/actions'

export default function Register() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        digit: false,
        symbol: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        termsAccepted: false,
    });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        
        if (name === 'termsAccepted' && checked) {
            setTermsError(false);
        }
        
        if (name === 'password') {
            const validation = {
                length: value.length >= 8,
                lowercase: /[a-z]/.test(value),
                uppercase: /[A-Z]/.test(value),
                digit: /\d/.test(value),
                symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value)
            };
            
            setPasswordValidation(validation);
        }
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.termsAccepted) {
            setTermsError(true);
            return;
        }
        
        if (formData.password.length < 8 || 
            !/[a-z]/.test(formData.password) ||
            !/[A-Z]/.test(formData.password) ||
            !/\d/.test(formData.password) ||
            !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(formData.password)) {
            return;
        }

        setIsLoading(true);
        
        const form = new FormData();
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('name', formData.name);
        
        try {
            await signup(form);
        } catch (error) {
            console.error('Signup error:', error);
            setIsLoading(false);
        }
    }, [formData]);

    const handleGoogleSignIn = useCallback(async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Google Sign-in error:", error);
            setIsLoading(false);
        }
    }, []);
    
    const handleGithubSignIn = useCallback(async () => {
        setIsLoading(true);
        try {
            await signInWithGithub();
        } catch (error) {
            console.error("Github Sign-in error:", error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-white overflow-hidden">
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white h-screen overflow-auto">
                <div className="max-w-md w-full p-4 text-center">
                    <h1 className="text-[50px] md:text-[60px] font-black font-inter text-[#0353A4] leading-tight">JOBHILL</h1>
                    <p className="text-[14px] font-medium font-poppins text-black mb-6">
                        Create an account to keep track of your applications
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                id="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 px-3 py-2 rounded font-poppins text-black"
                            />
                        </div>
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
                                className="w-full border border-gray-300 px-3 py-2 rounded font-poppins text-black"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 px-3 py-2 pr-10 rounded font-poppins text-black"
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
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <input
                                    name="termsAccepted"
                                    type="checkbox"
                                    id="termsCheckbox"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-[#0353A4] border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="termsCheckbox" className="ml-2 text-[12px] font-poppins text-black">
                                    I agree to the <span className="text-[#0353A4] hover:underline cursor-pointer">terms & policy</span>
                                </label>
                            </div>
                            {termsError && (
                                <p className="text-red-500 text-xs mt-1">You must accept the terms to continue</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !Object.values(passwordValidation).every(Boolean)}
                            className="w-full bg-[#0353A4] text-white py-2 rounded font-poppins font-medium cursor-pointer hover:bg-[#034383] transition-colors disabled:bg-opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating account...' : 'Signup'}
                        </button>
                    </form>
                    <div className="my-5 text-center text-[14px] font-poppins text-black">or</div>
                    <button 
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded font-poppins mb-3 text-black hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-70">
                        <FaGoogle className="text-red-500 mr-2" />
                        Sign in with Google
                    </button>
                    <button 
                        onClick={handleGithubSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded font-poppins text-black hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-70">
                        <FaGithub className="mr-2" />
                        Sign in with Github
                    </button>
                    <div className="mt-6 text-center text-[14px] font-poppins text-black">
                        Have an account?{" "}
                        <Link href="/login" className="text-[#0353A4] font-medium hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
            
            <div 
                className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat h-screen" 
                style={{
                    backgroundImage: "url('/resources/Register_background.png')",
                    transform: "translateZ(0)"
                }}
            />
        </div>
    );
}