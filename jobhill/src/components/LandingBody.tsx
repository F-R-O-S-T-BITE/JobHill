import React from 'react';
import Image from 'next/image';
import styles from './slider.module.css';

const LandingBody = () => {
  const logos = [
    "https://static.vecteezy.com/system/resources/previews/046/861/647/non_2x/google-logo-transparent-background-free-png.png",
    "https://images.icon-icons.com/2429/PNG/512/microsoft_logo_icon_147261.png",
    "https://images.icon-icons.com/2699/PNG/512/nvidia_logo_icon_169902.png",
    "https://1000marcas.net/wp-content/uploads/2020/03/logo-Cisco.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/1200px-Notion-logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/800px-Rockstar_Games_Logo.svg.png",
  ];

  return (
    <>
    <div className="bg-white py-12">
      <section className="mb-0">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 font-inter text-[#000000]">Today Internship's
      </h3>
      
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
        {logos.map((logo, index) => (
          <div key={`first-${index}`} className={styles.slide}>
          <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
            <Image 
            src={logo} 
            height={60} 
            width={60} 
            alt="Company logo"
            className="object-contain" 
            loading="eager"
            />
          </div>
          </div>
        ))}
        
        {logos.map((logo, index) => (
          <div key={`second-${index}`} className={styles.slide}>
          <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
            <Image 
            src={logo} 
            height={60} 
            width={60} 
            alt="Company logo"
            className="object-contain" 
            loading="eager"
            />
          </div>
          </div>
        ))}
        
        {logos.map((logo, index) => (
          <div key={`third-${index}`} className={styles.slide}>
          <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
            <Image 
            src={logo} 
            height={60} 
            width={60} 
            alt="Company logo"
            className="object-contain" 
            loading="eager"
            />
          </div>
          </div>
        ))}
        </div>
      </div>
      </section>
    </div>
    
    <div className="bg-[#F5F7FA] py-12 font-inter">
      <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
        Empowering Students to Build Their Futures, <span className="text-[#0F3DDE]">starting with Internships</span>
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
        There are a lot of opportunities! You just need to apply
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        <div className="bg-white rounded-lg p-6 shadow-sm flex items-center">
        <div className="mr-4">
          <Image
          src="/resources/New_Home.png"
          alt="New intern roles"
          width={48}
          height={48}
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">1,230</h3>
          <p className="text-sm text-gray-500">New Intern Roles</p>
        </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm flex items-center">
        <div className="mr-4">
          <Image
          src="/resources/MLPositions_Home.png"
          alt="Data & ML positions"
          width={48}
          height={48}
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">463</h3>
          <p className="text-sm text-gray-500">New Data & ML Positions</p>
        </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm flex items-center">
        <div className="mr-4">
          <Image
          src="/resources/RolesOpen_home.png"
          alt="SWE positions"
          width={48}
          height={48}
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">828</h3>
          <p className="text-sm text-gray-500">New SWE Positions</p>
        </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm flex items-center">
        <div className="mr-4">
          <Image
          src="/resources/TotalOpportunities_home.png"
          alt="Total opportunities"
          width={48}
          height={48}
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">13,000</h3>
          <p className="text-sm text-gray-500">Open Opportunities!</p>
        </div>
        </div>
      </div>
      </div>
    </div>

    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-inter">
            Streamline Your Internship<br />Journey From Search to Success
          </h2>
          <p className="text-gray-600 font-inter">
            What does JobHill has?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center px-6">
            <div className="inline-block bg-blue-100 p-4 rounded-lg mb-5">
              <Image
                src="/resources/suitcase_home.png"
                alt="Daily opportunities"
                width={48}
                height={48}
                className="mx-auto"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 font-inter">
              Daily Internship Opportunities
            </h3>
            <p className="text-gray-600 font-inter">
              Browse fresh opportunities updated every day and find the right fit for your career goals.
            </p>
          </div>
          
          <div className="text-center px-6">
            <div className="inline-block bg-blue-100 p-4 rounded-lg mb-5">
              <Image
                src="/resources/checklist_home.png"
                alt="Track applications"
                width={48}
                height={48}
                className="mx-auto"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 font-inter">
              Track Your Applications
            </h3>
            <p className="text-gray-600 font-inter">
              Keep all your internship submissions organized in a clear, easy-to-update table.
            </p>
          </div>
          
          <div className="text-center px-6">
            <div className="inline-block bg-blue-100 p-4 rounded-lg mb-5">
              <Image
                src="/resources/autocomplete_home.png"
                alt="Apply faster"
                width={48}
                height={48}
                className="mx-auto"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 font-inter">
              Apply Faster, Get Hired Sooner
            </h3>
            <p className="text-gray-600 font-inter">
              Our smart autofill completes 80% of applications for you – just review and submit
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#F5F7FA] py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-inter">Organizing your Job Search with an Application Tracker 
            </h2>
            <p className="mb-8 font-inter text-lg text-[#000000]">
              Transform chaos into clarity with a centralized application table. Track roles, deadlines, and statuses to avoid overlooked steps. Visualize progress, spot patterns, and stay motivated-all while reducing stress.
            </p>
            <a href="#" className="inline-block bg-[#0353A4] text-white font-inter font-medium px-6 py-3 rounded hover:bg-[#0F3DDE] transition-colors">
              Learn More
            </a>
          </div>
          <div className="md:w-1/2 flex justify-end">
            <Image
              src="/resources/Ant_table_info_home.png"
              alt="Application tracker visualization"
              width={350}
              height={270}
              className="h-auto max-w-[500px] md:max-w-[550px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LandingBody;
