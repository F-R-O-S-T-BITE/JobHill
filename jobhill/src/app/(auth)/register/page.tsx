"use client";

//React and Next Libraries
import Link from "next/link";
import { useRouter } from "next/navigation";
//Styles
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { RegisterStyles } from "@/styles/RegisterStyles";
import '../../globals.css';
//Hooks and Actions
import { useLoginRegister } from "@/hooks/useLoginRegister";


export default function Register() {
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
        passwordValidation
    } = useLoginRegister("register");
    
    if (!isMounted) {
        return null;
    }

    return (
        <div className={RegisterStyles.container}>
            <div className={RegisterStyles.leftPanel}>
                <div className={RegisterStyles.box}>
                    <h1 className={RegisterStyles.title}>JOBHILL</h1>
                    <p className={RegisterStyles.text}>
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
                                className={RegisterStyles.input}
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
                                className={RegisterStyles.input}
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
                                    className={`${RegisterStyles.input} pr-10`}
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

                    <div className="my-5 text-center text-[14px] font-poppins text-black">or</div>

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
                        Have an account?{" "}
                        <Link href="/login" className="text-[#0353A4] font-medium hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            <div
                className={RegisterStyles.rightPanel}
                style={{
                    backgroundImage: "url('/resources/ants/Register_background.png')",
                    transform: "translateZ(0)",
                }}
            />
        </div>
    );
}