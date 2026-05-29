import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation, NavLink } from "react-router-dom";
import { ChevronRight, Plus, Minus, Search } from 'lucide-react';
import { Link } from "react-router-dom";
import { API_BASE_URL } from '@/lib/config';

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

interface SidebarProps {
  apiData?: any;
}

export default function ServiceSidebar({ apiData }: SidebarProps) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Get current service slug from params (2-step URL)
  const currentServiceSlug = params.slug as string;

  // Memoized function to find which category contains the current service
  const getCurrentCategorySlug = useMemo(() => {
    if (!currentServiceSlug || allServices.length === 0 || categories.length === 0) {
      return null;
    }
    
    // Find the current service
    const currentService = allServices.find(s => s.slug === currentServiceSlug);
    if (!currentService) return null;
    
    // Find the category that contains this service
    const parentCategory = categories.find(cat => cat.id === currentService.scategory_id);
    if (!parentCategory) return null;
    
    return slugify(parentCategory.name);
  }, [currentServiceSlug, allServices, categories]);

  // Set open category based on current service
  useEffect(() => {
    if (getCurrentCategorySlug) {
      setOpenCategory(getCurrentCategorySlug);
    }
  }, [getCurrentCategorySlug]);

  // Fetch ALL data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const firstRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/services?page=1`);
      const firstData = await firstRes.json();
      
      if (firstData.success && firstData.data) {
        setCategories(firstData.data.categories || []);
        
        let allServicesList = [...(firstData.data.data || [])];
        const totalPages = firstData.data.pagination?.total_pages || 1;
        
        for (let page = 2; page <= totalPages; page++) {
          const pageRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/services?page=${page}`);
          const pageData = await pageRes.json();
          
          if (pageData.success && pageData.data) {
            allServicesList = [...allServicesList, ...(pageData.data.data || [])];
          }
        }
        
        setAllServices(allServicesList);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (slug: string) => {
    setOpenCategory(openCategory === slug ? null : slug);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const performSearch = () => {
    if (!searchQuery.trim()) return;

    const serviceCategoryMap: any[] = [];
    
    categories.forEach((cat: any) => {
      const catSlug = slugify(cat.name);
      
      const categoryServices = allServices.filter(
        (s: any) => String(s.scategory_id) === String(cat.id)
      );
      
      categoryServices.forEach((service: any) => {
        serviceCategoryMap.push({
          serviceId: service.id,
          serviceTitle: service.title,
          serviceSlug: service.slug,
          categoryId: cat.id,
          categoryName: cat.name,
          categorySlug: catSlug,
        });
      });
    });

    const query = searchQuery.toLowerCase().trim();
    const results = serviceCategoryMap.filter(item => 
      item.serviceTitle.toLowerCase().includes(query)
    );

    const uniqueCategories = results.reduce((acc: any[], current) => {
      const exists = acc.find(item => item.categoryId === current.categoryId);
      if (!exists) {
        acc.push({
          categoryId: current.categoryId,
          categoryName: current.categoryName,
          categorySlug: current.categorySlug,
          matchingServices: results.filter(r => r.categoryId === current.categoryId).length
        });
      }
      return acc;
    }, []);

    setSearchResults(uniqueCategories);
    setShowSearchResults(true);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const handleSearchClick = () => {
    performSearch();
  };

  const navigateToCategory = (categorySlug: string) => {
    navigate(`/services`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">

        {/* Search Results */}
        {showSearchResults && (
          <div className="border-b border-gray-100">
            <div className="p-4 bg-blue-50/50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-[#044782]">
                  Matching Categories ({searchResults.length})
                </h3>
                <button 
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery("");
                  }}
                  className="text-xs text-gray-500 hover:text-[#044782]"
                >
                  Clear
                </button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {searchResults.map((category) => (
                    <button
                      key={category.categoryId}
                      onClick={() => navigateToCategory(category.categorySlug)}
                      className="w-full text-left p-3 bg-white rounded-lg hover:shadow-md transition-all border border-gray-100 hover:border-[#044782]/20 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm text-gray-800 group-hover:text-[#044782]">
                          {category.categoryName}
                        </div>
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-[#044782]" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {category.matchingServices} matching {category.matchingServices === 1 ? 'service' : 'services'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-white rounded-lg">
                  <p className="text-gray-400 text-sm">No services found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="max-h-[55vh] overflow-y-auto scrollbar-hide">
          {categories.map((cat: any) => {
            const catSlug = slugify(cat.name);
            const isExpanded = openCategory === catSlug;
            const isActiveCategory = getCurrentCategorySlug === catSlug;

            // Get services for this category
            const categoryServices = allServices.filter(
              (service: any) => String(service.scategory_id) === String(cat.id)
            );

            return (
              <div key={cat.id} className="border-b last:border-0 border-gray-100">
                <button
                  onClick={() => toggleCategory(catSlug)}
                  className="w-full flex justify-between items-center p-4 text-[16px] font-medium text-gray-800 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className={isActiveCategory ? "text-[#00467A]" : "text-gray-800"}>
                    {cat.name}
                  </span>     
                  {categoryServices.length > 0 && (
                    isExpanded
                      ? (
                        <span className="w-5 h-5 border border-[#DADADA] rounded-md flex items-center justify-center">
                          <Minus size={12} className="text-[#F68A07]" />
                        </span>
                      )
                      : (
                        <span className="w-5 h-5 border border-[#DADADA] rounded-md flex items-center justify-center">
                          <Plus size={12} className="text-gray-400" />
                        </span>
                      )
                  )}
                </button>

                {isExpanded && categoryServices.length > 0 && (
                  <div className="px-3 pb-4 space-y-2 bg-gray-50/30">
                    {categoryServices.map((service: any) => {
                      const servicePath = `/service/${service.slug}`;
                      const isActive = currentServiceSlug === service.slug;
                      
                      return (
                        <Link
                          key={service.id}
                          to={servicePath}
                          className={`flex justify-between items-center px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 text-left w-full
                            ${isActive 
                              ? "bg-[#00467A] text-white" 
                              : "bg-white text-gray-600 hover:bg-gray-50 hover:text-[#00467A] border border-gray-100"
                            }`}
                        >
                          {service.title}
                          <ChevronRight 
                            size={14} 
                            className={isActive ? "text-white" : "text-gray-400"}
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search + CTA */}
      <div className="bg-white p-5 space-y-5 mt-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex rounded-md overflow-hidden border border-gray-200">
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="flex-1 px-4 py-3 text-sm outline-none bg-white"
          />
          <button 
            onClick={handleSearchClick}
            className="bg-gray-900 text-white px-4 flex items-center justify-center hover:bg-black transition-colors"
          >
            <Search size={18} />
          </button>
        </div>

        <div className="flex gap-3">
          <Link
            to="/submit-case"
            className="flex items-center justify-center text-sm bg-gradient-to-r from-[#0B10A4] to-[#04063E] text-white px-3 py-2 rounded-md font-bold hover:from-[#1217c0] hover:to-[#0a0f6b]"
          >
            Submit Case
          </Link>
          <Link
            to="/sample-report"
            className="flex-1 text-center bg-gray-900 text-white font-semibold text-sm py-3 rounded-md hover:bg-black"
          >
            Sample Report
          </Link>
        </div>
      </div>
    </div>
  );
}