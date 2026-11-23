"use client";
//login/page.tsx
// Next Libraries
import Link from "next/link";
import { useRouter } from "next/navigation";
//Styles and Components
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { LoginStyles } from '@/styles/LoginStyles';
import CaptchaModal from "@/components/Modals/CaptchaModal";
//Hooks and Actions
import { useLoginRegister } from '@/hooks/useLoginRegister';
import { AntTrailScene } from "@/components/mascots";



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
            <div className={LoginStyles.leftPanel}>
                <AntTrailScene palette="dusk" className="absolute inset-0 h-full w-full" />
            </div>
            <div className={LoginStyles.rightPanel}>
                <div className={LoginStyles.box}>
                              <Link href="/" >
            <h1 className={LoginStyles.title}>JOBHILL</h1>
          </Link>
                    
                    <p className={LoginStyles.subtitle}>Welcome back!</p>
                    <p className={LoginStyles.text}>Enter your Credentials to access your account</p>

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                                {errorMessage}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
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
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-sm text-brand-600 hover:underline cursor-pointer">
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
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
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
                                className="h-4 w-4 rounded accent-brand-600 cursor-pointer"
                            />
                            <label htmlFor="rememberCheckbox" className="ml-2 text-sm text-slate-600">
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

                    <div className="my-6 text-center text-sm text-slate-600 flex items-center justify-between">
                        <div className="w-1/3 h-px bg-slate-300"></div>
                        <span className="px-2">or</span>
                        <div className="w-1/3 h-px bg-slate-300"></div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="btn-secondary w-full py-3 mb-3"
                    >
                        <FaGoogle className="text-red-500 mr-2" />
                        Sign in with Google
                    </button>

                    <button
                        onClick={handleGithubSignIn}
                        disabled={isLoading}
                        className="btn-secondary w-full py-3"
                    >
                        <FaGithub className="mr-2" />
                        Sign in with Github
                    </button>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-brand-600 font-medium hover:underline">
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