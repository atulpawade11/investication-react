// components/shared/OverviewSection.tsx

import { useMemo, useState } from "react";

type Props = {
  heading: string;
  description: string;
  image: string;
};

interface ServiceSection {
  title: string;
  content: string;
}

export default function OverviewSection({
  heading,
  description,
  image,
}: Props) {

  const parseContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let introText = "";
    let serviceHeading = "Key Services Offered";
    let serviceSections: ServiceSection[] = [];
    let closingText = "";
    let contactText = "";

    let currentService: ServiceSection | null = null;
    let servicesStarted = false;

    const elements = Array.from(doc.body.children);

    elements.forEach((element) => {
      const text = element.textContent?.trim() || "";

      // ----------------------------------------
      // Section Heading
      // ----------------------------------------
      if (
        (element.tagName === "H3" ||
          element.tagName === "H4") &&
        !servicesStarted
      ) {
        serviceHeading = text.replace(":", "").trim();
        servicesStarted = true;
        return;
      }

      // ----------------------------------------
      // Contact Section
      // ----------------------------------------
      const hasLink = element.querySelector("a");

      if (
        text.toLowerCase().includes("contact us") ||
        hasLink
      ) {
        if (currentService) {
          serviceSections.push(currentService);
          currentService = null;
        }

        const updatedHTML = element.outerHTML.replace(
          /href=["']([^"']*)["']/gi,
          'href="/contact"'
        );

        contactText += updatedHTML;
        return;
      }

      // ----------------------------------------
      // Closing Paragraphs
      // ----------------------------------------
      const isClosingParagraph =
        element.tagName === "P" &&
        servicesStarted &&
        !element.querySelector("strong") &&
        !element.querySelector("b") &&
        text.length > 120;

      if (isClosingParagraph) {
        if (currentService) {
          serviceSections.push(currentService);
          currentService = null;
        }

        closingText += element.outerHTML;
        return;
      }

      // ----------------------------------------
      // Service Title
      // ----------------------------------------
      const boldEl =
        element.querySelector("strong") ||
        element.querySelector("b");

      if (boldEl) {
        servicesStarted = true;

        if (currentService) {
          serviceSections.push(currentService);
        }

        currentService = {
          title:
            boldEl.textContent?.replace(":", "").trim() || "",
          content: element.innerHTML
            .replace(boldEl.outerHTML, "")
            .trim(),
        };

        return;
      }

      // ----------------------------------------
      // Continue Service Content
      // ----------------------------------------
      if (currentService && servicesStarted) {
        currentService.content += element.outerHTML;
        return;
      }

      // ----------------------------------------
      // Intro Content
      // ----------------------------------------
      introText += element.outerHTML;
    });

    // Push Final Service
    if (currentService) {
      serviceSections.push(currentService);
    }

    // ----------------------------------------
    // FINAL Fingerprint Order Fix
    // ----------------------------------------
    if (
      closingText.includes(
        "Our Fingerprint Examination Laboratory is committed"
      ) &&
      closingText.includes(
        "We also specialize in providing fingerprinting"
      )
    ) {
      const parser = new DOMParser();

      const tempDoc = parser.parseFromString(
        closingText,
        "text/html"
      );

      const paragraphs = Array.from(
        tempDoc.body.querySelectorAll("p")
      );

      const specializePara = paragraphs.find((p) =>
        p.textContent?.includes(
          "We also specialize in providing fingerprinting"
        )
      );

      const committedPara = paragraphs.find((p) =>
        p.textContent?.includes(
          "Our Fingerprint Examination Laboratory is committed"
        )
      );

      const remainingParagraphs = paragraphs.filter(
        (p) =>
          p !== specializePara &&
          p !== committedPara
      );

      if (specializePara && committedPara) {
        closingText = `
          ${specializePara.outerHTML}
          ${committedPara.outerHTML}
          ${remainingParagraphs
            .map((p) => p.outerHTML)
            .join("")}
        `;
      }
    }

    return {
      introText,
      serviceHeading,
      serviceSections,
      closingText,
      contactText,
    };
  };

  const {
    introText,
    serviceHeading,
    serviceSections,
    closingText,
    contactText,
  } = useMemo(() => parseContent(description), [description]);

  const [activeService, setActiveService] = useState(0);

  const hasImage = image && image.trim() !== "";

  return (
    <div className="space-y-8">

      {/* Overview Section */}
      <div
        className={`${
          hasImage ? "grid md:grid-cols-2 gap-10" : ""
        } items-start`}
      >

        {/* Image */}
        {hasImage && (
          <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
            <img
              src={image}
              alt={heading}
              className="w-full h-full object-cover min-h-[250px] max-h-[300px]"
            />
          </div>
        )}

        {/* Intro Text */}
        <div className="flex flex-col">
          <h2 className="text-3xl md:text-[30px] font-semibold text-black mb-6">
            {heading || "Overview of Laboratory"}
          </h2>

          {introText && (
            <div
              className="text-[#525252] text-[16px] font-normal prose prose-slate max-w-none
              [&>p]:mb-4
              [&>p]:text-justify
              [&>p]:!leading-[28px]
              [&>p]:!text-[16px]
              [&>br]:hidden"
              dangerouslySetInnerHTML={{
                __html: introText,
              }}
            />
          )}
        </div>
      </div>

      {/* Floating Label */}
      {serviceSections.length > 0 && (
        <div className="flex items-center my-12 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D9D9D9]" />
          </div>

          <span className="mx-auto px-8 py-2 bg-white text-black text-[18px] border border-[#D9D9D9] font-medium rounded-full relative z-10">
            {serviceHeading || "Key Services Offered"}
          </span>
        </div>
      )}

      {/* Services */}
      {serviceSections.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left Tabs */}
          <div className="flex flex-col gap-3">
            {serviceSections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveService(index)}
                className={`relative w-full text-left px-5 py-4 text-[16px] font-semibold transition-all duration-300
                ${
                  activeService === index
                    ? "bg-[#00467A] text-white"
                    : "bg-[#F3F3F3] text-[#717171] hover:bg-gray-100"
                }`}
              >
                <span>{section.title}</span>

                {/* Arrow */}
                {activeService === index && (
                  <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[24px] border-l-[#00467A]" />
                )}
              </button>
            ))}
          </div>

          {/* Right Content - UPDATED with better image controls */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 self-start">
            <h3 className="text-lg md:text-[24px] font-bold text-[#000000] mb-4">
              {serviceSections[activeService]?.title}
            </h3>

            <div
              className="text-[#525252] leading-relaxed prose prose-slate max-w-none text-[16px]
              /* Paragraph spacing */
              [&>p]:mb-4
              [&>p]:text-justify
              
              /* Bold text styling */
              [&>b]:text-gray-900
              [&>b]:font-bold
              [&>strong]:text-gray-900
              [&>strong]:font-bold
              
              /* IMAGE CONTROLS - Added spacing and size control */
              [&>img]:my-6
              [&>img]:mx-auto
              [&>img]:block
              [&>img]:rounded-xl
              [&>img]:shadow-lg
              [&>img]:max-w-full
              [&>img]:w-auto
              [&>img]:h-auto
              [&>img]:max-h-[400px]
              [&>img]:object-contain
              
              /* Image hover effect */
              [&>img]:transition-transform
              [&>img]:duration-300
              hover:[&>img]:scale-105
              
              /* Image caption styling (if any) */
              [&>figcaption]:text-center
              [&>figcaption]:text-sm
              [&>figcaption]:text-gray-500
              [&>figcaption]:mt-2
              
              /* Lists styling */
              [&>ul]:list-disc
              [&>ul]:pl-5
              [&>ul]:mb-4
              [&>li]:mb-2
              
              /* Nested images in paragraphs */
              [&>p>img]:my-6
              [&>p>img]:block
              [&>p>img]:rounded-xl
              [&>p>img]:shadow-lg
              [&>p>img]:max-w-full
              [&>p>img]:w-auto
              [&>p>img]:h-auto
              [&>p>img]:min-h-[250px]
              [&>p>img]:max-h-[250px]
              [&>p>img]:object-contain
              hover:[&>p>img]:scale-105
              [&>p>img]:transition-transform
              [&>p>img]:duration-300"
              dangerouslySetInnerHTML={{
                __html: serviceSections[activeService]?.content || "",
              }}
            />
          </div>
        </div>
      )}

      {/* Closing + Contact */}
      {(closingText || contactText) && (
        <div className="mt-8 space-y-4">

          {/* Closing */}
          {closingText && (
            <div
              className="prose prose-slate max-w-none
              [&>p]:mb-4
              [&>p]:text-justify
              [&>p]:font-[500]
              [&>p]:text-[16px]
              [&>p]:text-black
              leading-relaxed
              [&>img]:my-6
              [&>img]:mx-auto
              [&>img]:block
              [&>img]:rounded-xl
              [&>img]:shadow-lg
              [&>img]:max-h-[400px]
              [&>img]:object-contain"
              dangerouslySetInnerHTML={{
                __html: closingText,
              }}
            />
          )}

          {/* Contact */}
          {contactText && (
            <div
              className="leading-relaxed
              [&>p]:mb-2
              [&>p]:font-[500]
              [&>p]:text-[18px]
              [&>p]:text-black
              [&>a]:underline
              [&>a]:font-semibold
              [&>a]:text-black
              hover:[&>a]:text-[#00467A]"
              dangerouslySetInnerHTML={{
                __html: contactText,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}