"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import '../globals.css';
import {login, signup, signInWithGoogle, signInWithGithub} from '../login/actions'

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        termsAccepted: false,
    });
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);

        if (formData.email && formData.password) {
            router.push('/dashboard');
        } else {
            console.error("Invalid form data");
        }
    };

     const handleGoogleSignIn = async () => {
            setIsLoading(true);
            try {
                await signInWithGoogle();
            } catch (error) {
                console.error("Google Sign-in error:", error);
                setIsLoading(false);
            }
        };
    
        const handleGithubSignIn = async () =>{
            setIsLoading(true);
            try {
                await signInWithGithub();
            } catch (error){
                console.error("Github Sign-in error:", error)
                setIsLoading(false)
            }
        }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const FormSection = () => (
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white h-screen overflow-auto">
            <div className="max-w-md w-full p-4 text-center">
                <h1 className="text-[50px] md:text-[60px] font-black font-inter text-[#0353A4] leading-tight">JOBHILL</h1>
                <p className="text-[14px] font-medium font-poppins text-black mb-6">
                    Create an account to keep track of your applications
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            name="name"
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-3 py-2 rounded font-poppins text-black"
                        />
                    </div>
                    <div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-3 py-2 rounded font-poppins text-black"
                        />
                    </div>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 px-3 py-2 rounded font-poppins text-black"
                        />
                    </div>
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
                    <button
                        type="submit"
                        className="w-full bg-[#0353A4] text-white py-2 rounded font-poppins font-medium cursor-pointer hover:bg-[#034383] transition-colors"
                    >
                        Signup
                    </button>
                </form>
                <div className="my-6 text-center text-[14px] font-poppins text-black">or</div>
                <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center border border-gray-300 py-2 rounded font-poppins mb-3 text-black hover:bg-gray-100 transition-colors cursor-pointer">
                    <FaGoogle className="text-red-500 mr-2" />
                    Sign in with Google
                </button>
                <button 
                onClick={handleGithubSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center border border-gray-300 py-2 rounded font-poppins text-black hover:bg-gray-100 transition-colors cursor-pointer">
                    <FaGithub className="text-red-500 mr-2" />
                    Sign in with Github
                </button>
                <div className="mt-6 text-center text-[14px] font-poppins text-black">
                    Have an account?{" "}
                    <Link href="/login" className="text-[#0353A4] font-medium">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-white overflow-hidden">
            <FormSection />
            
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