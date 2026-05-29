import React, { useState, useEffect, useCallback, useRef } from 'react';
import PageBanner from '@/components/common/PageBanner';
import { ArrowRight, X, ChevronUp, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';

interface GalleryImage {
  id: number;
  image: string;
  image_url: string;
  gallery_id: number;
}

interface GalleryItem {
  id: number;
  title: string;
  detail: string;
  gallery_image: string;  // Featured image for the card
  images: GalleryImage[];  // Additional images for carousel
}

export default function ImageGalleryClient() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const initialCount = 8;
  const [displayCount, setDisplayCount] = useState(initialCount);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { breadcrumbImage } = useBoot();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/gallery`);
        const result = await response.json();
        if (result.success) {
          setGalleries(result.data.galleries);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Auto-play logic
  const startAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
    if (isAutoPlaying && selectedGallery && selectedGallery.images.length > 1) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % selectedGallery.images.length);
      }, 3000);
    }
  }, [isAutoPlaying, selectedGallery]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (selectedGallery && selectedGallery.images.length > 1) {
      if (isAutoPlaying) {
        startAutoPlay();
      } else {
        stopAutoPlay();
      }
    }
    return () => stopAutoPlay();
  }, [selectedGallery, isAutoPlaying, startAutoPlay, stopAutoPlay]);

  const handleManualImageChange = useCallback((newIndex: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex(newIndex);
    if (isAutoPlaying && selectedGallery && selectedGallery.images.length > 1) {
      stopAutoPlay();
      startAutoPlay();
    }
  }, [isAutoPlaying, selectedGallery, stopAutoPlay, startAutoPlay]);

  const toggleAutoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoPlaying(!isAutoPlaying);
  };

  const hasMore = displayCount < galleries.length;
  const canShowLess = displayCount > initialCount;

  const handleLoadMore = () => setDisplayCount(prev => prev + 4);
  const handleShowLess = () => {
    setDisplayCount(initialCount);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const openModal = (gallery: GalleryItem, index: number = 0) => {
    setSelectedGallery(gallery);
    setCurrentImageIndex(index);
    setIsAutoPlaying(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    if (selectedGallery) {
      const nextIndex = (currentImageIndex + 1) % selectedGallery.images.length;
      handleManualImageChange(nextIndex, e);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    if (selectedGallery) {
      const prevIndex = (currentImageIndex - 1 + selectedGallery.images.length) % selectedGallery.images.length;
      handleManualImageChange(prevIndex, e);
    }
  };

  const GallerySkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="relative space-y-4">
          <Skeleton className="aspect-[16/9] w-full rounded-xl" />
          <div className="absolute bottom-4 left-4 right-12 md:right-24 bg-white p-2 rounded-lg shadow-xl">
             <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
             </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageBanner
        title="Our Legacy : Achieving Excellence and Joy"
        subtitle="Our Gallery"
        isGallery={true}
        breadcrumbImage={breadcrumbImage}
      />

      <div className="relative bg-[#FFFFFF] py-12">
        <section className="mx-auto container px-4">
          
          {loading ? (
            <GallerySkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {galleries.slice(0, displayCount).map((gallery) => (
                <div 
                  key={gallery.id} 
                  className="relative group overflow-hidden cursor-pointer" 
                  onClick={() => openModal(gallery, 0)}
                >
                  <div className="aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 relative">
                    {/* FIXED: Using gallery_image (featured image) for the card thumbnail */}
                    <img 
                      src={gallery.gallery_image?.replace("http://", "https://")} 
                      alt={gallery.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Multi-image indicator badge */}
                    {gallery.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                          <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"></path>
                        </svg>
                        <span>{gallery.images.length}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-12 md:right-24 bg-white p-1 rounded-lg shadow-xl z-20 w-1/2">
                    <div className="border border-[#a9a9a9] p-2 rounded-lg">
                      <h3 className="font-bold text-black text-[18px] mb-1 truncate">
                        {gallery.title}
                      </h3>
                      <p className="text-[14px] font-regular text-[#777777] line-clamp-2 pr-4">{gallery.detail}</p>
                      
                      <div className="absolute -right-4 bottom-0 w-10 h-10 bg-[#0D1189] text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#F68A07] transition-colors">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div className="flex justify-center gap-4 mt-12">
              {hasMore ? (
                <button onClick={handleLoadMore} className="flex items-center gap-3 bg-gradient-to-r from-[#1C274C] to-[#0D1189]
                text-white px-8 py-3 rounded-full font-semibold text-base
                hover:from-[#242f58] hover:to-[#1418a3]
                transition-all shadow-lg hover:shadow-xl">
                  Load More <ArrowRight size={18} />
                </button>
              ) : canShowLess && (
                <button onClick={handleShowLess} className="flex items-center gap-3 bg-gradient-to-r from-[#1C274C] to-[#0D1189]
                text-white px-8 py-3 rounded-full font-semibold text-base
                hover:from-[#242f58] hover:to-[#1418a3]
                transition-all shadow-lg hover:shadow-xl">
                  Show Less <ChevronUp size={18} />
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* MODAL WITH CAROUSEL (only images from the 'images' array) */}
      {selectedGallery && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => {
            stopAutoPlay();
            setSelectedGallery(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full relative shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                stopAutoPlay();
                setSelectedGallery(null);
              }}
              className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-900" />
            </button>

            <div className="flex flex-col">
              {/* Image Carousel Section */}
              <div className="relative bg-gray-900">
                <div className="w-full aspect-video">
                  <img 
                    src={selectedGallery.images[currentImageIndex]?.image_url?.replace("http://", "https://")} 
                    alt={`${selectedGallery.title} - Image ${currentImageIndex + 1}`} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Carousel Controls */}
                {selectedGallery.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    <button 
                      onClick={toggleAutoPlay}
                      className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                    >
                      {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full z-10">
                      {currentImageIndex + 1} / {selectedGallery.images.length}
                    </div>
                    
                    {isAutoPlaying && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 z-10">
                        <div 
                          className="h-full bg-[#25409a] transition-all duration-[3000ms] linear"
                          style={{ width: '100%' }}
                          key={currentImageIndex}
                        />
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pb-2 overflow-x-auto px-4 z-10" style={{ bottom: '60px' }}>
                      {selectedGallery.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => handleManualImageChange(idx, e)}
                          className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                            currentImageIndex === idx ? 'border-[#25409a7] scale-110' : 'border-white/50 hover:border-white'
                          }`}
                        >
                          <img src={img.image_url?.replace("http://", "https://")} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#04063E] mb-3">{selectedGallery.title}</h2>
                <div className="h-1 w-20 bg-[#25409a] mb-4"></div>
                <p className="text-gray-600 leading-relaxed text-[16px] md:text-base">{selectedGallery.detail}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}