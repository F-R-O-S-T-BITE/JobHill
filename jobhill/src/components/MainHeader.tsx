import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function MainHeader() {
    return(
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-[#0353A4] text-4xl font-black font-inter tracking-tight">JOBHILL</h1>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/home" className="font-medium text-[#0353A4] border-b-2 border-[#0353A4] pb-1">
                        Opportunities
                    </Link>
                    <Link href="/my-applications" className="font-medium text-[#0353A4]">
                        My Applications
                    </Link>
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