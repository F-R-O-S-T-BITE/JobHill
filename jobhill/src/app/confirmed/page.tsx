"use client"
//app/auth/confirmed/page
import Link from "next/link";
import { useState, useEffect } from "react";
import { AntWaving } from "@/components/mascots";

export default function AccountConfirmed() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-brand-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          
          <div className={`flex-1 max-w-lg text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-6">
              <span className="text-4xl sm:text-5xl lg:text-6xl animate-bounce inline-block">🎉</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-inter text-brand-600 mb-6 leading-tight">
              Account<br />
              <span className="text-slate-900">Confirmed!</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 mb-8 font-poppins leading-relaxed">
              Your email has been verified successfully! You can now start exploring 
              <span className="text-brand-600 font-semibold"> hundreds of internship opportunities</span> and 
              track your applications.
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/home" 
                className="bg-brand-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-brand-700 transition-all duration-300 font-semibold font-poppins text-base sm:text-lg inline-block transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto text-center"
              >
                🚀 Get Started
              </Link>
              
              <p className="text-sm text-slate-500 font-poppins">
                Ready to find your dream internship?
              </p>
            </div>
          </div>

          {/* Imagen/Badge */}
          <div className={`flex-1 max-w-md w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">
              {/* Elementos decorativos de background */}
              <div className="absolute -top-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-brand-600 opacity-10 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 bg-brand-600 opacity-20 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-12 -right-4 w-6 h-6 sm:w-8 sm:h-8 bg-brand-600 opacity-15 rounded-full animate-pulse delay-500"></div>
              
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="w-full aspect-square max-w-xs mx-auto bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                    <AntWaving title="Jobmiga waving hello" className="h-auto w-full max-w-sm translate-y-4" />
                    
                     
                    {/* Elementos decorativos */}
                    <div className="absolute top-2 left-2 w-3 h-4 sm:w-4 sm:h-5 bg-brand-400 rounded-full transform rotate-45 opacity-60"></div>
                    <div className="absolute top-4 right-3 w-2 h-3 sm:w-3 sm:h-4 bg-brand-400 rounded-full transform -rotate-12 opacity-60"></div>
                    <div className="absolute bottom-3 left-4 w-3 h-4 bg-brand-400 rounded-full transform rotate-30 opacity-60"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-3 bg-brand-400 rounded-full opacity-60"></div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 font-inter mb-2">
                    You're All Set! 
                  </h3>
                  <p className="text-slate-600 font-poppins text-sm">
                    Your account is ready. Go find your next internship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:hidden text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-6 text-brand-600">
              <div className="text-center">
                <div className="text-2xl mb-2">💼</div>
                <p className="text-xs font-medium">Find Jobs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-xs font-medium">Track Apps</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-xs font-medium">Get Hired</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}