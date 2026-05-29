// components/shared/MainAccordionSection.tsx
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface Props {
  items: AccordionItem[];
  defaultOpenId?: string;
}

export default function MainAccordionSection({ items, defaultOpenId }: Props) {
  const [openId, setOpenId] = useState<string>(defaultOpenId || items?.[0]?.id || "");

  if (!items?.length) return null;

  return (
    <div className="space-y-4 my-0">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Header */}
            <button
              onClick={() => setOpenId(isOpen ? "" : item.id)}
              className={`w-full flex items-center justify-between px-6 py-5 transition-all duration-300 ${
                isOpen
                  ? "bg-[#00467A] text-white"
                  : "bg-gray-50 hover:bg-gray-100 text-[#0B4F8A]"
              }`}
            >
              <h3 className={`text-lg font-bold ${isOpen ? "text-white" : "text-[#191919]"}`}>
                {item.title}
              </h3>

              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isOpen
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-[#0B4F8A]"
              }`}>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Content */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen 
                  ? "max-h-[10000px] opacity-100" 
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="px-6 py-6 bg-white border-t border-gray-100">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}