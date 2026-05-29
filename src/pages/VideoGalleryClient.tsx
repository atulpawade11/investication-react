import React, { useState, useEffect } from 'react';
import PageBanner from '@/components/common/PageBanner';
import { Play, X, ChevronUp, ArrowRight } from "lucide-react";
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';

interface VideoItem {
  id: number;
  title: string;
  video_url: string;
  video_id: string;
  gallery_image: string;
}

export default function VideoGalleryClient() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const initialCount = 6; 
  const [displayCount, setDisplayCount] = useState(initialCount);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const { breadcrumbImage } = useBoot();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/video-gallery`);
        const result = await response.json();
        if (result.success) {
          setVideos(result.data.videos);
        }
      } catch (error) {
        console.error("Error fetching video gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // HELPER: To get fallback thumbnail directly from YouTube if API image is missing
  const getFallbackThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const hasMore = displayCount < videos.length;
  const canShowLess = displayCount > initialCount;

  // --- SKELETON LOADING STATE ---
  const VideoSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col space-y-4">
          <Skeleton className="aspect-[16/9] w-full rounded-xl" />
          <div className="px-1 space-y-2">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-2/3 mx-auto rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <PageBanner
        title="Our Legacy : Achieving Excellence and Joy"
        subtitle="Our Gallery"
        isGallery={true} 
        breadcrumbImage={breadcrumbImage}
      />

      <div className="relative bg-[#FFFFFF] py-16">
        <section className="mx-auto container px-4">
          
          {loading ? (
            <VideoSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.slice(0, displayCount).map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col group cursor-pointer" 
                  onClick={() => setSelectedVideo(item)}
                >
                  {/* Video Thumbnail Container */}
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-900 shadow-lg border border-gray-100">
                    <img 
                      src={
                        item.gallery_image && item.gallery_image.trim() !== ""
                          ? item.gallery_image.replace("http://", "https://") 
                          : getFallbackThumbnail(item.video_id)
                      } 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getFallbackThumbnail(item.video_id);
                      }}
                    />
                    
                    {/* Dark Overlay for better button contrast */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#0D1189] text-white rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:bg-[#F68A07]">
                        <Play size={28} fill="currentColor" className="ml-1" />
                      </div>
                    </div>

                    {/* Visual Tag */}
                    {/*<div className="absolute top-4 left-4">
                       <span className="bg-white/90 backdrop-blur-sm text-[#04063E] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                         Forensic View
                       </span>
                    </div>*/}
                  </div>

                  {/* Title Section */}
                  <div className="mt-5 px-2 text-center">
                    <h3 className="font-bold text-[#04063E] text-base md:text-lg line-clamp-2 group-hover:text-[#F68A07] transition-colors leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && videos.length > initialCount && (
            <div className="flex justify-center gap-4 mt-16">
              {hasMore ? (
                <button 
                  onClick={() => setDisplayCount(prev => prev + 3)}
                  className="flex items-center gap-3 bg-gradient-to-r from-[#1C274C] to-[#0D1189]
                  text-white px-8 py-3 rounded-full font-semibold text-base
                  hover:from-[#242f58] hover:to-[#1418a3]
                  transition-all shadow-lg hover:shadow-xl"
                >
                  Load More Videos <ArrowRight size={20} />
                </button>
              ) : canShowLess && (
                <button 
                  onClick={() => {
                    setDisplayCount(initialCount);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-3 bg-gradient-to-r from-[#1C274C] to-[#0D1189]
                  text-white px-8 py-3 rounded-full font-semibold text-base
                  hover:from-[#242f58] hover:to-[#1418a3]
                  transition-all shadow-lg hover:shadow-xl"
                >
                  Show Less <ChevronUp size={20} />
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* YouTube Modal Overlay */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-in fade-in duration-300"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="w-full max-w-5xl aspect-video relative bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-5 right-5 z-50 text-white bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-[#F68A07] transition-all shadow-xl"
            >
              <X size={28} />
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.video_id}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}