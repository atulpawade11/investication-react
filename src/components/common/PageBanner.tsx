import React from 'react';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  bgImage?: string;
  breadcrumbImage?: string;
  isGallery?: boolean; 
}

export default function PageBanner({
  title,
  subtitle,
  description,
  bgImage,
  breadcrumbImage,
  isGallery = false, 
}: PageBannerProps) {

  const bannerImage = bgImage || breadcrumbImage;

  return (
    <section 
      className="relative w-full min-h-[185px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={bannerImage ? { 
        backgroundImage: `url(${bannerImage})`,
      } : { backgroundColor: '#F5F6F8' }}
    >
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-semibold text-black">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-xs sm:text-sm md:text-[14px] font-regular text-black/80">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="mt-3 text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}