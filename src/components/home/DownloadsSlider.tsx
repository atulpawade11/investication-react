import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

const row1 = [
  "Application", "Case Submission Form", "Service Request Letter", 
  "Laboratory Profile", "Court Judgement", "Court Summons", "Forensic Manual",
  "Application", "Case Submission Form", "Service Request Letter",
];

const row2 = [
  "Certificates", "Achievements", "Institution Glimpse", 
  "Case Submission Procedure", "Court Summons", "Case Tracking", "Expert Directory",
  "Certificates", "Achievements", "Institution Glimpse",
];

const DownloadsSlider = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      {/* Title Section */}
      <div className="container mx-auto px-4 text-center mb-12">
        <p className="text-[#04063E] font-medium mb-2">Access Forensic Resources</p>
        <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight ">Downloads</h2>
      </div>

      {/* Main Slider Container with Fading Mask */}
      <div className="relative w-full max-w-[1600px] mx-auto space-y-6 px-4"
           style={{
             maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
             WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
           }}>
        
        {/* Row 1: Moving Left */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView="auto"
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          className="swiper-free-mode"
        >
          {row1.map((item, index) => (
            <SwiperSlide key={index} style={{ width: 'auto' }}>
              <div className="px-8 py-3 rounded-full border border-gray-100 bg-white text-[#04063E] font-medium shadow-sm hover:border-[#04063E] transition-colors cursor-pointer whitespace-nowrap">
                {item}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Row 2: Moving Right (Reverse) */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView="auto"
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: true, // This makes it move the other way
          }}
          className="swiper-free-mode"
        >
          {row2.map((item, index) => (
            <SwiperSlide key={index} style={{ width: 'auto' }}>
              <div className="px-8 py-3 rounded-full border border-gray-100 bg-white text-[#04063E] font-medium shadow-sm hover:border-[#FF8C00] transition-colors cursor-pointer whitespace-nowrap">
                {item}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Add this to your global CSS or a <style> tag to make the transition smooth */}
      <style>{`
        .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default DownloadsSlider;