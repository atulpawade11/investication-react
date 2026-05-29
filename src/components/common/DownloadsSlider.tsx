import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { getDownloads } from '@/services/downloadService';
import { Skeleton } from '@/components/shared/Skeleton';
import { API_BASE_URL } from '@/lib/config';
import 'swiper/css';

// Import Icons
import { 
  FaFilePdf, FaFolderOpen, FaSearch, FaEnvelope, 
  FaUserInjured, FaShareAlt, FaArchive, FaFileAlt, FaTrashAlt 
} from 'react-icons/fa';

const DownloadsSlider = () => {
  const [data, setData] = useState({
    items: [] as any[],
    title: "Downloads",
    subtitle: "Access Forensic Resources"
  });
  const [loading, setLoading] = useState(true);

  // Map API strings to React Icons
  const getIcon = (iconName: string) => {
    const name = iconName?.toLowerCase() || "";
    if (name.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (name.includes('archive')) return <FaArchive className="text-amber-600" />;
    if (name.includes('folder') || name.includes('open')) return <FaFolderOpen className="text-blue-500" />;
    if (name.includes('search')) return <FaSearch className="text-slate-500" />;
    if (name.includes('envelope')) return <FaEnvelope className="text-blue-400" />;
    if (name.includes('injured')) return <FaUserInjured className="text-orange-500" />;
    if (name.includes('share')) return <FaShareAlt className="text-green-500" />;
    if (name.includes('trash')) return <FaTrashAlt className="text-slate-400" />;
    return <FaFileAlt className="text-[#04063E]" />;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [downloadResult, homeRes] = await Promise.all([
          getDownloads(),
          fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`).then(res => res.json())
        ]);

        let cleanItems = [];
        if (downloadResult?.success) {
          cleanItems = (downloadResult.data.downloads || []).filter(
            (item: any) => item && item.title && item.title.trim() !== ""
          );
        }

        const homeBs = homeRes?.success ? homeRes.data.bs : null;

        setData({
          items: cleanItems,
          title: homeBs?.download_section_title || "Access Forensic Resources",
          subtitle: homeBs?.download_section_subtitle || "Downloads"
        });

      } catch (err) {
        console.error('Error loading downloads data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalCount = data.items.length;
  const isSlider = totalCount >= 12;

  if (loading) {
    return (
      <section className="py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-12 flex flex-col items-center space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto px-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-14 w-48 rounded-full" />
          ))}
        </div>
      </section>
    );
  }
  
  if (totalCount === 0) return null;

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-12">
        <p className="text-[#04063E] text-[18px] font-semibold mb-2">
          {data.subtitle}
        </p>
        <h2 className="text-4xl md:text-[36px] font-bold text-black leading-tight">
          {data.title}
        </h2>
      </div>

      {/*<div className="relative w-full max-w-[1600px] mx-auto space-y-6 px-4"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
        }}>*/}
      <div className="relative w-full max-w-[1600px] mx-auto space-y-6 px-4">
        {!isSlider ? (
          <div className="flex flex-wrap justify-center gap-4">
            {data.items.map((item) => (
              <a
                key={item.id}
                href={item.download_pdf}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-3 px-8 py-4 rounded-full border border-[#D9D9D9] bg-white text-black md:text-[18px] font-semibold hover:border-[#04063E] hover:shadow-md transition-all whitespace-nowrap"
              >
                <span className="text-xl">{getIcon(item.image)}</span>
                {item.title}
              </a>
            ))}
          </div>
        ) : (
          <div className="relative space-y-6">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView="auto"
              loop={true}
              speed={8000}
              autoplay={{ delay: 0, disableOnInteraction: false }}
              className="swiper-free-mode"
            >
              {data.items.slice(0, Math.ceil(totalCount / 2)).map((item) => (
                <SwiperSlide key={`r1-${item.id}`} style={{ width: 'auto' }}>
                  <a 
                    href={item.download_pdf} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-3 px-8 py-4 rounded-full border border-gray-100 bg-white text-[#04063E] font-medium shadow-sm whitespace-nowrap"
                  >
                    <span className="text-xl">{getIcon(item.image)}</span>
                    {item.title}
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView="auto"
              loop={true}
              speed={8000}
              autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: true }}
              className="swiper-free-mode"
            >
              {data.items.slice(Math.ceil(totalCount / 2)).map((item) => (
                <SwiperSlide key={`r2-${item.id}`} style={{ width: 'auto' }}>
                  <a 
                    href={item.download_pdf} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-3 px-8 py-4 rounded-full border border-gray-100 bg-white text-[#04063E] font-medium shadow-sm whitespace-nowrap"
                  >
                    <span className="text-xl">{getIcon(item.image)}</span>
                    {item.title}
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <style>{`
        .swiper-free-mode .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default DownloadsSlider;