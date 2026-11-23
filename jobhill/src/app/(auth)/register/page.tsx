"use client";

//React and Next Libraries
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
//Styles and Components
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { RegisterStyles } from "@/styles/RegisterStyles";
import CaptchaModal from "@/components/Modals/CaptchaModal";
//Hooks and Actions
import { useLoginRegister } from "@/hooks/useLoginRegister";
import { AntTrailScene } from "@/components/mascots";


export default function Register() {
    const [emailSent, setEmailSent] = useState(false);

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
        passwordValidation, 
        showCaptchaModal,
        handleCaptchaVerify,
        handleCloseCaptchaModal
    } = useLoginRegister("register");
    
    if (!isMounted) {
        return null;
    }

    const onSubmit = async (e: React.FormEvent) => {
        try {
            await handleSubmit(e);
        } catch (error) {
        }
    };

    if (emailSent) {
    return (
        <div className={RegisterStyles.container}>
            <div className={RegisterStyles.leftPanel}>
                <div className={RegisterStyles.box}>
                    
                    <h1 className={RegisterStyles.title}>JOBHILL</h1>
                    <p className="text-[18px] font-medium font-poppins text-slate-900 mb-2">Check your email!</p>
                    <p className={RegisterStyles.text}>
                        We've sent a verification link to <strong>{formData.email}</strong>
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-6">
                        Click the link in your email to verify your account and complete the registration.
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-sm text-slate-600">
                            Didn't receive the email? Check your spam folder or{" "}
                            <button 
                                onClick={() => setEmailSent(false)}
                                className="text-brand-600 hover:underline"
                            >
                                try again
                            </button>
                        </p>
                        
                        <Link 
                            href="/login" 
                            className="text-brand-600 font-medium hover:underline"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>

            <div className={RegisterStyles.rightPanel}>
                <AntTrailScene palette="night" className="absolute inset-0 h-full w-full" />
            </div>
        </div>
    );
}

    return (
        <div className={RegisterStyles.container}>
            <div className={RegisterStyles.leftPanel}>
                <div className={RegisterStyles.box}>
                        <Link href="/" >
                        
                    <h1 className={RegisterStyles.title}>JOBHILL</h1>
                    </Link>
                    <p className={RegisterStyles.text}>
                        Create an account to keep track of your applications
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4 text-left">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                Full Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                id="name"
                                autoComplete="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={RegisterStyles.input}
                            />
                        </div>
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
                                className={RegisterStyles.input}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete="new-password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={`${RegisterStyles.input} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
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
                                    className="h-4 w-4 rounded accent-brand-600 cursor-pointer"
                                />
                                <label htmlFor="termsCheckbox" className="ml-2 text-[12px] font-poppins text-slate-900">
                                    I agree to the <span className="text-brand-600 hover:underline cursor-pointer">terms & policy</span>
                                </label>
                            </div>
                            {errorMessage && (
                                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !Object.values(passwordValidation).every(Boolean)}
                            className={RegisterStyles.button}
                        >
                            {isLoading ? 'Creating account...' : 'Signup'}
                        </button>
                    </form>

                    <div className="my-5 text-center text-sm text-slate-600">or</div>

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
                        Have an account?{" "}
                        <Link href="/login" className="text-brand-600 font-medium hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            <div className={RegisterStyles.rightPanel}>
                <AntTrailScene palette="night" className="absolute inset-0 h-full w-full" />
            </div>

            <CaptchaModal
                isOpen={showCaptchaModal}
                onClose={handleCloseCaptchaModal}
                onVerify={async (token) => {
                    try {
                        await handleCaptchaVerify(token);
                        setEmailSent(true);
                    } catch (error) {
                    }
                }}
                title="Verify you're human"
                description="Complete the verification to create your account"
                isLoading={isLoading}
            />
        </div>
    );
}