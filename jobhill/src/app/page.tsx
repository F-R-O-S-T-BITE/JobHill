import Image from "next/image"
import './globals.css';
import LandingBody from "@/components/LandingBody";
import Link from "next/link";

export const revalidate = 14400;

export default function Home() {
  return (
    <div className="min-h-screen font-poppins">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-[#0353A4] text-4xl font-black font-inter tracking-tight">JOBHILL</h1>
          </div>
          <div>
            <Link href="/login" className="bg-[#0353A4] text-white px-4 py-2 rounded hover:bg-[#03459E] transition-colors font-semibold inline-block">
              Login/Register
            </Link>
          </div>
        </div>
      </header>

      <section className="w-full bg-[#FDF5E9] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-6xl font-bold mb-2 text-[#000000]">
                Looking for an <br />
                <span className="text-[#0353A4] mt-1 inline-block">Internship?</span>
              </h2>
              <p className="text-[20px] my-4 text-[#000000]">
                <span className="text-[#0353A4] font-medium">Jobhill:</span> Your go-to platform for finding
                <span className="text-[#0353A4]"> internships</span>. Discover
                opportunities, manage applications, and 
                <span className="text-[#0353A4]"> start your journey</span> by
                signing in or creating an account.
              </p>
              <Link href="/register" className="mt-4 bg-[#0353A4] text-white px-6 py-3 rounded hover:bg-[#03459E] transition-colors font-semibold inline-block">
                Get Started
              </Link>
            </div>
            
            <div className="hidden md:flex md:w-1/2 justify-end pr-4">
              <Image
                src="/resources/Banner_Home.png"
                alt="Internship illustration"
                width={400}
                height={400}
                priority
                className="w-full h-auto max-w-sm"
              />
            </div>
          </div>
        </div>
      </section>
      <LandingBody/>
      <footer className="bg-[#0353A4] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center md:justify-between mb-8">
            <div className="flex gap-8 mb-6 md:mb-0">
              <a href="#" className="hover:underline">About us</a>
              <a href="#" className="hover:underline">Discover</a>
              <a href="#" className="hover:underline">Explore</a>
            </div>
            
            <div className="w-16 h-16 mb-6 md:mb-0 bg-white rounded-full flex items-center justify-center p-1.5">
              <Image
                src="/resources/FROSTBITE_Logo_Footer.png"
                alt="FROSTBITE Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
          <div className="border-t border-blue-400 my-4"></div>
          <div className="text-center md:text-left">
            <p>© 2025 F.R.O.S.T. BITE All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}