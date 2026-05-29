// components/common/MegaMenu.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MenuCategory, getMenuData } from '@/services/menuService';

interface MegaMenuProps {
  trigger: React.ReactNode;
}

export default function MegaMenu({ trigger }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMenuData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMenuData();
        
        if (!data || data.length === 0) {
          setError("No services available");
        } else {
          setCategories(data);
          if (data.length > 0) {
            setActiveCategory(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load menu:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    }
    loadMenuData();
  }, []);

  // Handle hover with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="relative">
        <Link to="/services" className="flex items-center gap-1 cursor-pointer py-2 text-lg md:text-[16px] font-normal text-black hover:text-[#F68A07] transition-colors">
          {trigger}
          <ChevronDown size={16} className="text-gray-400" />
        </Link>
        {isOpen && (
          <div className="absolute left-0 top-full mt-2 w-[800px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
            <div className="flex h-[460px]">
              <div className="w-1/3 bg-gray-50 border-r border-gray-100 p-4 space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
              <div className="flex-1 p-5 space-y-4">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-100 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <Link to="/services" className="relative group">
        <div className="flex items-center gap-1 cursor-pointer py-2 text-lg md:text-[16px] font-regular text-black hover:text-[#F68A07] transition-colors">
          {trigger}
          <ChevronDown size={16} />
        </div>
      </Link>
    );
  }

  return (
    <div 
      className="relative"
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button - Clickable to /services, hover opens mega menu */}
      <Link 
        to="/services"
        className="flex items-center gap-1 cursor-pointer hover:text-[#F68A07] py-2 transition-colors text-lg md:text-[16px] font-regular text-black"
      >
        {trigger}
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Link>

      {/* Mega Menu Dropdown */}
      {isOpen && categories.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-[800px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex h-[460px]">
            {/* Left Side - Categories */}
            <div className="w-1/3 bg-gray-50 border-r border-gray-100 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-5 py-3 transition-all group ${
                    activeCategory === category.id
                      ? 'bg-white text-[#0B10A4] md:text-[14px] font-regular border-l-4 border-[#0B10A4] shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 md:text-[14px] font-regular hover:border-l-4 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-md">{category.name}</div>
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`transition-all duration-200 ${
                        activeCategory === category.id 
                          ? 'text-[#0B10A4] opacity-100 translate-x-0' 
                          : 'text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Right Side - Services for Active Category */}
            <div className="flex-1 bg-white overflow-y-auto p-5">
              {activeCategory && (() => {
                const currentCategory = categories.find(c => c.id === activeCategory);
                if (!currentCategory) return null;
                
                return (
                  <>
                    <div className="mb-4 pb-3 border-b border-gray-100">
                      <h3 className="text-lg md:text-[14px] font-bold text-[#04063E]">
                        {currentCategory.name}
                      </h3>
                      {currentCategory.short_text && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {currentCategory.short_text}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {currentCategory.services.map((service) => (
                        <Link
                          key={service.id}
                          to={`/service/${service.slug}`}  // ✅ CHANGED: removed category, using /service/:slug
                          onClick={() => setIsOpen(false)}
                          className="group block p-3 rounded-lg hover:bg-[#F5F7FF] transition-all duration-200 hover:shadow-sm"
                        >
                          <div className="text-lg md:text-[14px] font-medium text-gray-700 group-hover:text-[#0B10A4] transition-colors line-clamp-1">
                            {service.title}
                          </div>
                          <div className="text-[12px] text-gray-400 mt-0.5 group-hover:text-[#F68A07] transition-colors">
                            Learn More →
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    {currentCategory.services.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <Link
                          to="/services"  // ✅ CHANGED: removed category, goes to main services page
                          onClick={() => setIsOpen(false)}
                          className="text-xs font-semibold text-[#0B10A4] hover:text-[#F68A07] transition-colors flex items-center gap-1 group"
                        >
                          View All {currentCategory.services.length} Services
                          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}