// components/department/WhyChooseUs.tsx
import React from 'react';
import { CheckCircle2 } from "lucide-react";

interface ReasonItem {
  title: string;
  description: string; // Changed from 'desc' to 'description' to match parsed API data
}

interface Props {
  departmentName?: string;
  items?: ReasonItem[]; // Dynamic prop from API
}

// Default fallback (used if no API data provided)
const defaultReasons: ReasonItem[] = [
  { title: "Robust Experience", description: "With the experience of several years and a team of skilled forensic experts, we have successfully solved a vast number of forgery cases, thereby establishing our reputation as one of the top forensic companies in India." },
  { title: "Extensive Services", description: "Our forensic investigation services cover a wide range of services, with a specialization in criminal investigation services, fingerprint and questioned document forensic analysis, cyber forensic investigation, insurance investigation, and more." },
  { title: "Client-Centric Approach", description: "The client's needs and satisfaction are our topmost priorities. We know the sensitivity of our work and, hence, maintain strict confidentiality throughout the investigation process." },
  { title: "Cutting-Edge Technology", description: "We use state-of-the-art forensic tools and methodologies, ensuring our forensic investigators are equipped to handle complexities related to modern crimes." },
  { title: "Timely and Efficient Delivery", description: "We know the importance of time in forensic investigations. Our team works thoroughly to provide timely and accurate services without compromising on quality." },
  { title: "Expert Analysis", description: "Our team includes skilled forensic investigators with an eye for detail. We provide expert analysis for every case that is admissible in legal proceedings." },
  { title: "Global Reach", description: "Though we operate as a private forensic investigation company in Delhi, our services extend globally. We have successfully delivered cases across borders, highlighting our expertise in handling international legal frameworks." }
];

const WhyChooseUs = ({ departmentName, items }: Props) => {
  // Use API items if provided, otherwise use defaults
  const displayItems = items && items.length > 0 ? items : defaultReasons;

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side - Text Content (reduced width) */}
        <div className="w-full lg:w-[52%] flex items-center">
          <div>
            <h2 className="text-3xl md:text-[30px] font-semibold text-[#000000] mb-10">
              Why Choose Our {departmentName || "Forensic Investigation"} Services?
            </h2>
            <div className="space-y-6">
              {displayItems.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <CheckCircle2 className="text-[#6A8D00] flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-black text-[15px] inline-block mr-2">{item.title}:</h4>
                    <p className="text-black inline font-regular text-sm md:text-[15px] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Image (increased width) */}
        <div className="w-full lg:w-[48%]">
          <img 
            src="/department/department2.png" 
            alt="Investigators" 
            className="rounded-[40px] w-full object-cover shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;