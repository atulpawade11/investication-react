import React, { useEffect, useState } from 'react';
import PageBanner from '@/components/common/PageBanner';
import ServiceSidebar from '@/components/services/ServiceSidebar';
import QueryForm from '@/components/services/QueryForm';
import ServiceDetailContent from '@/components/services/ServiceDetailContent';
import FAQAccordion from '@/components/services/FAQAccordion';
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';

interface Props {
  categorySlug: string;
  serviceSlug: string;
}

export default function ServiceDetailClient({ categorySlug, serviceSlug }: Props) {
  const [detailData, setDetailData] = useState<any>(null);
  const [sidebarData, setSidebarData] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const { breadcrumbImage } = useBoot();

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
  
        // 1. Fetch ALL services data (for sidebar - needs categories AND all services)
        const allServicesRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/services`);
        const allServicesResult = await allServicesRes.json();
  
        // Store COMPLETE data for sidebar (has categories AND all services)
        if (allServicesResult?.success && allServicesResult?.data) {
          setSidebarData(allServicesResult.data);
        }
  
        let foundCategoryName = "";
        let foundCategoryId = null;
  
        // 2. Find the current category from the complete categories list
        if (allServicesResult?.success && allServicesResult?.data?.categories) {
          const categories = allServicesResult.data.categories;
          const cleanCatSlug = decodeURIComponent(categorySlug).toLowerCase().replace(/[^a-z0-9]/g, '');
  
          const foundCat = categories.find((c: any) => {
            const apiName = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return apiName.includes(cleanCatSlug) || cleanCatSlug.includes(apiName);
          });
  
          if (foundCat) {
            foundCategoryName = foundCat.name;
            foundCategoryId = foundCat.id;
          }
        }
  
        // 3. Fetch specific service detail
        const detailRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/service/${serviceSlug}`);
        const detailResult = await detailRes.json();
  
        if (detailResult?.success && detailResult?.data?.service) {
          setDetailData({
            ...detailResult.data.service,
            category_name: detailResult.data.service.category_name || foundCategoryName || "Service",
            pccqueries: detailResult.data.pccqueries || []
          });
        }
  
        // 4. DON'T overwrite sidebarData with filtered results
        // The sidebar needs ALL categories and ALL services to work properly
        
      } catch (err) {
        console.error("Detail Page Error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (categorySlug && serviceSlug) loadDetail();
  }, [categorySlug, serviceSlug]);

  // --- SERVICE DETAIL SKELETON ---
  const ServiceDetailSkeleton = () => (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Banner Skeleton */}
      <div className="w-full h-[300px] bg-gray-200 animate-pulse flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-6 w-40 bg-gray-300" />
        <Skeleton className="h-10 w-80 bg-gray-300" />
      </div>

      <div className="container mx-auto px-4 md:px-10 py-16 relative">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Skeleton */}
          <aside className="lg:w-1/3 xl:w-1/4 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full rounded-2xl" /> {/* Sidebar box */}
              <Skeleton className="h-[300px] w-full rounded-2xl" /> {/* Form box */}
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="lg:w-2/3 xl:w-3/4">
            <div className="bg-white p-6 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 space-y-8">
              <Skeleton className="w-full aspect-video rounded-2xl" /> {/* Featured Image */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" /> {/* Title placeholder */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="pt-12 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );

  if (loading) return <ServiceDetailSkeleton />;

  if (!detailData) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-[#04063E]">Investigation Not Found</h2>
      <p className="text-gray-500 mt-2">The requested forensic service could not be located.</p>
    </div>
  );

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageBanner
        title={detailData.category_name || "Investigation Service"}
        subtitle={detailData.title}
        breadcrumbImage={breadcrumbImage}
      />
      <div className="container
       mx-auto px-4 md:px-10 py-16 relative">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-8">
            <div className="sticky top-28">
              {/* Updated this to use sidebarData instead of undefined data */}
              <ServiceSidebar apiData={sidebarData} />
              <div className="mt-8">
                <QueryForm serviceTitle={detailData?.title} />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="bg-white p-6 md:p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100">
              <ServiceDetailContent apiData={detailData} />
            </div>
          </main>
        </div>
        <div className="mt-12 pt-4 border-t border-gray-100">
          {/* <h4 className="text-xl font-bold text-[#04063E] mb-6">Forensic Examination Enquiries</h4> */}
          <FAQAccordion apiFaqs={detailData.pccqueries} />
        </div>
      </div>
    </div>
  );
}