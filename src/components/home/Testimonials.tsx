import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom"; 
import { MoveRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getTestimonials } from '@/services/testimonialService';
import { Skeleton } from '@/components/shared/Skeleton';
import { API_BASE_URL } from '@/lib/config';

export default function Testimonials() {
  const [data, setData] = useState<any>(null);
  const [homeBs, setHomeBs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [testRes, homeRes] = await Promise.all([
          getTestimonials(),
          fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`).then(res => res.json())
        ]);

        if (testRes) setData(testRes);
        if (homeRes?.success) setHomeBs(homeRes.data.bs);

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const testimonialList = data?.data?.data || [];
  const testimonialTitle = homeBs?.testimonial_title || "Success Stories";
  const testimonialSubtitle = homeBs?.testimonial_subtitle || "Hear What Our Clients Say";

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-[#F3F1F2] py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-xl mx-auto space-y-4 text-center">
            <Skeleton className="h-5 w-32 mx-auto" />
            <Skeleton className="h-12 w-96 mx-auto" />
          </div>
          <div className="flex gap-6 mt-12 overflow-x-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[360px] rounded-2xl border border-[#D8D8D8] bg-white/50 p-8 space-y-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonialList.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#F3F1F2] py-16">
      <div className="container mx-auto px-4 md:px-10">
        {/* Title Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="md:text-left text-center">
            <p className="text-[#04063E] font-semibold text-[18px] mb-2 tracking-wide">
              {testimonialTitle}
            </p>
            <h2 className="text-4xl md:text-[36px] font-bold text-black leading-tight">
              {testimonialSubtitle}
            </h2>
          </div>

          {/* Desktop View All Button */}
          <div className="hidden md:block">
            <Link
              to="/testimonials"
              className="bg-gradient-to-r from-[#0B10A4] to-[#04063E]
              text-white px-8 py-3 rounded-full font-bold
              flex items-center gap-4 hover:shadow-xl transition-all group"
            >
              View All 
              <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Slider Section */}
        <div className="relative mt-8 md:mt-12">
          {/* LEFT SIDE ONLY - Fade Effect Overlay */}
          <div 
            className="absolute left-[-330px] top-0 bottom-0 w-180 z-10 pointer-events-none hidden md:block" 
            style={{
              background: 'linear-gradient(to right, #F3F1F2 0%, #F3F1F2 20%, rgba(243, 241, 242, 0.95) 35%, rgba(243, 241, 242, 0.7) 40%, rgba(243, 241, 242, 0.3) 50%, rgba(243, 241, 242, 0) 100%)'
            }}
          />

          {/* Desktop Slider */}
          <div className="hidden md:block">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={2.2}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: false,
              }}
              breakpoints={{
                1024: {
                  slidesPerView: 2.5,
                },
                1280: {
                  slidesPerView: 2.8,
                },
              }}
              className="testimonial-swiper testimonials-swipe"
            >
              {testimonialList.map((item: any, index: number) => (
                <SwiperSlide key={item?.id || index}>
                  <div className="rounded-2xl border border-[#D8D8D8] bg-[#F3F1F2]/30 p-8 backdrop-blur-sm h-full flex flex-col justify-between min-h-[280px]">
                    <div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#1C274C] text-xl text-white relative overflow-hidden">
                        <span 
                          style={{ 
                            fontFamily: 'serif', 
                            fontSize: '50px', 
                            position: 'absolute', 
                            top: '-17px',
                            transform: 'rotate(180deg)',
                            display: 'inline-block',
                            lineHeight: 1
                          }}
                        >“</span>
                      </div>
                      <p className="mb-4 text-[18px] font-medium leading-relaxed text-black line-clamp-3 overflow-hidden text-ellipsis">
                        {item?.comment}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex h-15 w-15 items-center justify-center rounded-full bg-[#DADCD2] overflow-hidden border border-gray-200">
                        {item?.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="h-full w-full object-cover p-2"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-[18px] font-bold text-black leading-tight">
                          {item?.name}
                        </p>
                        <p className="text-[14px] font-regular text-black">
                          {item?.rank}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile Slider */}
          <div className="block md:hidden">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={1.2}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="mobile-swiper testimonials-swipe"
            >
              {testimonialList.map((item: any, index: number) => (
                <SwiperSlide key={item?.id || index}>
                  <div className="rounded-2xl border border-[#D8D8D8] bg-[#F3F1F2]/30 p-6 backdrop-blur-sm h-full flex flex-col justify-between">
                    <div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#1C274C] text-xl text-white relative">
                        <span 
                          style={{ 
                            fontFamily: 'serif', 
                            fontSize: '50px', 
                            position: 'absolute', 
                            top: '-17px',
                            transform: 'rotate(180deg)',
                            display: 'inline-block',
                            lineHeight: 1
                          }}
                        >“</span>
                      </div>
                      <p className="mb-4 text-[16px] font-medium leading-relaxed text-black line-clamp-4 overflow-hidden text-ellipsis">
                        {item?.comment}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DADCD2] overflow-hidden border border-gray-200">
                        {item?.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="h-full w-full object-contain p-1.5"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-[16px] font-bold text-black leading-tight">
                          {item?.name}
                        </p>
                        <p className="text-[12px] font-regular text-black">
                          {item?.rank}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden mx-auto flex items-center justify-center">
          <Link
            to="/testimonials"
            className="bg-gradient-to-r from-[#0B10A4] to-[#04063E]
            text-white px-8 py-3 rounded-full font-bold
            flex items-center gap-4 hover:shadow-xl transition-all group"
          >
            View All 
            <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        
        .testimonial-swiper {
          overflow: visible !important;
          padding-bottom: 50px !important;
        }
        
        .testimonial-swiper .swiper-wrapper {
          overflow: visible !important;
        }
        
        .testimonial-swiper .swiper-slide {
          height: auto !important;
          overflow: visible !important;
        }
        
        .mobile-swiper {
          overflow: visible !important;
          padding-bottom: 50px !important;
        }
        
        /* Custom Pagination Styles */
        .testimonial-swiper .swiper-pagination {
          bottom: 0px !important;
        }
        
        .testimonial-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #D1D5DB;
          opacity: 1;
          transition: all 0.3s ease;
          margin: 0 6px !important;
        }
        
        .testimonial-swiper .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          background: linear-gradient(to right, #0B10A4, #04063E);
        }
        
        .mobile-swiper .swiper-pagination {
          bottom: 0px !important;
        }
        
        .mobile-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #D1D5DB;
          opacity: 1;
          margin: 0 4px !important;
        }
        
        .mobile-swiper .swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 3px;
          background: linear-gradient(to right, #0B10A4, #04063E)!important;
        }
        .testimonials-swipe .swiper-pagination-bullet-active{
          background: linear-gradient(to right, #0B10A4, #04063E)!important;
          
        }
      `}</style>
    </section>
  );
}