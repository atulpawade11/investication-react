import React, { useEffect, useState, useCallback, useRef } from 'react';
import PageBanner from '@/components/common/PageBanner';
import CareerFilters from '@/components/career/CareerFilters';
import JobList from '@/components/career/JobList';
import LoadMoreButton from '@/components/career/LoadMoreButton';
import CareerFAQSection from '@/components/career/CareerFAQSection';
import DownloadsSlider from '@/components/common/DownloadsSlider';
import { API_BASE_URL } from '@/lib/config';
import { Loader2 } from "lucide-react";
import { useBoot } from '@/context/BootContext';

export default function CareerClient({ initialData }: { initialData: any }) {
  const [careerData, setCareerData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(4);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { breadcrumbImage } = useBoot();
  const isFirstRender = useRef(true);
  // Add ref to track categories to avoid dependency issues
  const categoriesRef = useRef(careerData?.jcats);

  // Update ref when careerData changes
  useEffect(() => {
    categoriesRef.current = careerData?.jcats;
  }, [careerData?.jcats]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCareers = useCallback(async (isFilterChange: boolean = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      
      // Use ref instead of careerData to avoid dependency
      if (category !== "All" && categoriesRef.current) {
        const selectedCat = categoriesRef.current.find((c: any) => c.name === category);
        if (selectedCat) params.append('category', selectedCat.id.toString());
      }

      const url = `${API_BASE_URL}/InvestigationServices/Website/front/career/?${params.toString()}`;

      const response = await fetch(url, { cache: 'no-store' });
      const json = await response.json();

      if (json.success) {
        setCareerData(json.data);
        if (isFilterChange) setVisible(4);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]); // Remove careerData dependency

  useEffect(() => {
    // Skip fetching on mount because we have initialData from the server
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchCareers(true);
  }, [fetchCareers]);

  // ✅ Safely extract jobs array with multiple fallbacks
  const jobs = Array.isArray(careerData?.data) ? careerData.data : 
               Array.isArray(careerData?.careers) ? careerData.careers : 
               Array.isArray(careerData) ? careerData : [];
  
  const totalFound = jobs.length;

  // Add debug logging
  console.log('CareerClient render:', { 
    hasData: !!careerData, 
    jobsLength: jobs.length,
    loading 
  });

  return (
    <>
      <PageBanner 
        title={careerData?.be?.career_title || "Careers"} 
        subtitle={careerData?.be?.career_subtitle} 
        breadcrumbImage={breadcrumbImage} 
      />
      
      <section className="bg-white py-12">
        <div className="mx-auto container px-4 md:px-10">
          <CareerFilters 
            search={search} 
            setSearch={setSearch} 
            category={category} 
            setCategory={setCategory} 
            categories={["All", ...(careerData?.jcats?.map((c: any) => c.name) || [])]} 
          />
          
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[18px] font-semibold text-black tracking-[1px]">
              All Jobs ({totalFound})
            </p>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          </div>

          <div className={`transition-opacity duration-300 ${loading ? "opacity-40" : "opacity-100"}`}>
            <JobList jobs={jobs.slice(0, visible)} />
            
            {/*{!loading && totalFound === 0 && (
              <div className="py-20 text-center text-gray-400 italic text-sm">
                No positions found.
              </div>
            )}*/}
          </div>

          <LoadMoreButton 
            canLoadMore={visible < totalFound} 
            canLoadLess={visible > 4}
            onLoadMore={() => setVisible(prev => prev + 4)} 
            onLoadLess={() => setVisible(4)}
          />
        </div>
      </section>
      
      <CareerFAQSection />
      <DownloadsSlider />
    </>
  );
}