import React, { useEffect, useState } from 'react';
;
import { Link } from "react-router-dom";
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';
import * as FaIcons from 'react-icons/fa';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as RiIcons from 'react-icons/ri';
import { IconType } from 'react-icons';

interface VisionPoint {
  id: number;
  title: string;
  short_text: string;
  icon: string;
  serial_number: number;
}

// Comprehensive icon mapping
const getIconComponent = (iconName: string): IconType | null => {
  // Clean the icon name (remove 'fas fa-' prefix if exists)
  let cleanIconName = iconName.replace(/^fas\s+fa-/, '').replace(/^far\s+fa-/, '');
  
  // Convert to proper case for component lookup (e.g., "bullseye" -> "FaBullseye")
  const componentName = `Fa${cleanIconName.charAt(0).toUpperCase()}${cleanIconName.slice(1)}`;
  
  // Try different icon libraries
  const iconLibraries = [FaIcons, BsIcons, MdIcons, IoIcons, RiIcons];
  
  for (const library of iconLibraries) {
    // @ts-ignore - Dynamic lookup
    const Icon = library[iconName] || library[componentName];
    if (Icon) return Icon as IconType;
  }
  
  // Try with original name
  for (const library of iconLibraries) {
    // @ts-ignore
    const Icon = library[iconName];
    if (Icon) return Icon as IconType;
  }
  
  return null;
};

// Fallback icon component
const FallbackIcon = ({ color = "#04063E" }: { color?: string }) => (
  <svg className="w-8 h-8" fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const VisionMission = () => {
  const [points, setPoints] = useState<VisionPoint[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [content, setContent] = useState({
    title: "Forensic Services",
    subtitle: "Scientifically Revealing the Truth with Utmost Precision",
    btnText: "Our Services",
    btnUrl: "/services",
    image: "/visionmission.png" 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisionData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        const result = await response.json();

        if (result.success && result.data) {
          const bs = result.data.bs;
          setContent({
            title: bs.approach_title || "Forensic Services",
            subtitle: bs.approach_subtitle || "Scientifically Revealing the Truth with Utmost Precision",
            btnText: bs.approach_button_text || "Our Services",
            btnUrl: bs.approach_button_url || "/about",
            image: bs.approach_bg ? `${API_BASE_URL.replace('/api', '')}/${bs.approach_bg}` : "/visionmission.png"
          });

          if (result.data.points) {
            setPoints(result.data.points);
          }
        }
      } catch (err) {
        console.error('Error fetching VisionMission data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisionData();
  }, []);

  const displayedPoints = showAll ? points : points.slice(0, 3);

  const renderIcon = (iconName: string, bgColor: string, invertIcon: boolean) => {
    const IconComponent = getIconComponent(iconName);
    const iconColor = invertIcon ? '#FFFFFF' : '#04063E';
    
    if (IconComponent) {
      return <IconComponent className={`w-8 h-8`} color={iconColor} />;
    }
    
    // If no icon found, show fallback
    console.warn(`Icon not found for: ${iconName}`);
    return <FallbackIcon color={iconColor} />;
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-4 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-full max-w-2xl mx-auto mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
            </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16 pt-8 overflow-hidden">
      <div className="container mx-auto px-4 md:px-10 text-center">
        <p className="text-[#04063E] font-semibold text-[18px] mb-2">{content.title}</p>
        <h2 className="max-w-2xl mx-auto text-4xl md:text-[36px] font-bold text-black leading-tight mb-5">
          {content.subtitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10 transition-all duration-500 px-2 md:px-20 mt-14">
          {displayedPoints.map((item, index) => {
            const isEven = index % 2 === 0;
            const bgColor = isEven ? "bg-[#04063E]" : "bg-white border-2 border-[#04063E]";
            const invertIcon = isEven;
            
            const cleanTitle = item.title.replace(/[,.]+$/, "").toUpperCase();
            const cleanText = item.short_text.replace(/[,.]+$/, "");

            return (
              <div key={item.id} className="flex items-start gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center shadow-lg shadow-blue-50 relative flex-shrink-0`}>
                  {renderIcon(item.icon, bgColor, invertIcon)}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-black text-[24px] mb-3 uppercase">{cleanTitle}</h3>
                  <p className="text-[#868686] text-[15px] font-regular leading-relaxed">{cleanText}</p>
                </div>
              </div>
            );
          })}
        </div>

        {points.length > 3 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="mb-10 text-[#04063E] font-bold text-sm underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors"
          >
            {showAll ? "View Less Content ↑" : "View More Content ↓"}
          </button>
        )}

        <div className="relative flex items-center justify-center mb-10">
          <div className="absolute w-full h-px bg-[#8c8c8c] opacity-60 md:block hidden"></div>
          <div className="relative z-10 bg-white px-6 flex flex-col md:flex-row items-center gap-4">
            <span className="text-[15px] font-regular text-black">For more information!</span>
            <Link
              to={content.btnUrl}
              className="bg-[#04063E] text-white px-10 py-2 rounded-full font-bold flex items-center gap-4 cursor-pointer border-none no-underline transition-all hover:opacity-90"
            >
              {content.btnText}
              {/*<span className="group-hover:translate-x-1 transition-transform">→</span>*/}
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[500px] rounded-[20px] md:rounded-[250px] overflow-hidden shadow-2xl">
          <img
            src={content.image}
            alt="Forensic Science Vision"
            
            className="object-cover object-center w-full h-full"
            
          />
        </div>
      </div>
    </section>
  );
};

export default VisionMission;