import { useState, useEffect } from "react";
import PageBanner from '@/components/common/PageBanner';
import { ChevronDown, ChevronUp } from "lucide-react"; 
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';

export default function FAQClient() {
  const [faqData, setFaqData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { breadcrumbImage } = useBoot();
  
  const INITIAL_LIMIT = 8;

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/faq/`);
        const json = await response.json();
        if (json.success) {
          setFaqData(json.data); 
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const faqsArray = faqData?.faqs || [];
  const displayedFaqs = showAll ? faqsArray : faqsArray.slice(0, INITIAL_LIMIT);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // --- FAQS SKELETON COMPONENT ---
  const FAQSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-xl overflow-hidden">
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50">
      <PageBanner
        title={faqData?.bs?.faq_title || "Frequently Asked Questions"}
        subtitle={faqData?.bs?.faq_subtitle || "SIFS India Support"}
        breadcrumbImage={breadcrumbImage}
      />

      <div className="relative z-10 mt-10 pb-10 px-4">
        <section className="max-w-7xl mx-auto">
          <div className="space-y-6">
            
            {loading ? (
              <FAQSkeleton />
            ) : (
              <>
                {/* FAQ Accordion */}
                <div className="space-y-4">
                  {displayedFaqs.map((item: any, index: number) => (
                    <div 
                      key={index} 
                      className="rounded-xl overflow-hidden shadow-md transition-all duration-300"
                    >
                      {/* Question Block - Gradient Background */}
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex items-center justify-between p-5 md:p-6 
                          bg-gradient-to-r from-[#1C274C] to-[#0D1189]
                          hover:from-[#242f58] hover:to-[#1418a3]
                          transition-all duration-300 group"
                      >
                        <h3 className="text-left text-white font-semibold text-base md:text-lg pr-4">
                          {item.question}
                        </h3>
                        <div className="flex-shrink-0">
                          {openIndex === index ? (
                            <ChevronUp className="text-white w-5 h-5 md:w-6 md:h-6 transition-transform duration-300" />
                          ) : (
                            <ChevronDown className="text-white w-5 h-5 md:w-6 md:h-6 transition-transform duration-300" />
                          )}
                        </div>
                      </button>

                      {/* Answer Block - White Background, No Border */}
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden
                          ${openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="bg-white p-5 md:p-6">
                          <p className="text-gray-600 leading-relaxed text-[16px] md:text-[16px]">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Read More / Read Less Button */}
                {faqsArray.length > INITIAL_LIMIT && (
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={() => {
                        setShowAll(!showAll);
                        // Optional: Close all open accordions when toggling
                        setOpenIndex(null);
                      }}
                      className="flex items-center gap-3 bg-gradient-to-r from-[#1C274C] to-[#0D1189]
                        text-white px-8 py-3 rounded-full font-semibold text-base
                        hover:from-[#242f58] hover:to-[#1418a3]
                        transition-all shadow-lg hover:shadow-xl"
                    >
                      {showAll ? (
                        <>
                          Read Less <ChevronUp size={18} />
                        </>
                      ) : (
                        <>
                          Read More <ChevronDown size={18} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}