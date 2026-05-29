import React, { useState, useEffect } from 'react';
;
import { ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

export default function CareerFAQSection() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [meta, setMeta] = useState({ title: "F.A.Q", subtitle: "Frequently Asked Questions" });
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const faqRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/faq/`);
        const faqJson = await faqRes.json();
        
        const homeRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        const homeJson = await homeRes.json();

        if (faqJson.success && faqJson.data?.faqs) {
          setFaqs(faqJson.data.faqs);
        }

        if (homeJson.success && homeJson.data?.be) {
          setMeta({
            title: homeJson.data.bs.faq_title || "F.A.Q",
            subtitle: homeJson.data.bs.faq_subtitle || "Frequently Asked Questions"
          });
        }
      } catch (err) {
        console.error("Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="bg-[#ebebeb] py-20 text-center text-gray-400 font-bold uppercase tracking-widest">Loading...</div>;
  if (faqs.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#ebebeb] py-20">
      <div className="absolute right-0 top-0 hidden h-full w-[48%] md:block">
        <img 
          src="/career/faq-person.png" 
          alt="FAQ Section" 
           
          className="object-cover w-full h-full" 
           
        />
      </div>

      <div className="relative mx-auto container px-4 md:px-10">
        <div className="max-w-xl">
          <h2 className="mb-1 text-3xl md:text-[36px] font-bold text-black uppercase tracking-tight">
            {meta.title}
          </h2>
          <p className="mb-8 text-sm md:text-[16px] font-regular text-[#6B7385]">
            {meta.subtitle}
          </p>

          <div className="space-y-4">
            {faqs.slice(0, 10).map((faq: any, index: number) => (
              <div 
                key={faq.id || index} 
                className="rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className={`flex w-full items-center justify-between px-6 py-4 text-left md:text-[18px] rounded-lg font-bold outline-none transition-all duration-300 ${
                    activeIndex === index 
                      ? "bg-gradient-to-r from-[#1C274C] to-[#0D1189] text-white" 
                      : "bg-gradient-to-r from-[#CFCFCF] to-[#D7D7D7] text-[#585858]"
                  }`}
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`} />
                </button>
                
                {activeIndex === index && (
                  <div className="px-6 pb-5 text-sm md:text-[14px] font-regular text-black leading-relaxed border-t border-white/10 pt-4 bg-[#ebebeb] rounded-b-lg">
                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}