"use client";
//login/page.tsx
// Next Libraries
import Link from "next/link";
import { useRouter } from "next/navigation";
//Styles and Components
import '../../globals.css';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { LoginStyles } from '@/styles/LoginStyles';
import CaptchaModal from "@/components/CaptchaModal";
//Hooks and Actions
import { useLoginRegister } from '@/hooks/useLoginRegister';



export default function Login() {
    const router = useRouter();
    const {
        isMounted,
        isLoading,
        showPassword,
        setShowPassword,
        errorMessage,
        formData,
        handleChange,
        handleSubmit,
        handleGoogleSignIn,
        handleGithubSignIn,
        showCaptchaModal,
        handleCaptchaVerify,
        handleCloseCaptchaModal
    } = useLoginRegister("login");

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
                    <h1 className={LoginStyles.title}>JOBHILL</h1>
                    <p className={LoginStyles.subtitle}>Welcome back!</p>
                    <p className={LoginStyles.text}>Enter your Credentials to access your account</p>

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
                                autoComplete="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={LoginStyles.input}
                            />
                        </div>
                        <div className="relative">
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-sm text-[#0353A4] hover:underline cursor-pointer">
                                    forgot password
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
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
                            className={LoginStyles.button}
                        >
                            {isLoading ? "Logging in..." : "Login"}
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
                        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded font-poppins mb-3 text-black hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-70"
                    >
                        <FaGoogle className="text-red-500 mr-2" />
                        Sign in with Google
                    </button>

                    <button
                        onClick={handleGithubSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded font-poppins text-black hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-70"
                    >
                        <FaGithub className="mr-2" />
                        Sign in with Github
                    </button>

                    <div className="mt-6 text-center text-[14px] font-poppins text-black">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-[#0353A4] font-medium hover:underline">
                            Sign Up
                        </Link>
                    </div>

                    <CaptchaModal
                        isOpen={showCaptchaModal}
                        onClose={handleCloseCaptchaModal}
                        onVerify={async (token) => {
                            try {
                                await handleCaptchaVerify(token);
                            } catch (error) {
                            }
                        }}
                        title="Verify you're human"
                        description="Complete the verification to sign in"
                        isLoading={isLoading}
                    />


                </div>
            </div>
        </div>
    );
}