import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// Static fallbacks for when API data is missing
const defaultFaqs = [
  {
    question: "How long does a standard forensic signature verification take?",
    answer: "Typically, a preliminary analysis takes 3-5 business days. Complex cases involving multiple documents or historical comparisons may take longer to ensure absolute accuracy for legal standards."
  },
  {
    question: "Are your forensic reports admissible in a court of law?",
    answer: "Yes, our reports are prepared by certified forensic experts following standard operating procedures (SOPs) that comply with legal evidentiary requirements."
  }
];

interface FAQAccordionProps {
  apiFaqs?: any[];
}

export default function FAQAccordion({ apiFaqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [itemsToShow, setItemsToShow] = useState(6);

  const dataToRender = (apiFaqs && apiFaqs.length > 0) ? apiFaqs : defaultFaqs;
  const paginatedData = dataToRender.slice(0, itemsToShow);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="text-center">
          <h3 className="text-xl md:text-[30px] font-bold text-[#000000]">Forensic Examination Enquiries</h3>
          <h4 className="text-sm md:text-[16px] font-regular text-[#6B7385]">Frequently Asked Questions</h4>
        </div>
      </div>

      <div className="space-y-3">
        {paginatedData.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <div
              key={i}
              className="rounded-xl overflow-hidden transition-all duration-300"
            >
              {/* Question Trigger */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={`w-full p-5 flex justify-between items-center text-left transition-all duration-300 ${
                  isOpen
                    ? "bg-gradient-to-r from-[#1C274C] to-[#0D1189] text-white"
                    : "bg-[#ACACAC] text-black"
                }`}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-[16px] font-bold ${isOpen ? "text-white" : "text-[#585858] font-regular text-[16px]"}`}>
                    {faq.question || faq.title || faq.query}
                  </span>
                  {faq.name && (
                    <span className={`py-1 rounded-full ${
                      isOpen 
                        ? "text-white" 
                        : "text-black font-bold text-[16px]"
                    }`}>
                      - {faq.name}
                    </span>
                  )}
                </div>
                <div className={`p-1.5 rounded-lg transition-all duration-500 ${
                  isOpen 
                    ? "text-white rotate-90" 
                    : "text-black"
                }`}>
                  <ChevronRight size={16} />
                </div>
              </button>

              {/* Collapsible Answer - White background, no border */}
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-4 bg-[#f8f9fa]">
                    <div
                      className="text-[14px] text-black leading-relaxed font-regular api-content"
                      dangerouslySetInnerHTML={{ __html: faq.answer || faq.content || faq.reply }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {itemsToShow < dataToRender.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setItemsToShow(prev => prev + 6)}
            className="px-8 py-3 bg-white border border-gray-200 text-[#04063E] font-bold rounded-full hover:bg-gradient-to-r hover:from-[#1C274C] hover:to-[#0D1189] hover:text-white hover:border-transparent transition-all duration-300 shadow-sm"
          >
            Load More Enquiries
          </button>
        </div>
      )}
    </div>
  );
}