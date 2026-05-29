// components/common/MobileMegaMenu.tsx
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { MenuCategory, getMenuData } from '@/services/menuService';

interface MobileMegaMenuProps {
  onClose?: () => void;
}

export default function MobileMegaMenu({ onClose }: MobileMegaMenuProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        }
      } catch (err) {
        console.error("Failed to load mobile menu:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    }
    loadMenuData();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-500 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 text-xs text-[#0B10A4] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty State
  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">No services available</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <div key={category.id} className="border-b border-gray-100 last:border-0">
          <button
            onClick={() => toggleCategory(category.id)}
            className="flex justify-between items-center w-full py-4 px-2 text-left hover:bg-gray-50 transition-colors rounded-lg"
          >
            <div>
              <span className="font-semibold text-gray-800">{category.name}</span>
              <span className="ml-2 text-xs text-gray-400">
                ({category.services.length})
              </span>
              {category.short_text && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                  {category.short_text}
                </p>
              )}
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 text-gray-400 ${
                expandedCategory === category.id ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedCategory === category.id && (
            <div className="pl-4 pb-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {category.services.map((service) => (
                <Link
                  key={service.id}
                  // ✅ CHANGED: removed category ID, now using /service/:slug
                  to={`/service/${service.slug}`}
                  onClick={onClose}
                  className="block py-2.5 px-3 text-sm text-gray-600 hover:bg-[#F5F7FF] hover:text-[#0B10A4] rounded-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span>{service.title}</span>
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-[#0B10A4]" />
                  </div>
                </Link>
              ))}
              
              {/* View All Link - ✅ CHANGED: now goes to main services page */}
              <Link
                to="/services"
                onClick={onClose}
                className="block py-2.5 px-3 text-xs font-semibold text-[#0B10A4] hover:bg-[#F5F7FF] rounded-lg transition-all mt-2"
              >
                View All {category.services.length} Services →
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}