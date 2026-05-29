import React, { useEffect, useState } from 'react';
;
import { Link } from "react-router-dom";
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';

// Static images for category icons - use index-based mapping since API names vary
const CATEGORY_ICONS = [
  "/services/icon-1.png",
  "/services/icon-2.png",
  "/services/icon-3.png",
  "/services/icon-4.png",
];

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

interface ServiceCategory {
  id: number;
  name: string;
  short_text: string;
  image: string;
  serial_number: number;
}

const ForensicServices = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [sectionTitles, setSectionTitles] = useState({
    title: "Serving Justice Globally",
    subtitle: "Forensic Services"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        const result = await response.json();

        if (result.success && result.data) {
          setSectionTitles({
            title: result.data.bs?.service_section_title || "Serving Justice Globally",
            subtitle: result.data.bs?.service_section_subtitle || "Forensic Services"
          });

          if (result.data.serviceCategories) {
            const sorted = result.data.serviceCategories
              .sort((a: any, b: any) => a.serial_number - b.serial_number)
              .slice(0, 4);
            setCategories(sorted);
            
            // Debug: Log category names to console
            console.log("API Categories:", sorted.map((c: any) => c.name));
          }
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getImageUrl = (path: string | undefined) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith('http')) return path;
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
    return `${baseUrl}/uploads/Investigation-Services-Admin-ServiceCategory/${path}`;
  };

  // Get icon by index (since we show 4 categories in order)
  const getCategoryIcon = (index: number) => {
    return CATEGORY_ICONS[index] || CATEGORY_ICONS[0];
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="mb-12 space-y-4 text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-[32px] p-6 space-y-6 shadow-sm border border-slate-100">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative pt-16 pb-8 flex flex-col justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/forensic-bg1.png')`
      }}
    >
      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="mb-12 text-center md:text-left">
          <p className="text-[#04063E] font-semibold text-[18px] mb-2 tracking-wide">
            {sectionTitles.title}
          </p>
          <h2 className="text-4xl md:text-[36px] font-bold text-black leading-tight">
            {sectionTitles.subtitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((service, index) => (
            <Link 
              key={service.id} 
              to={`/services/${slugify(service.name)}`} 
              className="group"
            >
              <div className="bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/60 flex flex-col h-full hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-slate-100">
                
                {/* ICON IMAGE - Using index-based mapping */}
                <div className="w-14 h-14 bg-[#04063E] text-white rounded-full flex items-center justify-center mb-3 shadow-lg overflow-hidden transition-colors group-hover:bg-[#0B10A4]">
                  <img
                    src={getCategoryIcon(index)}
                    alt={service.name}
                    width={28}
                    height={28}
                    className="object-contain brightness-0 invert"
                  />
                </div>

                <div className="flex-grow">
                  <h3 className="font-bold text-black text-[18px] tracking-wide mb-3 uppercase line-clamp-2">
                    {service.name}
                  </h3>
                  <p className="text-[#696969] text-[15px] font-regular leading-relaxed mb-3 line-clamp-3">
                    {service.short_text}
                  </p>
                </div>

                {/* IMAGE BOX */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mt-auto">
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.name}
                    
                    className="object-contain transition-transform duration-500 group-hover:scale-105 w-full"
                    
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForensicServices;