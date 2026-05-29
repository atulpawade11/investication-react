import React, { useEffect, useState } from "react";
import { API_BASE_URL } from '@/lib/config';
import { X, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import PageBanner from '@/components/common/PageBanner';
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';

interface Alliance {
  id: number;
  title: string;
  image: string;
  details: string;
  meta_title: string;
}

interface AlliancesResponse {
  success: boolean;
  data: {
    alliances: Alliance[];
  };
}

// Card Skeleton Loader
function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex p-6 gap-6">
        <div className="flex-shrink-0">
          <Skeleton className="w-20 h-20 rounded-full bg-gray-100" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 rounded-md bg-gray-100 mb-2" />
          <Skeleton className="h-4 w-full rounded-md bg-gray-100 mb-2" />
          <Skeleton className="h-4 w-2/3 rounded-md bg-gray-100" />
          <Skeleton className="h-5 w-24 rounded-md bg-gray-100 mt-3" />
        </div>
      </div>
    </div>
  );
}

export default function AlliancesPage() {
  const { breadcrumbImage } = useBoot();
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [selectedAlliance, setSelectedAlliance] = useState<Alliance | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Static banner data
  const bannerData = {
    title: "Our Alliances",
    subtitle: "Strategic Partnerships Worldwide"
  };

  useEffect(() => {
    async function fetchAlliancesData() {
      try {
        const alliancesRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/alliances`);
        const alliancesData: AlliancesResponse = await alliancesRes.json();

        if (alliancesData.success) {
          setAlliances(alliancesData.data.alliances);
        }
      } catch (error) {
        console.error("Error fetching alliances data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlliancesData();
  }, []);

  const extractLocation = (text: string) => {
    if (!text) return "Global";
    const parts = text.split(" ");
    return parts[parts.length - 1].replace(/[^a-zA-Z]/g, "") || "International";
  };

  const truncateDescription = (html: string, maxLength: number = 100) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Show first 8 alliances if showAll is false, otherwise show all
  const displayedAlliances = showAll ? alliances : alliances.slice(0, 8);
  const hasMoreAlliances = alliances.length > 8;

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <PageBanner 
          title={bannerData.title}
          subtitle={bannerData.subtitle}
          breadcrumbImage={breadcrumbImage}
        />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <PageBanner 
        title={bannerData.title}
        subtitle={bannerData.subtitle}
        breadcrumbImage={breadcrumbImage}
      />

      {/* Alliances Compact Card Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedAlliances.map((item) => (
            <div 
              key={item.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
              onClick={() => setSelectedAlliance(item)}
            >
              <div className="flex p-6 gap-6 items-center">
                {/* Logo Section */}
                <div className="flex-shrink-0">
                  <div className="w-30 h-30 rounded-sm bg-gradient-to-r from-[#0B10A4] to-[#04063E] p-2 flex items-center justify-center shadow-lg">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="object-contain w-full h-full rounded-full"
                    />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#020433] mb-1 line-clamp-1">
                    {item.title.split('®')[0]}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-2">
                    {truncateDescription(item.details, 80)}
                  </p>
                  <button className="text-[#020433] text-sm font-semibold hover:underline flex items-center gap-1 group/btn">
                    View Details 
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Show Less Button */}
        {hasMoreAlliances && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-[#020433] border-2 border-[#020433] rounded-full font-semibold text-[14px] transition-all hover:shadow-lg"
            >
              <span>{showAll ? "Show Less" : "Show More Alliances"}</span>
              {showAll ? (
                <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        )}

        {/* Showing X of Y alliances indicator */}
        {hasMoreAlliances && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Showing {displayedAlliances.length} of {alliances.length} alliances
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Modal - WITHOUT location/meta title */}
      {selectedAlliance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[85vh] animate-in zoom-in-95 duration-200">
            
            {/* LEFT SIDEBAR (30%) */}
            <div className="w-full md:w-[30%] bg-gradient-to-r from-[#0B10A4] to-[#04063E] p-8 flex flex-col items-center justify-center text-center">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full shadow-2xl p-4 flex items-center justify-center mb-6">
                <img 
                  src={selectedAlliance.image} 
                  alt="Partner Logo" 
                  className="object-contain w-full h-full rounded-full"
                />
              </div>

              <h3 className="text-2xl font-bold text-white leading-tight mb-0">
                {selectedAlliance.title}
              </h3>
              
              {/* Decorative Line */}
              <div className="w-12 h-0.5 bg-white/20 my-6"></div>
              
              <p className="text-white/70 text-xs">
                Strategic Alliance Partner
              </p>
            </div>

            {/* RIGHT CONTENT (70%) */}
            <div className="w-full md:w-[70%] p-8 md:p-10 overflow-y-auto bg-white">
              <button 
                onClick={() => setSelectedAlliance(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
              >
                <X size={24} />
              </button>
              
              <div className="prose prose-slate max-w-none">
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-[#020433] mb-3">{selectedAlliance.title}</h4>
                  <div 
                    className="text-gray-600 leading-[1.8] text-sm md:text-base 
                               [&_p]:mb-4 [&_b]:text-[#020433] [&_b]:font-bold 
                               [&_strong]:text-[#020433] [&_strong]:font-bold
                               [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2
                               [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-[#020433] [&_h1]:mb-3
                               [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#020433] [&_h2]:mb-2
                               [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#020433] [&_h3]:mb-2
                               [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:shadow-md"
                    dangerouslySetInnerHTML={{ __html: selectedAlliance.details }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => setSelectedAlliance(null)}
                    className="flex-1 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

          </div>
          {/* Close on backdrop click */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedAlliance(null)} />
        </div>
      )}
    </main>
  );
}