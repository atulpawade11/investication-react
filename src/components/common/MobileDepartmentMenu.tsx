// components/common/MobileDepartmentMenu.tsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Building2, Microscope, Briefcase, Shield } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sub_departments?: any[];
}

interface MobileDepartmentMenuProps {
  departments: Department[];
  type: 'department' | 'laboratory';
  onClose?: () => void;
}

export default function MobileDepartmentMenu({ departments, type, onClose }: MobileDepartmentMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getIcon = (index: number) => {
    const icons = [Building2, Microscope, Briefcase, Shield];
    const Icon = icons[index % icons.length];
    return <Icon size={16} className="text-[#0B10A4]" />;
  };

  if (!departments.length) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">No {type}s available</p>
      </div>
    );
  }

  const title = type === 'department' ? 'Departments' : 'Laboratories';

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
        {title}
      </div>
      {departments.map((item, index) => (
        <div key={item.id} className="border-b border-gray-100 last:border-0">
          <button
            onClick={() => toggleItem(item.id)}
            className="flex justify-between items-center w-full py-3 px-2 text-left hover:bg-gray-50 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getIcon(index)}
              <div>
                <span className="font-medium text-gray-800">{item.name}</span>
                {item.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
            {item.sub_departments && item.sub_departments.length > 0 && (
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 text-gray-400 ${
                  expandedItems.has(item.id) ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>
          
          {expandedItems.has(item.id) && item.sub_departments && (
            <div className="pl-10 pb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {item.sub_departments.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/${type}/${item.slug}/${sub.slug}`}
                  onClick={onClose}
                  className="block py-2 px-3 text-sm text-gray-600 hover:bg-[#F5F7FF] hover:text-[#0B10A4] rounded-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span>{sub.name}</span>
                    <ChevronRight size={12} className="text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}