import React, { useEffect, useState } from 'react';
import PageBanner from '@/components/common/PageBanner';
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';

export default function SketchCopProductClient({ slug }: { slug: string }) {
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { breadcrumbImage } = useBoot();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/InvestigationServices/Website/front/product/${slug}`
        );
        const json = await response.json();

        if (json.success && json.data?.page) {
          setProductData(json.data.page);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // --- PRODUCT SKELETON ---
  const ProductSkeleton = () => (
    <div className="bg-white min-h-screen pb-20">
      {/* Banner Skeleton */}
      <div className="w-full h-[300px] bg-gray-100 flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-10 w-80 bg-gray-200" />
        <Skeleton className="h-5 w-60 bg-gray-200" />
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-2">
        {/* Open Item Skeleton (mimicking Main Section) */}
        <div className="border border-gray-200 rounded-sm overflow-hidden">
          <Skeleton className="h-[60px] w-full bg-[#F6BA13]/30" /> {/* Yellow-ish header pulse */}
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <Skeleton className="aspect-video max-w-4xl mx-auto rounded-lg" />
          </div>
        </div>

        {/* Closed Items Skeletons */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-gray-200 rounded-sm overflow-hidden">
            <Skeleton className="h-[60px] w-full bg-gray-50" />
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <ProductSkeleton />;

  if (error || !productData) return <div className="p-20 text-center font-bold">Product Not Found.</div>;

  const embedUrl = `https://www.youtube.com/embed/${productData.video_id}`;

  const sections = [
    { id: 0, title: productData.name, content: productData.body_1, isMain: true },
    { id: 1, title: productData.heading_2, content: productData.body_2, isMain: false },
    { id: 2, title: productData.heading_3, content: productData.body_3, isMain: false },
    { id: 3, title: productData.heading_4, content: productData.body_4, isMain: false },
    { id: 4, title: productData.heading_5, content: productData.body_5, isMain: false },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <PageBanner 
        title={productData.title} 
        subtitle={productData.subtitle} 
        breadcrumbImage={breadcrumbImage} 
      />

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-2">
        {sections.map((section) => {
          if (!section.title) return null;
          const isOpen = openIndex === section.id;

          return (
            <div key={section.id} className="border border-gray-200 rounded-sm overflow-hidden shadow-sm">
              <button 
                className={`w-full flex justify-between items-center p-4 cursor-pointer font-bold transition-colors ${
                  isOpen 
                    ? "bg-[#F6BA13] text-white" // Active/Open tab - Yellow
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300" // All closed tabs - Gray
                }`}
                onClick={() => handleToggle(section.id)}
              >
                <span className="text-lg">{section.title}</span>
                <span className="text-2xl">{isOpen ? "−" : "+"}</span>
              </button>
              
              {isOpen && (
                <div className="p-8 bg-white space-y-8 border-t border-gray-100">
                  <div 
                    className="html-render-zone text-gray-800 prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />

                  {section.isMain && productData.video_id && (
                    <div className="max-w-4xl mx-auto aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                      <iframe 
                        src={embedUrl} 
                        className="w-full h-full border-0" 
                        allowFullScreen 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}