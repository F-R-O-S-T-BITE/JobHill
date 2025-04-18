import React from 'react';
import Image from 'next/image';
import styles from './slider.module.css'

const LandingBody = () => {
    return (
        <div className="bg-white py-12">
        <section className="mb-16">
          <h3 className="text-md text-[#000000] md:text-2xl font-bold text-center mb-8 font-inter">Today Internship's
          </h3>
          
          <div className={styles.slider}>
            <div className={styles.slideTrack}>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://static.vecteezy.com/system/resources/previews/046/861/647/non_2x/google-logo-transparent-background-free-png.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://images.icon-icons.com/2429/PNG/512/microsoft_logo_icon_147261.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://images.icon-icons.com/2699/PNG/512/nvidia_logo_icon_169902.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://1000marcas.net/wp-content/uploads/2020/03/logo-Cisco.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/1200px-Notion-logo.svg.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/800px-Rockstar_Games_Logo.svg.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>

              {/* Duplicated slides for continuous scrolling */}
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://static.vecteezy.com/system/resources/previews/046/861/647/non_2x/google-logo-transparent-background-free-png.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://images.icon-icons.com/2429/PNG/512/microsoft_logo_icon_147261.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://images.icon-icons.com/2699/PNG/512/nvidia_logo_icon_169902.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://1000marcas.net/wp-content/uploads/2020/03/logo-Cisco.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/1200px-Notion-logo.svg.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
              <div className={styles.slide}>
                <div className="flex items-center justify-center h-[60px] w-[60px] mx-auto">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/800px-Rockstar_Games_Logo.svg.png" 
                    height={60} 
                    width={60} 
                    alt="Company logo"
                    className="object-contain" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
};

export default LandingBody;