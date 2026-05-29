// components/department/HeroSection.tsx
import React from 'react';

interface HeroProps {
  title?: string;
  description?: string;
  image?: string | null;
}

export default function HeroSection({ title, description, image }: HeroProps) {
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* Left Side - Image */}
          <div className="order-1">
            <img 
              src={"/department/department1.png"}
              alt="Forensic Investigation"
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>

          {/* Right Side - Text Content */}
          <div className="order-2">
            {/* Title with orange left border */}
            <h1 className="text-3xl md:text-[30px] font-semibold text-black leading-tight mb-6">
              {title || "Deciphering Truths, Unlocking Mysteries, and Securing Justice"}
            </h1>
            
            {/* Description */}
            {description && (
              <div 
                className="text-[#525252] leading-relaxed text-base font-medium md:text-[18px]
                  [&>p]:mb-4 [&>p]:text-justify"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}