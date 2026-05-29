import { Link } from "react-router-dom";
import { 
  Briefcase,
  GraduationCap,
} from "lucide-react";

// Map categories to images
const categoryImageMap: Record<string, string> = {
  "Junior Forensic Expert": "/career/default-forensic.png",
  "Senior Forensic Expert": "/career/default-forensic.png",
  "Crime Scene Investigator": "/career/default-forensic.png",
  "Forensic Expert": "/career/default-forensic.png",
};

// Default image for any other category
const DefaultImage = "/career/default-forensic.png";

// Default background color
const DefaultBgColor = "bg-[#F0F1FF]";

// Helper function to format date as "31st March, 2025"
const formatDeadline = (dateString: string) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'; // Catch 11th, 12th, 13th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  const ordinalSuffix = getOrdinalSuffix(day);
  
  return `${day}${ordinalSuffix} ${month}, ${year}`;
};

export default function JobCard({ job }: { job: any }) {
  // Get the image for this job's category
  const categoryImage = categoryImageMap[job.category_name] || DefaultImage;
  const bgColor = DefaultBgColor;

  // Helper function to strip HTML and get plain text
  const getPlainTextFromHTML = (html: string) => {
    if (!html) return "";
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    // Remove extra whitespace
    return text.trim();
  };

  const educationalText = getPlainTextFromHTML(job.educational_requirements);
  const formattedDeadline = formatDeadline(job.deadline);

  return (
    <Link to={`/career/${job.slug}`} className="block transition-all hover:translate-y-[-2px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-4 hover:shadow-md transition-shadow">
        
        {/* LEFT - Takes available space */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            {/* Image Circle - Fixed size with image */}
            <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full overflow-hidden`}>
              <img 
                src={categoryImage} 
                alt={job.category_name || "Category icon"}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Content - Takes remaining space with truncation */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[18px] sm:text-[20px] font-semibold text-black leading-tight truncate">
                {job.title}
              </h4>

              <div className="mt-1">
                <span className="font-semibold block text-[#0B10A4] text-[10px] tracking-wider mb-1">
                  {job.category_name}
                </span>
                
                {/* Educational Requirements - with line clamp 2 and ellipsis */}
                {educationalText && (
                  <div className="mt-1">
                    <span className="text-[11px] md:text-[14px] text-black font-semibold">
                      Educational Experience:
                    </span>
                    <span 
                      className="text-[11px] md:text-[14px] text-black font-light line-clamp-2 break-words block"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {educationalText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Fixed width, no distortion */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-2 flex-shrink-0">
          <span className="inline-block rounded border border-dashed border-[#898989] px-2 py-0.5 text-[12px] md:text-[14px] font-semibold text-black whitespace-nowrap">
            Exp: {job.experience || "N/A"}
          </span>

          <p className="text-[11px] md:text-[14px] font-normal text-black whitespace-nowrap">
            Deadline: {formattedDeadline}
          </p>
        </div>
      </div>
    </Link>
  );
}