//src/hooks/useLoginRegister.ts
"use-client"
import { useState, useCallback, useEffect } from "react";
import { loginPE, signup, signInWithGoogle, signInWithGithub, resetPasswordForEmail, updatePassword } from "@/app/(auth)/login/actions";

export function useLoginRegister(type: "login" | "register" | "forgot-password" | "reset-password") {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState<any>({
        name: "",
        email: "",
        password: "",
        rememberMe: false,
        termsAccepted: false,
    });

    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        digit: false,
        symbol: false
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev: typeof formData) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (type === "checkbox" && name === "termsAccepted" && checked) {
            setErrorMessage("");
        }

        if (name === "password") {
            setPasswordValidation({
                length: value.length >= 8,
                lowercase: /[a-z]/.test(value),
                uppercase: /[A-Z]/.test(value),
                digit: /\d/.test(value),
                symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value),
            });
        }

        if (errorMessage) {
            setErrorMessage("");
        }
    }, [errorMessage]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        const form = new FormData();
        if (type === "register") {
            if (!formData.termsAccepted) {
                setErrorMessage("You must accept the terms to continue.");
                setIsLoading(false);
                return;
            }

            form.append("name", formData.name);
        }

        form.append("email", formData.email);
        form.append("password", formData.password);

        try {
            if (type === "login") await loginPE(form);
            if (type === "register") await signup(form);
        } catch (error) {
            setErrorMessage(type === "login"
                ? "Invalid email or password. Please try again."
                : "An error occurred. Please try again.");
            console.error(type + " error:", error);
            setIsLoading(false);
        }
    }, [formData, type]);

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

    const handleForgotPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const form = new FormData();
    form.append("email", formData.email);

    try {
        await resetPasswordForEmail(form);
        return { success: true };
    } catch (error: any) {
        setErrorMessage(error.message || "Error sending reset email. Please try again.");
        setIsLoading(false);
        throw error;
    }
}, [formData.email]);

const handleResetPassword = useCallback(async (e: React.FormEvent, confirmPassword: string) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (formData.password !== confirmPassword) {
        setErrorMessage("Passwords don't match");
        setIsLoading(false);
        return;
    }

    if (!Object.values(passwordValidation).every(Boolean)) {
        setErrorMessage("Password doesn't meet all requirements");
        setIsLoading(false);
        return;
    }

    const form = new FormData();
    form.append("password", formData.password);

    try {
        await updatePassword(form);
    } catch (error: any) {
        setErrorMessage(error.message || "Error updating password. Please try again.");
        setIsLoading(false);
    }
}, [formData.password, passwordValidation]);



    return {
        isMounted,
        isLoading,
        showPassword,
        setShowPassword,
        errorMessage,
        formData,
        setFormData,
        passwordValidation,
        handleChange,
        handleSubmit,
        handleGoogleSignIn,
        handleGithubSignIn,  
        handleForgotPassword,
        handleResetPassword,
    };
}
