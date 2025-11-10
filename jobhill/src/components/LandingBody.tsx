'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './slider.module.css';
import { useLandingData } from '@/hooks/useLandingData';

function AnimatedCounter({
  target,
  duration = 2000,
  isVisible
}: {
  target: number;
  duration?: number;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * target);

        setCount(currentCount);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [isVisible, target, duration]);

  return (
    <span className="text-2xl font-bold text-gray-800">
      {count.toLocaleString()}
    </span>
  );
}

function LandingBody() {
  const { companyLogos, jobStats, isLoading } = useLandingData();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      {
        threshold: 0.3, 
        rootMargin: '0px 0px -100px 0px' 
      }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);
  
  if (isLoading) {
    const defaultLogos = [
      { id: 'marchingant1', name: 'MarchingAnt', logo_url: '/resources/ants/AntMarch.png' },
      { id: 'marchingant2', name: 'MarchingAnt2', logo_url: '/resources/ants/AntMarch.png' },
      { id: 'marchingant3', name: 'MarchingAnt3', logo_url: '/resources/ants/AntMarch.png' },
      { id: 'marchingant4', name: 'MarchingAnt4', logo_url: '/resources/ants/AntMarch.png' },
      { id: 'marchingant5', name: 'MarchingAnt5', logo_url: '/resources/ants/AntMarch.png' },
      { id: 'marchingant6', name: 'MarchingAnt6', logo_url: '/resources/ants/AntMarch.png' }
    ];
    
    const defaultStats = {
      newInternRoles: 1230,
      newDataMLPositions: 463,
      newSWEPositions: 828,
      totalOpportunities: 13000
    };
    
    return renderLandingContent(defaultLogos, defaultStats, statsVisible, statsRef, isLoading);
  }

  return renderLandingContent(companyLogos, jobStats, statsVisible, statsRef, isLoading);
}

function renderLandingContent(
  companyLogos: any[],
  jobStats: any,
  statsVisible: boolean,
  statsRef: React.RefObject<HTMLDivElement | null>,
  isLoading: boolean
) {
  return (
    <>
    <div className="bg-white py-8">
      <section className="mb-0">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-3 font-inter text-[#000000]">Recent Internship Opportunities
      </h3>
      
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
        {companyLogos.map((company, index) => (
          <div key={`first-${index}`} className={styles.slide}>
            <div className="flex flex-col items-center justify-center h-[80px] w-[80px] mx-auto">
              <img
                src={company.logo_url}
                height={70}
                width={70}
                alt={`${company.name} logo`}
                className="object-contain rounded-lg"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const container = target.parentElement;
                  if (container) {
                    const truncatedName = company.name.length > 12 ? company.name.substring(0, 12) + '...' : company.name;
                    container.innerHTML = `
                      <div class="flex flex-col items-center justify-center text-center">
                        <img src="/resources/ants/AntMarch.png" width="60" height="60" alt="Ant fallback" class="mb-1" />
                        <span class="text-xs text-gray-600 font-medium max-w-[140px] truncate">${truncatedName}</span>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        ))}

        {companyLogos.map((company, index) => (
          <div key={`second-${index}`} className={styles.slide}>
            <div className="flex flex-col items-center justify-center h-[80px] w-[80px] mx-auto">
              <img
                src={company.logo_url}
                height={70}
                width={70}
                alt={`${company.name} logo`}
                className="object-contain rounded-lg"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const container = target.parentElement;
                  if (container) {
                    const truncatedName = company.name.length > 12 ? company.name.substring(0, 12) + '...' : company.name;
                    container.innerHTML = `
                      <div class="flex flex-col items-center justify-center text-center">
                        <img src="/resources/ants/AntMarch.png" width="60" height="60" alt="Ant fallback" class="mb-1" />
                        <span class="text-xs text-gray-600 font-medium max-w-[140px] truncate">${truncatedName}</span>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        ))}
        </div>
      </div>
      </section>
    </div>
    
    <div className="bg-[#F5F7FA] py-12 font-inter">
      <div className="container mx-auto px-4" ref={statsRef}>
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
          src="/resources/home/New_Home.png"
          alt="New intern roles"
          width={48}
          height={48}
          />
        </div>
        <div>
          <h3>
            <AnimatedCounter
              target={jobStats.newInternRoles}
              isVisible={statsVisible && !isLoading}
              duration={2000}
            />
          </h3>
          <p className="text-sm text-gray-500">New Intern Roles  </p>
        </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm flex items-center">
        <div className="mr-4">
          <Image
          src="/resources/home/MLPositions_Home.png"
          alt="Data & ML positions"
          width={48}
          height={48}
          />
        </div>
        <div>
          <h3>
            <AnimatedCounter
              target={jobStats.newDataMLPositions}
              isVisible={statsVisible && !isLoading}
              duration={2200}
            />
          </h3>
          <p className="text-sm text-gray-500">New AI & ML Positions  </p>
        </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm flex items-center">
        <div className="mr-4">
          <Image
          src="/resources/home/RolesOpen_home.png"
          alt="SWE positions"
          width={48}
          height={48}
          />
        </div>
        <div>
          <h3>
            <AnimatedCounter
              target={jobStats.newSWEPositions}
              isVisible={statsVisible && !isLoading}
              duration={1800}
            />
          </h3>
          <p className="text-sm text-gray-500">New SWE Positions  </p>
        </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm flex items-center">
        <div className="mr-4">
          <Image
          src="/resources/home/TotalOpportunities_home.png"
          alt="Total opportunities"
          width={48}
          height={48}
          />
        </div>
        <div>
          <h3>
            <AnimatedCounter
              target={jobStats.totalOpportunities}
              isVisible={statsVisible && !isLoading}
              duration={2500}
            />
          </h3>
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
                src="/resources/home/suitcase_home.png"
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
                src="/resources/home/checklist_home.png"
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
                src="/resources/home/autocomplete_home.png"
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
           {/*
           <a href="#" className="inline-block bg-[#0353A4] text-white font-inter font-medium px-6 py-3 rounded hover:bg-[#0F3DDE] transition-colors">
              Learn More
            </a>
           */} 
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="w-full md:w-10/12">
              <Image
                src="/resources/ants/Ant_table_info_home.png"
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
      {/*
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0 order-2 md:order-1">
            <div className="w-full md:w-10/12">
              <Image
                src="/resources/ants/Extension_Home.png"
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
              Our Chrome extension autofills applications with your saved info and delivers daily alerts about new matching internships so you apply faster and never miss opportunities.
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
     */}     
    </>
  );
}

export default LandingBody;