"use client";
//login/page.tsx
import {loginPE, signInWithGoogle, signInWithGithub} from './actions'
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import '../globals.css';

export default function Login() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        
        // Limpiar mensaje de error cuando el usuario empiece a escribir
        if (errorMessage) {
            setErrorMessage("");
        }
    }, [errorMessage]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(""); 

        const form = new FormData();
        form.append('email', formData.email);
        form.append('password', formData.password);

        try {
            await loginPE(form);
        } catch (error){
            console.error("Login Error:", error)
            setErrorMessage("Invalid email or password. Please try again.");
            setIsLoading(false)
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
        } catch (error){
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
            <div 
                className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat h-screen" 
                style={{
                    backgroundImage: "url('/resources/Login_background.png')",
                    transform: "translateZ(0)"
                }}
            />
            
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white h-screen overflow-auto">
                <div className="max-w-md w-full p-4 text-center">
                    <h1 className="text-[50px] md:text-[60px] font-black font-inter text-[#0353A4] leading-tight">JOBHILL</h1>
                    <p className="text-[18px] font-medium font-poppins text-black mb-2">
                        Welcome back!
                    </p>
                    <p className="text-[14px] font-medium font-poppins text-black mb-6">
                        Enter your Credentials to access your account
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
                                className="w-full border border-gray-300 px-3 py-2 rounded font-poppins text-black"
                            />
                        </div>
                        <div className="relative">
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-[#0353A4] hover:underline cursor-pointer">
                                    forgot password
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
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
                        </div>
                        <div className="flex items-center">
                            <input
                                name="rememberMe"
                                type="checkbox"
                                id="rememberCheckbox"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-[#0353A4] border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="rememberCheckbox" className="ml-2 text-[14px] font-poppins text-black">
                                Remember for 30 days
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0353A4] text-white py-2 rounded font-poppins font-medium cursor-pointer hover:bg-[#034383] transition-colors disabled:bg-opacity-70"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="my-6 text-center text-[14px] font-poppins text-black flex items-center justify-between">
                        <div className="w-1/3 h-px bg-gray-300"></div>
                        <span className="px-2">or</span>
                        <div className="w-1/3 h-px bg-gray-300"></div>
                    </div>
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
                        Don't have an account?{" "}
                        <Link href="/register" className="text-[#0353A4] font-medium hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}