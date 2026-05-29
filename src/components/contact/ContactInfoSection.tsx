// components/contact/ContactInfoSection.tsx

import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const staticLabs = [
  {
    title: "Document Lab",
    phone: "+91 730-391-3004, +91 11-470-74263",
    email: "contact@sifsindia.com",
  },
  {
    title: "Cyber Lab",
    phone: "+91 730-391-3005, +91 11-470-74263",
    email: "contact@sifsindia.com",
  },
  {
    title: "Fire Forensic",
    phone: "+91 730-391-3006, +91 11-470-74263",
    email: "contact@sifsindia.com",
  },
];

const parseOfficeDetails = (html: string) => {
  if (!html) {
    return {
      address: "",
      phones: [],
      email: "",
    };
  }

  const div = document.createElement("div");
  div.innerHTML = html;

  const paragraphs = Array.from(div.querySelectorAll("p"))
    .map((p) => p.textContent?.trim())
    .filter(Boolean);

  let address = "";
  let email = "";
  const phones: string[] = [];

  paragraphs.forEach((text: any, index) => {
    const clean = text.replace(/\+/g, "+").trim();

    if (clean.includes("@")) {
      email = clean;
    } else if (/\d{3,}/.test(clean)) {
      phones.push(clean);
    } else if (index === 0) {
      address = clean;
    }
  });

  return {
    address,
    phones,
    email,
  };
};

export default function ContactInfoSection({
  locations = [],
  internationalLocations = [],
  mainInfo = {},
}: {
  locations?: any[];
  internationalLocations?: any[];
  mainInfo?: any;
}) {
  const allOffices = [...locations, ...internationalLocations];
  const hasOffices = allOffices.length > 0;

  const [selectedOffice, setSelectedOffice] = useState(-1);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto container px-4">

        {/* TOP ROW */}
        <div className="grid gap-10 lg:grid-cols-3">

          {/* Column 1 */}
          <div>
            <h2 className="mb-6 text-3xl font-semibold leading-snug md:text-[30px] text-[#000000]">
              Convinced yet?{" "}
              <span>Let&apos;s make something great together.</span>
            </h2>

            <div className="overflow-hidden rounded-xl shadow-md">
              <img
                src="/contact/contact-desk.png"
                alt="Desk"
                width={500}
                height={350}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl">
              <img
                src="/contact/contact-person.png"
                alt="Support"
                width={500}
                height={300}
                className="w-full object-cover"
              />
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-[#0C2783] to-[#1C274C] p-8 text-white shadow-xl">
              <h4 className="mb-3 text-2xl md:text-[26px] font-semibold">
                Corp Office
              </h4>

              <hr className="mb-6 w-12 h-1 bg-white border-none" />

              <div className="space-y-4">
                <p className="flex items-start gap-3 text-sm md:text-[16px] font-semibold text-white leading-relaxed">
                  <MapPin className="text-white shrink-0" size={24} />
                  {mainInfo?.address ||
                    "A-14, Mahendru Enclave, Model Town Metro Station, Delhi-110009, India."}
                </p>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            {staticLabs.map((lab, idx) => {
              const isLast = idx === staticLabs.length - 1;

              return (
                <div
                  key={`lab-${idx}`}
                  className={`bg-white p-5 transition-shadow ${
                    isLast ? "" : "border-b border-b-[#BCBCBC]"
                  }`}
                >
                  <h5 className="font-bold text-[#000000] mb-3 text-lg md:text-[20px]">
                    {lab.title}
                  </h5>

                  <div className="space-y-2 text-sm md:text-[16px] text-[#2A2A2A]">

                    <p className="flex items-center gap-2">
                      <img
                        src="/contact/phone.png"
                        alt="Phone"
                        width={26}
                        height={26}
                        className="shrink-0"
                      />
                      {lab.phone}
                    </p>

                    <p className="flex items-center gap-2">
                      <img
                        src="/contact/mail.png"
                        alt="Email"
                        width={26}
                        height={26}
                        className="shrink-0"
                      />
                      {lab.email}
                    </p>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ROW */}
        {hasOffices && (
          <div className="mt-20">

            {/* INTERNATIONAL */}
            {internationalLocations.length > 0 && (
              <div className="mb-14">
                <h2 className="font-semibold text-gray-900 mb-4 text-[24px]">
                  International Associates
                </h2>

                <div className="flex flex-wrap gap-3">
                  {internationalLocations.map((office, idx) => {
                    const officeIndex = locations.length + idx;
                    const isActive = selectedOffice === officeIndex;

                    const officeInfo = parseOfficeDetails(office.details);

                    return (
                      <div
                        key={`international-${idx}`}
                        className="relative"
                      >
                        <button
                          onClick={() => setSelectedOffice(officeIndex)}
                          className={`h-[42px] px-5 rounded-md border text-[16px] font-semibold transition-all duration-200 flex items-center gap-2 ${
                            isActive
                              ? "bg-[#eff6ff] border-[#93c5fd] text-[#111827]"
                              : "bg-[#f5f8ff] border-[#D7DFEA] text-[#1e293b] hover:bg-[#EEF4FF]"
                          }`}
                        >
                          <MapPin
                            size={15}
                            strokeWidth={1.8}
                            className="text-[#94A3B8]"
                          />
                          {office.title}
                        </button>

                        {isActive && (
                          <div className="absolute left-0 top-[55px] z-30 w-[320px] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] bg-white border border-[#E5E7EB] p-5">

                            <div className="space-y-4">

                              {/* PHONE */}
                              {officeInfo.phones.length > 0 && (
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                                    <Phone
                                      size={18}
                                      className="text-[#2453FF]"
                                    />
                                  </div>

                                  <div className="text-[13.5px] text-[#1e293b] font-semibold">
                                    {officeInfo.phones.join(", ")}
                                  </div>
                                </div>
                              )}

                              {/* EMAIL */}
                              {officeInfo.email && (
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                                    <Mail
                                      size={18}
                                      className="text-[#2453FF]"
                                    />
                                  </div>

                                  <div className="text-[13.5px] text-[#1e293b] font-semibold break-all">
                                    {officeInfo.email}
                                  </div>
                                </div>
                              )}

                              {/* ADDRESS */}
                              {officeInfo.address && (
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                                    <MapPin
                                      size={18}
                                      className="text-[#2453FF]"
                                    />
                                  </div>

                                  <div className="text-[13.5px] text-[#1e293b] font-semibold leading-relaxed">
                                    {officeInfo.address}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="pt-5 mt-5 border-t border-[#ECECEC] text-center">
                              <button
                                onClick={() => setSelectedOffice(-1)}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest"
                              >
                                CLOSE ✕
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NATIONAL */}
            {locations.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-4 text-[24px]">
                  National Presence
                </h2>

                <div className="flex flex-wrap gap-3">
                  {locations.map((office, idx) => {
                    const isActive = selectedOffice === idx;

                    const officeInfo = parseOfficeDetails(office.details);

                    return (
                      <div
                        key={`national-${idx}`}
                        className="relative"
                      >
                        <button
                          onClick={() => setSelectedOffice(idx)}
                          className={`h-[42px] px-5 rounded-md border text-[16px] font-semibold transition-all duration-200 flex items-center gap-2 ${
                            isActive
                              ? "bg-[#EEF4FF] border-[#AFC8FF] text-[#111827]"
                              : "bg-[#f5f8ff] border-[#D7DFEA] text-[#1e293b] hover:bg-[#EEF4FF]"
                          }`}
                        >
                          <MapPin
                            size={15}
                            strokeWidth={1.8}
                            className="text-[#94A3B8]"
                          />

                          {office.title}
                        </button>

                        {isActive && (
                          <div className="absolute left-0 top-[55px] z-30 w-[320px] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] bg-white border border-[#E5E7EB] p-5">

                            <div className="space-y-4">

                              {/* PHONE */}
                              {officeInfo.phones.length > 0 && (
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                                    <Phone
                                      size={18}
                                      className="text-[#2453FF]"
                                    />
                                  </div>

                                  <div className="text-[13.5px] text-[#1e293b] font-semibold">
                                    {officeInfo.phones.join(", ")}
                                  </div>
                                </div>
                              )}

                              {/* EMAIL */}
                              {officeInfo.email && (
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                                    <Mail
                                      size={18}
                                      className="text-[#2453FF]"
                                    />
                                  </div>

                                  <div className="text-[13.5px] text-[#1e293b] font-semibold break-all">
                                    {officeInfo.email}
                                  </div>
                                </div>
                              )}

                              {/* ADDRESS */}
                              {officeInfo.address && (
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                                    <MapPin
                                      size={18}
                                      className="text-[#2453FF]"
                                    />
                                  </div>

                                  <div className="text-[13.5px] text-[#1e293b] font-semibold leading-relaxed">
                                    {officeInfo.address}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="pt-5 mt-5 border-t border-[#ECECEC] text-center">
                              <button
                                onClick={() => setSelectedOffice(-1)}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest"
                              >
                                CLOSE ✕
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}