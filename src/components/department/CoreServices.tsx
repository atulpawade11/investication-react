// components/department/CoreServices.tsx
import React from 'react';

interface ServiceItem {
  title: string;
  points: string[];
}

interface Props {
  departmentName?: string;
  services?: ServiceItem[]; // <-- dynamic prop
}

const defaultServices: ServiceItem[] = [
  {
    title: "Crime Scene Investigation",
    points: [
      "Systematic crime scene investigations, including indoor and outdoor locations.",
      "Proper documentation of physical evidence, environmental factors, and spatial relationships."
    ]
  },
  {
    title: "Evidence Collection and Preservation",
    points: [
      "Advanced collection and preservation forensic techniques for physical and digital evidence.",
      "Maintaining the chain of custody to ensure the admissibility of evidence during legal proceedings."
    ]
  },
  {
    title: "Forensic Analysis",
    points: [
      "Use cutting-edge technologies and methodologies to interpret complex data, reconstruct events, and provide reliable opinions.",
      "Follow a multi-disciplinary approach, utilizing expertise from various fields to provide an all-around understanding of the case."
    ]
  },
  {
    title: "Expert Testimony",
    points: [
      "Preparation of expert reports, presenting findings in a detailed manner for juries.",
      "Skilled and well-qualified forensic experts capable of providing clear and compelling testimony in court."
    ]
  }
];

const CoreServices = ({ departmentName, services }: Props) => {
  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <div className="relative py-16 px-4 md:px-10 overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/department/bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      <div className="relative z-10 container mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-6">
          <h2 className="text-3xl md:text-[30px] font-medium text-white lg:max-w-md leading-tight">
            Our Core {departmentName || "Forensic Investigation"} Services
          </h2>
          <p className="text-white font-medium text-sm md:text-[14px] lg:max-w-2xl leading-relaxed text-right">
            Our core forensic services, combined with our extensive experience, make us your trusted partner in solving complex cases.
            Whether it is criminal investigations, document and fingerprint examination, cyber forensics, insurance and accounting
            fraud analysis, accident site reconstruction, biological evidence examination, or specialized forensic support,
            our {departmentName || "Forensic Investigation"} Department is equipped to provide unmatched services across various domains.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {displayServices.map((service, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 md:p-8 rounded-tr-lg border border-[#F0F0F0] border-4 min-h-[320px] transition-transform hover:-translate-y-2 ${
                idx % 2 !== 0 ? 'lg:mt-16' : ''
              }`}
            >
              <h3 className="text-xl md:text-[19px] font-bold text-[#000000] mb-4">{service.title}</h3>
              <ul className="space-y-4">
                {service.points.map((point, pIdx) => (
                  <li key={pIdx} className="flex gap-3 text-sm md:text-[14px] text-[#000000] leading-relaxed">
                    <span className="text-[#000000] font-regular text-lg md:text-[14px] leading-none">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreServices;