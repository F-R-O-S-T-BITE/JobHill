import Image from "next/image"
import './globals.css';

export default function Home() {
  return (
    <div className = "min-h-screen font-poppins">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-[#0353A4] text-[40px] font-black font-inter tracking-tight">JOBHILL</h1>
          </div>
          <div>
            <button className="bg-[#0353A4] text-white px-4 py-2 rounded hover:bg-[#03459E] transition-colors font-semibold">
              Login/Register
            </button>
          </div>
        </div>
      </header>

      <section className="w-full bg-[#FDF5E9] py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-[60px] font-bold mb-2 text-[#000000]">
              Looking for an <br />
              <span className="text-[#0353A4]">Internship?</span>
            </h2>
            <p className="text-[20px] my-4 text-[#000000]">
              <span className="text-[#0353A4] font-medium">Jobhill:</span> Your go-to platform for finding
              <span className="text-[#0353A4]"> internships</span>. Discover
              opportunities, manage applications, and 
              <span className="text-[#0353A4]"> start your journey</span> by
              signing in or creating an account.
            </p>
            <button className="mt-4 bg-[#0353A4] text-white px-6 py-3 rounded hover:bg-[#03459E] transition-colors font-semibold">
              Get Started
            </button>
          </div>
          
          <div className="md:w-1/2 flex justify-end pr-4">
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
      <main className="container mx-auto px-4 py-12">
      </main>
    </div>
  )
}