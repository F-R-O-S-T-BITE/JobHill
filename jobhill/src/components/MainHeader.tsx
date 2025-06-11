import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useState } from "react";

export default function MainHeader() {
    const [activeTab, setActiveTab] = useState("opportunities");

    return(
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-[#0353A4] text-4xl font-black font-inter tracking-tight cursor-pointer">JOBHILL</h1>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    <button 
                        onClick={() => setActiveTab("opportunities")} 
                        className={`font-medium text-[#0353A4] border-b-2 pb-1 transition-all duration-300 cursor-pointer ${
                            activeTab === "opportunities" ? "border-[#0353A4]" : "border-transparent"
                        }`}
                    >
                        Opportunities
                    </button>
                    <button 
                        onClick={() => setActiveTab("applications")} 
                        className={`font-medium text-[#0353A4] border-b-2 pb-1 transition-all duration-300 cursor-pointer ${
                            activeTab === "applications" ? "border-[#0353A4]" : "border-transparent"
                        }`}
                    >
                        My Applications
                    </button>
                </nav>
                <div>
                    <Link href="/profile" className="text-[#0353A4] hover:text-[#03459E] transition-colors">
                        <FaUser size={24} />
                    </Link>
                </div>
            </div>
        </header>
    )
}