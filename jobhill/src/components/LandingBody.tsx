import React from 'react';
import Image from 'next/image';
import styles from './slider.module.css';
import { getRecentCompanyLogos, getWeeklyJobStats, CompanyLogo } from '@/lib/data-fetcher';

const defaultLogos = [
  { id: 'marchingant1', name: 'MarchingAnt', logo_url: '/resources/AntMarch.png' },
  { id: 'marchingant2', name: 'MarchingAnt2', logo_url: '/resources/AntMarch.png'  },
  { id: 'marchingant3', name: 'MarchingAnt3', logo_url: '/resources/AntMarch.png' },
  { id: 'marchingant4', name: 'MarchingAnt4', logo_url: '/resources/AntMarch.png'  },
  { id: 'marchingant5', name: 'MarchingAnt5', logo_url: '/resources/AntMarch.png' },
  { id: 'marchingant6', name: 'MarchingAnt6', logo_url: '/resources/AntMarch.png' }
];

export const revalidate = 14400;


async function LandingBody() {
  // Valores por defecto para los stats en caso de error
  let jobStats = {
    newInternRoles: 1230,
    newDataMLPositions: 463,
    newSWEPositions: 828,
    totalOpportunities: 13000
  };
  
  let companyLogos = [...defaultLogos];
  
  try {
    const fetchedCompanyLogos = await getRecentCompanyLogos();
    const fetchedJobStats = await getWeeklyJobStats();
    
    if (fetchedJobStats) {
      jobStats = fetchedJobStats;
    }
    
    if (fetchedCompanyLogos && fetchedCompanyLogos.length >= 5) {
      companyLogos = fetchedCompanyLogos;
    } 
    else if (fetchedCompanyLogos && fetchedCompanyLogos.length > 0) {
      let combinedLogos = [...fetchedCompanyLogos];
      
      for (const defaultLogo of defaultLogos) {
        if (combinedLogos.length >= 7) break;
        if (!combinedLogos.some(logo => logo.name === defaultLogo.name)) {
          combinedLogos.push(defaultLogo);
        }
      }
      
      companyLogos = combinedLogos;
    }
  } catch (error) {
    console.error("Error fetching data for landing page:", error);
  }

  return (
    <>
    <div className="bg-white py-12">
      <section className="mb-0">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 font-inter text-[#000000]">Recent Internship Opportunities
      </h3>
      
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
        {companyLogos.map((company, index) => (
          <div key={`first-${index}`} className={styles.slide}>
          <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
            <Image 
            src={company.logo_url} 
            height={60} 
            width={60} 
            alt={`${company.name} logo`}
            className="object-contain rounded-lg" 
            loading="eager"
            />
          </div>
          </div>
        ))}
        
        {companyLogos.map((company, index) => (
          <div key={`second-${index}`} className={styles.slide}>
          <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
            <Image 
            src={company.logo_url} 
            height={60} 
            width={60} 
            alt={`${company.name} logo`}
            className="object-contain rounded-lg" 
            loading="eager"
            />
          </div>
          </div>
        ))}
        
        {companyLogos.map((company, index) => (
          <div key={`third-${index}`} className={styles.slide}>
          <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
            <Image 
            src={company.logo_url} 
            height={60} 
            width={60} 
            alt={`${company.name} logo`}
            className="object-contain rounded-lg" 
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
          <h3 className="text-2xl font-bold text-gray-800">{jobStats.newInternRoles.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">New Intern Roles  </p>
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
          <h3 className="text-2xl font-bold text-gray-800">{jobStats.newDataMLPositions.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">New AI & ML Positions  </p>
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
          <h3 className="text-2xl font-bold text-gray-800">{jobStats.newSWEPositions.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">New SWE Positions  </p>
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
          <h3 className="text-2xl font-bold text-gray-800">{jobStats.totalOpportunities.toLocaleString()}</h3>
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
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="w-full md:w-10/12">
              <Image
                src="/resources/Ant_table_info_home.png"
                alt="Application tracker visualization"
                width={300}
                height={220}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0 order-2 md:order-1">
            <div className="w-full md:w-10/12">
              <Image
                src="/resources/Extension_Home.png"
                alt="Chrome extension for job applications"
                width={400}
                height={320}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
          
          <div className="md:w-1/2 pl-0 md:pl-8 order-1 md:order-2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-inter">
              Google Extension: Auto-Apply & Daily Internship Alerts
            </h2>
            <p className="mb-8 font-inter text-lg text-[#000000]">
              Our Chrome extension autofills applications with your saved info and delivers daily alerts about new matching internships—so you apply faster and never miss opportunities.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="inline-block bg-[#0353A4] text-white font-inter font-medium px-6 py-3 rounded hover:bg-[#0F3DDE] transition-colors">
                Learn More
              </a>
              <a href="#" className="inline-block bg-gray-200 text-gray-700 font-inter font-medium px-6 py-3 rounded hover:bg-gray-300 transition-colors">
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default LandingBody;