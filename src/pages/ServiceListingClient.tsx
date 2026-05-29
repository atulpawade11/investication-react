// app/services/[category]/ServiceListingClient.tsx

import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Users, 
  Award, 
  Shield, 
  Clock, 
  CheckCircle,
  FileText,
  Microscope
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';
import PageBanner from '@/components/common/PageBanner';
import ServiceSidebar from '@/components/services/ServiceSidebar';
import QueryForm from '@/components/services/QueryForm';
import { useBoot } from '@/context/BootContext';

interface Props {
  categorySlug: string;
}

const INITIAL_VISIBLE_COUNT = 6;

export default function ServiceListingClient({ categorySlug }: Props) {
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [subServices, setSubServices] = useState<any[]>([]);
  const [sidebarData, setSidebarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const { breadcrumbImage } = useBoot();

  // Function to get full image URL - same approach as working services page
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path, prepend API_BASE_URL (without trailing /api if present)
    const baseUrl = API_BASE_URL.replace(/\/api$/, '');
    return `${baseUrl}/${imagePath.replace(/^\//, '')}`;
  };

  // Function to fetch all pages of services
  const fetchAllServices = async () => {
    let allServices: any[] = [];
    let currentPage = 1;
    let totalPages = 1;
    
    try {
      const firstRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/services?page=1&per_page=50`);
      const firstData = await firstRes.json();
      
      if (firstData.success && firstData.data) {
        allServices = [...(firstData.data.data || [])];
        totalPages = firstData.data.pagination?.total_pages || 1;
        
        for (let page = 2; page <= totalPages; page++) {
          const pageRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/services?page=${page}&per_page=50`);
          const pageData = await pageRes.json();
          
          if (pageData.success && pageData.data) {
            allServices = [...allServices, ...(pageData.data.data || [])];
          }
        }
      }
      
      return { services: allServices, categories: firstData.data?.categories || [] };
    } catch (error) {
      console.error("Error fetching all pages:", error);
      return { services: [], categories: [] };
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { services: allServices, categories } = await fetchAllServices();
        
        setSidebarData({ categories, data: allServices });
        
        const rawSlug = decodeURIComponent(categorySlug);
        
        let foundCat = null;
        
        if (!isNaN(Number(rawSlug))) {
          foundCat = categories?.find((c: any) => String(c.id) === rawSlug);
        }
        
        if (!foundCat) {
          const cleanSlug = rawSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          foundCat = categories?.find((c: any) => {
            const catNameClean = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return catNameClean.includes(cleanSlug) || cleanSlug.includes(catNameClean);
          });
        }

        if (foundCat) {
          setCategoryInfo(foundCat);

          const filtered = allServices?.filter(
            (item: any) => String(item.scategory_id) === String(foundCat.id)
          ) || [];
          
          const sortedServices = filtered.sort((a: any, b: any) => 
            (a.serial_number || 999) - (b.serial_number || 999)
          );
          
          setSubServices(sortedServices);
        }

      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) fetchData();
  }, [categorySlug]);

  const handleShowMore = () => {
    setVisibleCount(subServices.length);
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    document.getElementById('services-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, '').substring(0, 180);
  };

  const getServiceIcon = (title: string, index: number) => {
    const icons = [
      <FileText key="file" size={24} className="text-[#0B10A4]" />,
      <Microscope key="microscope" size={24} className="text-[#0B10A4]" />,
      <Shield key="shield" size={24} className="text-[#0B10A4]" />,
      <Users key="users" size={24} className="text-[#0B10A4]" />,
      <Award key="award" size={24} className="text-[#0B10A4]" />,
      <Clock key="clock" size={24} className="text-[#0B10A4]" />,
      <CheckCircle key="check" size={24} className="text-[#0B10A4]" />,
      <Calendar key="calendar" size={24} className="text-[#0B10A4]" />
    ];
    return icons[index % icons.length];
  };

  const ListingSkeleton = () => (
    <div className="bg-[#F8F9FA] min-h-screen">
      <div className="w-full h-[300px] bg-gray-200 animate-pulse flex flex-col items-center justify-center">
        <Skeleton className="h-6 w-40 bg-gray-300" />
        <Skeleton className="h-10 w-80 bg-gray-300 mt-2" />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-1/3 xl:w-1/4">
            <div className="sticky top-28 space-y-8">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
              <Skeleton className="h-[300px] w-full rounded-2xl" />
            </div>
          </aside>
          <main className="lg:w-2/3 xl:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-10 w-32 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );

  if (loading) return <ListingSkeleton />;

  if (!categoryInfo) return (
    <div className="py-20 text-center text-gray-500">
      Category "{decodeURIComponent(categorySlug)}" not found.
    </div>
  );

  const visibleServices = subServices.slice(0, visibleCount);
  const hasMoreServices = subServices.length > INITIAL_VISIBLE_COUNT;
  const showingAll = visibleCount === subServices.length;

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageBanner
        title={categoryInfo.name}
        subtitle="Forensic Investigation Services"
        breadcrumbImage={breadcrumbImage || "/about/about-banner.png"}
      />

      <div className="container mx-auto px-4 md:px-10 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT SIDEBAR */}
          <aside className="lg:w-1/4">
            <div className="sticky top-28 space-y-8">
              <ServiceSidebar apiData={sidebarData} />
              <QueryForm serviceTitle={categoryInfo.name} />
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT */}
          <main className="lg:w-3/4">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
              {/*<p className="text-[18px] font-medium text-black leading-relaxed flex-1">
                {categoryInfo.short_text || 
                  "Specialized forensic investigation services tailored to legal and corporate requirements."
                }
              </p>*/}
              <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-[#0B10A4] rounded-full text-sm font-semibold whitespace-nowrap self-start sm:self-auto">
                <span>{subServices.length} Services Available</span>
              </div>
            </div>

            <div id="services-list" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleServices.length > 0 ? (
                visibleServices.map((item, index) => {
                  // Use main_image or featured_image - same as working services page
                  const imageUrl = item.main_image || item.featured_image;
                  
                  return (
                    <Link 
                      key={item.id} 
                      to={`/service/${item.slug}`}
                      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#0B10A4]/20 hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              // If image fails, show fallback
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200';
                                fallback.innerHTML = '<span class="text-4xl">🔬</span>';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <span className="text-4xl">🔬</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-[#000000]/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {categoryInfo.name}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-md">
                          {getServiceIcon(item.title, index)}
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold text-[#04063E] group-hover:text-[#0B10A4] transition-colors line-clamp-2 mb-2">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-4">
                          {item.meta_description || stripHtml(item.content)}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-[#0B10A4] font-semibold text-sm group-hover:gap-2 transition-all">
                            Learn More <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">No specialized services currently listed in this category.</p>
                </div>
              )}
            </div>

            {hasMoreServices && (
              <div className="mt-12 text-center">
                {!showingAll ? (
                  <button
                    onClick={handleShowMore}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0B10A4] to-[#04063E] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1 group"
                  >
                    Show All {subServices.length} Services
                    <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={handleShowLess}
                    className="inline-flex items-center gap-2 bg-gray-100 text-[#0B10A4] px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all transform hover:-translate-y-1 group"
                  >
                    Show Less
                    <ChevronUp size={18} className="group-hover:-translate-y-1 transition-transform" />
                  </button>
                )}
              </div>
            )}

            {!showingAll && subServices.length > INITIAL_VISIBLE_COUNT && (
              <p className="text-center text-gray-400 text-sm mt-4">
                Showing {visibleServices.length} of {subServices.length} services
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}