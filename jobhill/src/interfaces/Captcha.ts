export interface CaptchaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (token: string) => void;
    title: string;
    description: string;
    isLoading?: boolean;
}