import React from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface ServiceDetailContentProps {
  apiData: any;
}

export default function ServiceDetailContent({ apiData }: ServiceDetailContentProps) {
  const [showVideo, setShowVideo] = React.useState(false);

  if (!apiData) {
    return <div className="py-20 text-center text-gray-400 italic">Select an investigation service to view details.</div>;
  }

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(apiData.youtubelink);

  // More robust HTML parser
  const parseContent = (html: string) => {
    if (!html) return { mainContent: '', servicesList: [] };
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    let mainContent = '';
    let servicesList: { title: string; description: string }[] = [];
    
    const serviceHeadingPatterns = [
      'Services Our Organization Provides',
      'Services Our Organization Provide',
      'Service Our Organization Provides',
      'Services Our Organization Offers',
      'Guidelines for Availing Our Services',
      'Our Organization Provides',
    ];
    
    const allElements = Array.from(tempDiv.children);
    let servicesSectionStartIndex = -1;
    
    // Find the services heading
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      const elementText = element.textContent?.trim() || '';
      
      const isHeading = serviceHeadingPatterns.some(pattern => 
        elementText.toLowerCase().includes(pattern.toLowerCase())
      );
      
      if (isHeading) {
        servicesSectionStartIndex = i;
        break;
      }
    }
    
    // If no services section found, return all content
    if (servicesSectionStartIndex === -1) {
      return { mainContent: html, servicesList: [] };
    }
    
    // Everything BEFORE the heading is main content
    for (let i = 0; i < servicesSectionStartIndex; i++) {
      mainContent += allElements[i].outerHTML;
    }
    
    // Process elements AFTER the heading for services
    for (let i = servicesSectionStartIndex + 1; i < allElements.length; i++) {
      const element = allElements[i];
      const tagName = element.tagName.toLowerCase();
      const elementText = element.textContent?.trim() || '';
      
      // Stop if we hit another heading (H1-H6)
      if (tagName.match(/^h[1-6]$/)) {
        // Add remaining content including this heading
        for (let j = i; j < allElements.length; j++) {
          mainContent += allElements[j].outerHTML;
        }
        break;
      }
      
      // Check if this is a service paragraph (plain p tag, not empty)
      if (tagName === 'p' && elementText.length > 0) {
        // Check if it has a colon (title: description pattern)
        const colonIndex = elementText.indexOf(':');
        
        if (colonIndex > 0 && colonIndex < 100) { // Reasonable title length
          // Extract title and description
          let title = elementText.substring(0, colonIndex).trim();
          let description = elementText.substring(colonIndex + 1).trim();
          
          // Clean up title (remove any leftover formatting)
          title = title.replace(/<[^>]*>/g, '').trim();
          
          servicesList.push({ title, description });
        } else {
          // No colon found, treat the whole thing as title
          servicesList.push({ 
            title: elementText, 
            description: '' 
          });
        }
      }
      // Handle p tags with strong/b elements (like your other services have)
      else if (tagName === 'p') {
        const strongEl = element.querySelector('strong, b');
        if (strongEl) {
          let title = strongEl.textContent?.replace(':', '').trim() || '';
          let description = element.innerHTML.replace(strongEl.outerHTML, '').replace(':', '').trim();
          if (title) {
            servicesList.push({ title, description });
          }
        }
      }
      // Handle div containers with service items
      else if (tagName === 'div') {
        const serviceItems = Array.from(element.children);
        for (const item of serviceItems) {
          if (item.tagName.toLowerCase() === 'p') {
            const itemText = item.textContent?.trim() || '';
            const colonIndex = itemText.indexOf(':');
            
            if (colonIndex > 0) {
              let title = itemText.substring(0, colonIndex).trim();
              let description = itemText.substring(colonIndex + 1).trim();
              servicesList.push({ title, description });
            } else if (itemText) {
              servicesList.push({ title: itemText, description: '' });
            }
          }
        }
      }
      // Handle standard ul/li lists (your fallback)
      else if (tagName === 'ul') {
        const listItems = Array.from(element.querySelectorAll('li'));
        servicesList = listItems.map(li => ({
          title: li.textContent?.trim() || '',
          description: ''
        }));
      }
    }
    
    // Clean up main content
    mainContent = mainContent
      .replace(/<h4[^>]*>.*?Services.*?Our Organization Provides.*?<\/h4>/gi, '')
      .replace(/<strong[^>]*>.*?Services.*?Our Organization Provides.*?<\/strong>/gi, '')
      .replace(/<p[^>]*>.*?Services.*?Our Organization Provides.*?<\/p>/gi, '');
    
    return { mainContent, servicesList };
  };

  const { mainContent, servicesList } = parseContent(apiData.content || '');

  return (
    <div className="space-y-8">
      {/* 1. Dynamic Hero Image */}
      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-100 bg-gray-50 group">
        {apiData.featured_image && (
          <div className="absolute top-6 left-6 z-10 w-20 h-20 md:w-28 md:h-28 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-2xl transition-transform duration-500 hover:rotate-3">
            <img
              src={apiData.featured_image}
              alt="Featured Badge"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <img
          src={apiData.main_image}
          alt={apiData.title}
          className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>

      {/* 2. Title and Main Content */}
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          {/*<div className="inline-block bg-blue-50 text-[#044782] text-[14px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {apiData.category_name}
          </div> */}
          {apiData.youtubelink && (
            <button
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-2 bg-[#FF0000]/10 text-[#FF0000] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest hover:bg-[#FF0000] hover:text-white transition-all duration-300 group border border-[#FF0000]/20 shadow-sm"
            >
              <span className="w-5 h-5 flex items-center justify-center bg-[#FF0000] rounded-full group-hover:bg-white transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white group-hover:text-[#FF0000]">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </span>
              Watch Video
            </button>
          )}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#04063E] tracking-tight">
          {apiData.title}
        </h2>

        {/* Main Content (before Services section) */}
        {mainContent && (
          <div
            className="api-content text-gray-600 text-[16px] leading-[1.8] font-medium prose prose-slate max-w-none
            [&>p]:mb-4 [&>b]:text-[#04063E] [&>ul]:list-disc [&>ul]:ml-5 gap-2"
            dangerouslySetInnerHTML={{ __html: mainContent }}
          />
        )}
      </div>

      {/* 3. Services Slider Section - Only show if services exist */}
      {servicesList.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl md:text-[22px] font-medium text-[#000000] mb-8">
            Services Our Organization Provides:
          </h3>
          
          <div className="relative px-3">
            {/* Custom Navigation Buttons */}
            <button className="service-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-[#00467A] hover:text-white hover:border-[#00467A] transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="service-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-[#00467A] hover:text-white hover:border-[#00467A] transition-all">
              <ChevronRight size={20} />
            </button>

            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                prevEl: '.service-prev',
                nextEl: '.service-next',
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="!pb-2"
            >
              {servicesList.map((service, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white rounded-2xl p-6 border border-[#D9D9D9] shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col min-h-[200px]">
                    {/* Service Number */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-sm md:text-[28px] font-bold text-[#000000]">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </div>
                    
                    {/* Service Title */}
                    <h4 className="text-lg md:text-[20px] font-medium text-[#000000] mb-3">
                      {service.title}
                    </h4>
                    
                    {/* Service Description */}
                    {service.description && (
                      <div 
                        className="text-[#525252] text-sm md:text-[13px] font-medium leading-relaxed flex-1"
                        dangerouslySetInnerHTML={{ __html: service.description }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#414264e6]/90 backdrop-blur-sm transition-all duration-500">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 hover:rotate-90"
          >
            <X size={28} />
          </button>

          <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative bg-black">
            {videoId ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Forensic Service Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-white text-xl font-bold italic">
                Video not available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}