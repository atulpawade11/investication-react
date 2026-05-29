// AboutMissionTabs.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/lib/config";

export default function AboutMissionTabs() {
  const [activeTab, setActiveTab] = useState("mission");
  const [data, setData] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parsedContent, setParsedContent] = useState({
    mission: "",
    vision: "",
    purpose: "", // This will include both purpose text and bullet points
  });

  useEffect(() => {
    setIsExpanded(false);
  }, [activeTab]);

  const parseAboutContent = (html: string) => {
    if (!html) return { mission: "", vision: "", purpose: "" };
    
    const result = {
      mission: "",
      vision: "",
      purpose: ""
    };
    
    // Find Mission section
    const missionMatch = html.match(/<h5[^>]*><strong>Mission<\/strong><\/h5>([\s\S]*?)(?=<h5[^>]*><strong>Vision|<h5[^>]*><strong>Purpose|$)/i);
    if (missionMatch) {
      result.mission = missionMatch[1].trim();
    }
    
    // Find Vision section
    const visionMatch = html.match(/<h5[^>]*><strong>Vision<\/strong><\/h5>([\s\S]*?)(?=<h5[^>]*><strong>Purpose|$)/i);
    if (visionMatch) {
      result.vision = visionMatch[1].trim();
    }
    
    // Find Purpose section including the bullet points that follow
    const purposeMatch = html.match(/<h5[^>]*><strong>Purpose<\/strong><\/h5>([\s\S]*?)(?=<p class="ql-align-justify"><br><\/p><p class="ql-align-justify">To date|$)/i);
    if (purposeMatch) {
      let purposeContent = purposeMatch[1].trim();
      
      // Also include the bullet points section that comes after Purpose
      const bulletPointsMatch = html.match(/<p class="ql-align-justify">To date, the company has provided expert opinion[^<]*<\/p>([\s\S]*?)<\/ul>/i);
      if (bulletPointsMatch) {
        purposeContent += bulletPointsMatch[0];
      }
      
      result.purpose = purposeContent;
    }
    
    // Clean up the content
    result.mission = result.mission || "<p>Our mission is to provide excellence in forensic science services.</p>";
    result.vision = result.vision || "<p>To be the global leader in forensic investigation and scientific truth revelation.</p>";
    result.purpose = result.purpose || "<p>To serve law enforcement and society by unveiling truth through strong, scientifically precise forensic solutions.</p>";
    
    return result;
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/InvestigationServices/Website/front`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data.bs.about_us) {
          const html = result.data.bs.about_us;
          const parsed = parseAboutContent(html);
          setData(result.data.bs);
          setParsedContent({
            mission: parsed.mission,
            vision: parsed.vision,
            purpose: parsed.purpose,
          });
          console.log("Parsed content:", parsed); // Debug log
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const contentStyle = `
    text-[16px] font-normal leading-relaxed text-[#777777] 
    [&_ul]:list-disc 
    [&_ul]:pl-5 
    [&_ul]:my-4 
    [&_ul]:space-y-2
    [&_li]:mb-2 
    [&_li]:text-[#777777]
    [&_p]:mb-4
    [&_strong]:font-bold 
    [&_strong]:text-black
  `;

  if (loading) {
    return (
      <section className="mx-auto container px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[380px_1fr_420px]">
          <div className="space-y-4">
            <div className="h-[260px] bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-[520px] bg-gray-200 rounded-[28px] animate-pulse"></div>
        </div>
      </section>
    );
  }

  // Function to check if content needs read more button (including bullet points)
  const needsReadMore = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textLength = tempDiv.textContent?.length || 0;
    // Show read more if content has more than 400 characters (purpose text + bullet points)
    return textLength > 400;
  };

  const needsReadMoreForPurpose = needsReadMore(parsedContent.purpose);

  return (
    <section className="mx-auto container px-4 py-12">
      <div className="grid gap-6 md:gap-8 lg:gap-10 grid-cols-1 md:grid-cols-[280px_1fr_280px] lg:grid-cols-[300px_1fr_320px] xl:grid-cols-[340px_1fr_360px] 2xl:grid-cols-[380px_1fr_420px]">
  
  {/* LEFT COLUMN */}
  <div className="space-y-4 md:border-r border-[#D9D9D9] ">
    <div className="overflow-hidden rounded-2xl md:me-0 lg:me-6 h-[200px] md:h-[240px] lg:h-[240px]">
      <img
        src="/about/mission-left.png"
        alt="Mission"
        width={380}
        height={260}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/380x260?text=20+Years";
        }}
      />
    </div>
    <div className="flex items-center gap-4 border-t border-[#D9D9D9] pt-10 mt-10">
      <span className="text-[60px] md:text-[70px] lg:text-[80px] xl:text-[90px] font-extrabold text-black leading-none">20</span>
      <div className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-black leading-tight">
        <span className="text-24 md:text-[30px] font-semibold text-black">+</span><br /><span className="text-14 md:text-[18px] font-semibold text-black">Year of <br /> Experience</span>
      </div>
    </div>
  </div>

  {/* CENTER CONTENT - This will now have more space */}
  <div className="min-w-0"> {/* Prevents overflow */}
    <div className="mb-6 md:mb-10 flex gap-4 md:gap-6 lg:gap-8 flex-wrap">
      {["mission", "purpose"].map((id, idx) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`relative pb-2 md:pb-3 transition-all text-[16px] md:text-[18px] lg:text-[20px] ${
            activeTab === id ? "font-semibold text-black" : "font-normal text-[#777777]"
          }`}
        >
          {idx + 1}. {id === "mission" ? "Mission & Vision" : "Purpose"}
          {activeTab === id && (
            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#000000]" />
          )}
        </button>
      ))}
    </div>

    <div className="min-h-[300px] pr-14">
      {activeTab === "mission" ? (
        <>
          <h4 className="mb-4 text-sm md:text-[16px] lg:text-[18px] font-medium text-black">Mission</h4>
          <div 
            className={contentStyle} 
            dangerouslySetInnerHTML={{ __html: parsedContent.mission }} 
          />
          
          <h4 className="mb-4 mt-6 text-sm md:text-[16px] lg:text-[18px] font-medium text-black">Vision</h4>
          <div 
            className={contentStyle} 
            dangerouslySetInnerHTML={{ __html: parsedContent.vision }} 
          />
        </>
      ) : (
        <>
          <h4 className="mb-3 text-sm md:text-[16px] lg:text-[18px] font-medium text-black">Purpose</h4>
          <div className="relative">
            <div
              className={`${contentStyle} transition-all duration-500 overflow-hidden ${
                !isExpanded && needsReadMoreForPurpose ? "max-h-[300px] mask-gradient" : "max-h-[5000px]"
              }`}
              dangerouslySetInnerHTML={{ __html: parsedContent.purpose }}
            />
            
            {needsReadMoreForPurpose && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 text-[11px] md:text-[12px] font-bold uppercase tracking-wider text-[#0B10A4] hover:text-[#F68A07] transition-colors flex items-center gap-2 group"
              >
                {isExpanded ? "Read Less ↑" : "Read More ↓"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  </div>

  {/* RIGHT COLUMN */}
  <div className="relative mt-6 md:mt-0">
    <div className="overflow-hidden rounded-[20px] md:rounded-[24px] lg:rounded-[28px] h-[350px] md:h-[400px] lg:h-[420px]">
      <img
        src="/about/mission-right.png"
        alt="Forensics"
        width={420}
        height={520}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/420x520?text=Expertise";
        }}
      />
    </div>
    <div className="absolute -left-4 md:-left-6 lg:-left-8 xl:-left-10 top-[45%] md:top-[50%] lg:top-50 max-w-[240px] md:max-w-[270px] lg:max-w-[300px] rounded-2xl bg-gradient-to-br from-[#0B10A4] to-[#04063E] p-5 md:p-6 lg:p-8 text-white shadow-2xl">
      <p className="mb-2 text-[10px] md:text-[12px] lg:text-[12px] font-semibold">Forensic Services</p>
      <h4 className="mb-4 md:mb-5 lg:mb-6 text-[16px] md:text-[20px] lg:text-[23px] font-semibold leading-snug">
        {/*{data?.newsletter_text || "Scientifically Revealing the Truth"}*/}
        Scientifically Revealing the Truth with Utmost Precision
      </h4>
      <Link
        to="/services"
        className="inline-flex items-center rounded-full border border-white/40 px-4 md:px-5 lg:px-6 py-1.5 md:py-2 text-[10px] md:text-[12px] lg:text-[12px] font-normal bg-[#04063E] text-white/80 hover:bg-white hover:text-[#04063E] transition-all"
      >
        Explore Services
      </Link>
    </div>
  </div>
</div>

      <style>{`
        .mask-gradient {
          mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
        }
        .about-list {
          list-style-type: disc !important;
          padding-left: 1.25rem !important;
          margin: 1rem 0 !important;
        }
        .about-list li {
          margin-bottom: 0.5rem !important;
          line-height: 1.6 !important;
        }
      `}</style>
    </section>
  );
}