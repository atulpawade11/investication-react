import React, { useEffect, useState } from 'react';
import { MoveRight, Play, X } from 'lucide-react';
import { Skeleton } from '@/components/shared/Skeleton';
import { API_BASE_URL } from '@/lib/config';

interface AboutIntroData {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: {
    bs: {
      intro_bg: string;
      intro_section_title: string;
      intro_section_text: string;
      intro_section_button_text: string;
      intro_section_button_url: string;
      intro_section_video_link: string;
      about_us: string;
    };
  };
}

const AboutIntro = () => {
  const [aboutData, setAboutData] = useState<AboutIntroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [introParagraphs, setIntroParagraphs] = useState<string>('');
  const [highlights, setHighlights] = useState<string[]>([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AboutIntroData = await response.json();

        if (data.success) {
          setAboutData(data);
          if (data.data?.bs?.about_us) {
            parseAboutUsContent(data.data.bs.about_us);
          }
        } else {
          throw new Error(data.message || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Parse HTML content - EXTRACT ONLY FIRST 3 PARAGRAPHS (no Mission/Vision/Purpose)
  const parseAboutUsContent = (htmlContent: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Extract ONLY the first 3 paragraphs (before Mission section starts)
    const paragraphs = tempDiv.querySelectorAll('p');
    let combinedText = '';
    let paragraphCount = 0;
    
    for (const para of paragraphs) {
      const text = para.textContent?.trim();
      // Stop after collecting 3 paragraphs
      if (paragraphCount >= 3) break;
      
      if (text && text.length > 0) {
        combinedText += text + ' ';
        paragraphCount++;
      }
    }
    
    // Extract all list items for highlights
    const listItems = tempDiv.querySelectorAll('ul li');
    const extractedHighlights: string[] = [];
    listItems.forEach(item => {
      const text = item.textContent?.trim();
      if (text && text.length > 0) {
        extractedHighlights.push(text);
      }
    });
    
    setIntroParagraphs(combinedText.trim());
    setHighlights(extractedHighlights);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideo(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const getImageUrl = (path: string | undefined) => {
    if (!path || path.trim() === "") return "/about.png";
    if (path.startsWith('http')) return path;

    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const imgPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${imgPath}`;
  };

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-6 h-6 rounded-md" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 pt-4">
                <Skeleton className="h-12 w-40 rounded-full" />
              </div>
            </div>
            <div className="relative aspect-[4/3]">
              <Skeleton className="w-full h-full rounded-[32px]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const content = aboutData?.data?.bs;
  const introBg = getImageUrl(content?.intro_bg);
  const videoId = getYoutubeId(content?.intro_section_video_link || "");

  const displayHighlights = highlights.length > 0 ? highlights.slice(0, 4) : [
    "Forged Document Examination",
    "Handwriting Examination",
    "Signature Verification",
    "Fingerprint Comparison"
  ];

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-10">

        {error && (
          <div className="mb-6 text-center text-xs text-red-400 opacity-50">
            Note: {error}. Using fallback data.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT CONTENT */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-2">
              <p className="text-[#04063E] font-semibold text-[18px] mb-2">
                {content?.intro_section_title || "Forensic laboratory where"}
              </p>
              <h2 className="text-4xl md:text-[36px] font-bold text-black leading-tight">
                {content?.intro_section_text || "Efficiency Meets the Finest Forensic Expertise"}
              </h2>
            </div>

            {/* ONLY first 3 paragraphs - NO Mission/Vision/Purpose */}
            <div className="text-[#868686] leading-relaxed text-[16px] space-y-2">
              {introParagraphs ? (
                <p>{introParagraphs}</p>
              ) : (
                <>
                  <p>Since 2006, SIFS India has led the way in forensic science. This top forensic laboratory is registered with the Government of India and holds ISO 9001:2015 and 10002:2014 certifications.</p>
                  <p>Despite the initial hurdles, SIFS India, guided by a positive and dedicated approach to clients and adherence to Indian law and order, successfully carved a niche in the field of forensics. The company achieved acknowledgement not only from onshore but also from offshore clients.</p>
                  <p>The journey reflects the continuous efforts of Dr. Ranjeet Singh (CEO and founder), showcasing the company's commitment to delivering qualitative forensic expert services across several domains.</p>
                </>
              )}
            </div>

            {/* Highlights Points */}
            <div className="grid grid-cols-1 gap-2">
              {displayHighlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group mb-3">
                  <div className="relative w-6 h-6">
                    <img 
                      src="/orange-check.png" 
                      alt="check"
                      className="object-contain"
                    />
                  </div>
                  <span className="font-regular text-[16px] text-black group-hover:text-sifs-orange transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative flex items-center gap-6 pt-2">
              <button
                className="bg-gradient-to-r from-[#0B10A4] to-[#04063E]
                          text-white px-8 py-3 rounded-full font-bold md:text-[18px]
                          flex items-center gap-4 hover:shadow-xl transition-all group"
                onClick={() => {
                  if (content?.intro_section_button_url) {
                    window.location.href = content.intro_section_button_url;
                  }
                }}
              >
                {content?.intro_section_button_text || "Read More"}
                <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="absolute hidden md:block relative w-[80px] h-[50px] top-[20px]">
                <img
                  src="/drawn-arrow.png"
                  alt="decorative arrow"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE - NO TEXT */}
          <div className="relative group animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="relative rounded-[32px] overflow-hidden shadow-xs aspect-[4/3]">
              <img
                src={introBg}
                alt="Forensic Science Intro"
                className="object-cover transition-transform duration-700 group-hover:scale-105 w-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-all">
                <button
                  className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center text-[#1A365D] shadow-2xl hover:scale-110 hover:bg-white transition-transform"
                  onClick={() => setShowVideo(true)}
                >
                  <Play size={32} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#414264e6]/90 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
        >
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10"
          >
            <X size={28} />
          </button>

          <div
            className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {videoId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Intro Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                Video not available
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutIntro;