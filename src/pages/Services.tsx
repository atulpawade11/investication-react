// app/services/page.tsx
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';
import PageBanner from '@/components/common/PageBanner';
import { useBoot } from '@/context/BootContext';

const ITEMS_PER_PAGE = 6;

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const { breadcrumbImage } = useBoot();

  const getShortText = (html: string) => {
    if (!html || typeof html !== 'string') return "";
    
    const text = html.replace(/<[^>]*>/g, ' ');
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .trim();
    
    if (cleanText.length > 200) {
      return cleanText.substring(0, 200).trim() + '...';
    }
    return cleanText;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        let allServices: any[] = [];
        
        const firstRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/services?page=1&per_page=100`);
        const data = await firstRes.json();
        
        if (data.success && data.data) {
          allServices = data.data.data || [];
          
          const totalPages = data.data.pagination?.total_pages || 1;
          for (let page = 2; page <= totalPages; page++) {
            const pageRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/services?page=${page}&per_page=100`);
            const pageData = await pageRes.json();
            if (pageData.success && pageData.data) {
              allServices = [...allServices, ...(pageData.data.data || [])];
            }
          }
          
          const allCategories = data.data.categories || [];
          
          const activeCategories = allCategories
            .filter((cat: any) => cat.status === 1)
            .sort((a: any, b: any) => a.serial_number - b.serial_number);

          const servicesWithCategory = allServices
            .filter((s: any) => activeCategories.some((cat: any) => cat.id === s.scategory_id))
            .map((s: any) => {
              const category = activeCategories.find((cat: any) => cat.id === s.scategory_id);
              return {
                ...s,
                categoryName: category?.name || '',
                categorySlug: category?.id || '',
                shortText: getShortText(s.content || ''),
              };
            })
            .sort((a: any, b: any) => (a.serial_number || 999) - (b.serial_number || 999));
          
          setServices(servicesWithCategory);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleToggle = () => {
    if (visibleCount >= services.length) {
      setVisibleCount(ITEMS_PER_PAGE);
    } else {
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, services.length));
        setLoadingMore(false);
      }, 500);
    }
  };

  const visibleServices = services.slice(0, visibleCount);
  const hasMore = services.length > ITEMS_PER_PAGE;
  const isShowingAll = visibleCount >= services.length;

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B10A4]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <PageBanner
        title="SIFS India Services"
        subtitle="Expert & Trusted Forensic Service"
        breadcrumbImage={breadcrumbImage || "/about/about-banner.png"}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
        {/* Title + Subtitle - Fully Responsive */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 md:gap-6 lg:gap-8 xl:gap-36">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#04063E] lg:whitespace-nowrap">
              We Provide Smart <br className="hidden sm:block" /> Solutions.
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed lg:text-right">
              We have experts in countless forensic services such as Document Examination, Fingerprint Development, 
              Cyber Forensic, Speaker Identification, Mobile Forensics, Fire Forensic etc.
            </p>
          </div>
        </div>

        {/* Full Width Featured Image - Responsive */}
        <div className="mb-12 sm:mb-14 md:mb-16 rounded-2xl overflow-hidden">
          <img
            src="/services/service-list1.png"
            alt="Forensic Services"
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-2xl"
          />
        </div>

        {/* Services List */}
        <div className="relative">
          <div className="space-y-0 divide-y divide-gray-200">
            {visibleServices.map((service, index) => (
              <div 
                key={service.id} 
                className="py-6 sm:py-8"
              >
                {/* Responsive Layout - Stack on mobile, row on tablet/desktop */}
                <div className="flex flex-col sm:flex-row sm:gap-6 md:gap-12 items-start">
                  
                  {/* Number with Link */}
                  <Link
                    to={`/service/${service.slug}`}
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-colors duration-300 group/num mb-3 sm:mb-0"
                  >
                    <span className="text-2xl sm:text-3xl md:text-[36px] font-bold text-[#000000] group-hover/num:text-[#0B10A4] transition-colors duration-300">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </Link>

                  {/* Content - Takes remaining space */}
                  <div className="flex-1 w-full">
                    <Link to={`/service/${service.slug}`}>
                      <h3 className="text-lg sm:text-xl md:text-[24px] font-medium text-[#000000] hover:text-[#0B10A4] transition-colors mb-2">
                        {service.title}
                      </h3>
                    </Link>
                    
                    {service.shortText && (
                      <p className="text-gray-600 text-sm sm:text-base md:text-[14px] leading-relaxed mb-3">
                        {service.shortText}
                      </p>
                    )}
                    
                    <Link
                      to={`/service/${service.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#0B10A4] hover:text-[#F68A07] transition-colors group/link"
                    >
                      Read More
                      <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Image - Hidden on mobile, visible on tablet/desktop */}
                  {service.main_image && (
                    <div className="hidden md:block flex-shrink-0 w-40 sm:w-48 md:w-52 lg:w-68 h-24 sm:h-28 md:h-32 rounded-lg overflow-hidden bg-[#f8f8f8] ml-0 md:ml-4 lg:ml-6 mt-4 sm:mt-0">
                      <img
                        src={service.main_image}
                        alt={service.title}
                        className="w-full h-full object-scale-down hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                {/* Mobile Image - Visible only on mobile */}
                {service.main_image && (
                  <div className="md:hidden mt-4 w-full rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={service.main_image}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Gradient overlay for "Show More" - Responsive */}
          {hasMore && !isShowingAll && (
            <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 md:h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Show More/Less Button - Responsive */}
        {hasMore && (
          <div className="mt-10 sm:mt-12 text-center relative z-10">
            <button
              onClick={handleToggle}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 disabled:opacity-50 bg-gradient-to-r from-[#0B10A4] to-[#04063E] text-white hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loadingMore ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm sm:text-base">Loading...</span>
                </>
              ) : isShowingAll ? (
                <>
                  <span className="text-sm sm:text-base">Show Less</span>
                  <ChevronUp size={18} className="sm:w-5 sm:h-5" />
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">Show More</span>
                  <ChevronDown size={18} className="sm:w-5 sm:h-5" />
                </>
              )}
            </button>
            
            {/* Counter - Show when not showing all */}
            {!isShowingAll && visibleServices.length < services.length && (
              <p className="text-xs sm:text-sm text-gray-400 mt-3">
                Showing {visibleServices.length} of {services.length} services
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}