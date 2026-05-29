import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { MoveRight } from 'lucide-react';
import { Skeleton } from '@/components/shared/Skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper Smooth Transition Imports
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import { API_BASE_URL } from '@/lib/config';

// --- INTERFACE ---
interface HomePageData {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: {
    bs: {
      hero_section_title: string;
      hero_section_text: string;
      hero_section_button_text: string;
      hero_section_button_url: string;
      hero_bg?: string;
    };
    sliders: Array<{
      id: number;
      title: string;
      text: string;
      button_text: string;
      button_url: string;
      image: string;
      mobile_image: string;
    }>;
  };
}

const Hero = () => {
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: HomePageData = await response.json();
        if (data.success) setHomeData(data);
        else throw new Error(data.message || 'Failed to fetch data');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const apiSlides = homeData?.data?.sliders?.map(slider => {
    let slideSrc = "/hero-banner.png"; 
    if (slider.image && slider.image.trim() !== "") {
      if (slider.image.startsWith('http')) { 
        slideSrc = slider.image; 
      } else {
        const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
        slideSrc = `${baseUrl}${slider.image.startsWith('/') ? slider.image : `/${slider.image}`}`;
      }
    }
    return {
      src: slideSrc,
      alt: slider.title || "Forensic Slide",
      title: slider.title,
      text: slider.text,
      button_text: slider.button_text,
      button_url: slider.button_url
    };
  }) || [];

  const slides = apiSlides.length > 0 ? apiSlides : [
    { src: "/hero-banner.png", alt: "Forensic Investigation", title: "Illuminating The Concealed Reality", text: "Forensic Excellence Creating Global Impact", button_text: "LEARN MORE", button_url: "/" },
  ];

  const currentSlideData = slides[activeIndex];

  const heroTitle = currentSlideData?.title || homeData?.data?.bs?.hero_section_title || "Serving The Nation Forensically";
  const heroText = currentSlideData?.text || homeData?.data?.bs?.hero_section_text || "Delivering Justice Through Forensic Excellence";
  const heroButtonText = currentSlideData?.button_text || homeData?.data?.bs?.hero_section_button_text || "Learn More";
  const heroButtonUrl = currentSlideData?.button_url || homeData?.data?.bs?.hero_section_button_url || "/";

  if (loading) return <Skeleton className="w-full h-[450px] md:h-[600px]" />;

  return (
    <section className="relative w-full h-[450px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* BACKGROUND SWIPER - Full BG Image */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1500}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={slides.length > 1}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover brightness-80"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Content Overlay - Text on the Right Side */}
      <div className="relative z-10 h-full container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center h-full">
          {/* Left side - Empty spacer */}
          <div className="hidden lg:block lg:w-1/2" />
          
          {/* Right side - Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-white">
            <div 
              key={activeIndex}
              className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-10 duration-1000"
            >
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2">
                {heroTitle}
              </h2>

              {/* Text with icon */}
              <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base md:text-lg">
                <p>{heroText}</p>
                {/* <img 
                  src="/edu-cap.png" 
                  alt="decoration"
                  className="w-6 h-6 md:w-8 md:h-8 object-contain"
                /> */}
              </div>

              {/* Two Buttons in one line */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                <Link
                  to={heroButtonUrl}
                  className="bg-gradient-to-r from-[#0B10A4] to-[#04063E] 
                            text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full font-bold 
                            flex items-center justify-center gap-2 md:gap-3 
                            hover:from-[#1217c0] hover:to-[#0a0f6b] 
                            transition-all group text-sm md:text-base w-full sm:w-auto"
                >
                  {heroButtonText}
                  <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="flex items-center justify-center gap-2 md:gap-3 border-2 border-white/30 
                                  text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full 
                                  text-sm md:text-base font-bold 
                                  hover:bg-white/10 transition-all group w-full sm:w-auto">
                  Explore More Sifs
                  <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet { 
          background: white !important; 
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active { 
          background: #f97316 !important; 
          opacity: 1;
        }
        .swiper-pagination {
          bottom: 20px !important;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Hero;