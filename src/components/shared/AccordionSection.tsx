import { useState } from "react";
import { ChevronDown } from "lucide-react";

type AccordionItem = {
  title: string;
  content: string;
};

type Props = {
  items: AccordionItem[];
};

export default function AccordionSection({ items }: Props) {
  // We keep 0 as default open, but allow null if all are closed
  const [open, setOpen] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="mt-12 space-y-4">
      {items.map((item, index) => {
        const isOpen = open === index;
        
        return (
          <div 
            key={index} 
            className={`group border rounded-xl transition-all duration-300 ${
              isOpen ? "border-[#0B4F8A] bg-blue-50/30" : "border-gray-200 bg-white"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left"
            >
              <span className={`text-sm font-bold transition-colors ${
                isOpen ? "text-[#0B4F8A]" : "text-gray-700 group-hover:text-[#0B4F8A]"
              }`}>
                {item.title}
              </span>
              
              <ChevronDown 
                size={18} 
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#F68A07]" : "text-gray-400"
                }`} 
              />
            </button>

            {/* Content Area */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-blue-100/50 pt-4">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}