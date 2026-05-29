// components/common/DepartmentMegaMenu.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Building2, Microscope, Briefcase, Shield } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sub_departments?: any[];
}

interface DepartmentMegaMenuProps {
  trigger: React.ReactNode;
  departments: Department[];
  type: 'department' | 'laboratory';
}

export default function DepartmentMegaMenu({ trigger, departments, type }: DepartmentMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // Fix: Use undefined as initial value
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const getIcon = (index: number) => {
    const icons = [Building2, Microscope, Briefcase, Shield];
    const Icon = icons[index % icons.length];
    return <Icon size={18} className="text-[#0B10A4]" />;
  };

  const title = type === 'department' ? 'Departments' : 'Laboratories';
  const description = type === 'department' 
    ? 'Explore our specialized departments' 
    : 'State-of-the-art forensic laboratories';

  if (!departments.length) return null;

  return (
    <div 
      className="relative"
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-1 cursor-pointer hover:text-[#F68A07] py-2 transition-colors">
        {trigger}
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[500px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-5">
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#04063E]">{title}</h3>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>

            {/* Departments/Laboratories Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {departments.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/${type}/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[#F5F7FF] transition-all duration-200"
                >
                  <div className="mt-0.5">
                    {getIcon(index)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 group-hover:text-[#0B10A4] transition-colors">
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                        {item.description}
                      </div>
                    )}
                    {item.sub_departments && item.sub_departments.length > 0 && (
                      <div className="text-[10px] text-[#F68A07] mt-1">
                        {item.sub_departments.length} sub-departments
                      </div>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>

            {/* Footer Link */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link
                to={`/${type}`}
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-[#0B10A4] hover:text-[#F68A07] transition-colors flex items-center gap-1 group"
              >
                View All {title}
                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}