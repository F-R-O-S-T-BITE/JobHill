'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    router.push('/login');
    onClose();
  };

  const handleRegister = () => {
    router.push('/register');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 p-8 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Log in to continue
        </h2>
        
        <p className="text-gray-600 mb-6">
          You need to be logged in to access this feature. Please log in or create an account to continue.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-[#0353A4] text-white py-3 rounded hover:bg-[#03459E] transition-colors font-semibold"
          >
            Login
          </button>
          
          <button
            onClick={handleRegister}
            className="w-full border-2 border-[#0353A4] text-[#0353A4] py-3 rounded hover:bg-[#0353A4] hover:text-white transition-colors font-semibold"
          >
            Create Account
          </button>
        </div>
      </div>
    </>
  );
}