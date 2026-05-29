import React, { useEffect, useState } from "react";
;
import { API_BASE_URL } from '@/lib/config';
import { parseAboutContent } from '@/lib/parseAboutContent';

const AboutIntroSection = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        const result = await response.json();
        if (result.success) setData(result.data.bs);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, []);

  //const getCleanIntro = (html: string) => {
   // if (!html) return "";
    // Splits before the Mission header to get "The Journey" section
    //const parts = html.split(/<h5.*?>.*?Mission.*?<\/h5>/i);
    //return parts[0]; 
  //};

  const parsed = parseAboutContent(data?.about_us);

  return (
    <section className="bg-white py-16 md:py-12">
      <div className="mx-auto container px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#04063E] ps-1 pe-3 py-1">
                <span className="flex h-8 w-8 items-center justify-center rounded-full">
                    <img src="/about/zap.png" alt="Icon" width={50} height={50} />
                </span>
                <span className="text-[18px] font-bold text-black">{data?.about_seo_keyword || "About Us"}</span>
            </div>

            <h2 className="text-2xl font-semibold leading-tight text-black md:text-[35px] mb-6">
              {data?.intro_section_text || "Leading Forensic Excellence Since 2006"}
            </h2>

            <div
              className="text-[16px] font-normal leading-relaxed text-[#777777] 
                         [&_p]:mb-4 
                         [&_ul]:grid [&_ul]:grid-cols-1 md:[&_ul]:grid-cols-2 [&_ul]:gap-2 [&_ul]:mt-6
                         [&_li]:flex [&_li]:items-center [&_li]:before:content-['›'] [&_li]:before:mr-2 [&_li]:before:text-[#0B10A4] [&_li]:before:font-bold"
              dangerouslySetInnerHTML={{ __html: parsed.intro }}
            />
          </div>

          <div className="relative">
            <div className="relative w-full overflow-hidden">
              <img
                src={data?.about_feature_image || "/about/about-us.png"}
                alt="SIFS India"
                
                className="w-full"
                
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntroSection;