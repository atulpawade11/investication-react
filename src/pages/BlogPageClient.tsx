// src/pages/BlogPageClient.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageBanner from '@/components/common/PageBanner';
import BlogLayout from '@/components/blog/BlogLayout/index';
import { useBoot } from '@/context/BootContext';

export default function BlogPageClient() {
  const { breadcrumbImage } = useBoot();
  const [searchParams] = useSearchParams();
  const [initialCategory, setInitialCategory] = useState<string>("All");
  
  // Get category from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== 'All') {
      setInitialCategory(categoryParam);
    }
  }, [searchParams]);

  return (
    <div className="bg-white min-h-screen">
      <PageBanner
        title="Latest News & Blog"
        subtitle="Forensic Discoveries: From Lab to Field"
        isGallery={true} 
        breadcrumbImage={breadcrumbImage}
      />
      
      <section className="py-12 bg-gray-50">
        <div className="mx-auto container px-4">
          <BlogLayout initialCategory={initialCategory} />
        </div>
      </section>
    </div>
  );
}