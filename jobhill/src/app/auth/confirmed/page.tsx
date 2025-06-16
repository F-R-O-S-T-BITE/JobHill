"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import "../../globals.css"
export default function AccountConfirmed() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF5E9] to-[#F0F8FF] overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className={`lg:w-1/2 text-center lg:text-left lg:pr-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-6">
            <span className="text-6xl animate-bounce inline-block">🎉</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black font-inter text-[#0353A4] mb-6 leading-tight">
            Account<br />
            <span className="text-[#000000]">Confirmed!</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-700 mb-8 font-poppins leading-relaxed max-w-md mx-auto lg:mx-0">
            Your email has been verified successfully! You can now start exploring 
            <span className="text-[#0353A4] font-semibold"> hundreds of internship opportunities</span> and 
            track your applications.
          </p>  
          <Link 
            href="/home" 
            className="bg-[#0353A4] text-white px-8 py-4 rounded-lg hover:bg-[#034383] transition-all duration-300 font-semibold font-poppins text-lg inline-block transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🚀 Get Started
          </Link>
          <p className="text-sm text-gray-500 mt-4 font-poppins">
            Ready to find your dream internship?
          </p>
        </div>
    
        {/* Badge */}
        <div className={`lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="relative">
            {/* Elementos decorativos de background */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#0353A4] opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#0353A4] opacity-20 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-16 -right-8 w-8 h-8 bg-[#0353A4] opacity-15 rounded-full animate-pulse delay-500"></div>
            
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                  <Image
                    src="/resources/ants/confirmedAccount.png"
                    alt="Internship illustration"
                    width={600}
                    height={600}
                    priority
                    className="w-full h-auto max-w-sm"/>
                   
                  {/*Elementos decorativos */}
                  <div className="absolute top-4 left-4 w-6 h-8 bg-[#4A90E2] rounded-full transform rotate-45 opacity-60"></div>
                  <div className="absolute top-8 right-6 w-4 h-6 bg-[#4A90E2] rounded-full transform -rotate-12 opacity-60"></div>
                  <div className="absolute bottom-6 left-8 w-5 h-7 bg-[#4A90E2] rounded-full transform rotate-30 opacity-60"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-4 bg-[#4A90E2] rounded-full opacity-60"></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 font-inter mb-2">
                  You're All Set! 
                </h3>
                <p className="text-gray-600 font-poppins text-sm">
                  Start your internship journey today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}