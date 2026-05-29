import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

type Props = {
  blog: {
    id: number;
    title: string;
    meta_description: string;
    main_image: string;
    created_at: string;
    slug: string;
    content: string;
    author: string;
  };
};

export default function BlogCard({ blog }: Props) {
  const [imgError, setImgError] = useState(false);

  const originalUrl = blog.main_image?.replace("http://", "https://") || "";
  const imageUrl = imgError || !originalUrl ? "/blog/placeholder.png" : originalUrl;

  const formattedDate = blog.created_at 
    ? new Date(blog.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date not available";

  // Advanced excerpt extraction
  const excerpt = useMemo(() => {
    if (!blog.content) return "No description available";
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blog.content;
    
    // Get all paragraphs
    const paragraphs = tempDiv.querySelectorAll('p');
    let meaningfulParagraph = '';
    
    // Find first meaningful paragraph (not containing metadata)
    for (let i = 0; i < paragraphs.length; i++) {
      const text = paragraphs[i].textContent?.trim() || '';
      
      // Skip paragraphs that look like metadata
      const isMetadata = 
        /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i.test(text) ||
        /BY\s+[\w\s]+/i.test(text) ||
        /^\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i.test(text) ||
        text.length < 30; // Skip very short paragraphs
        
      if (!isMetadata && text.length > 50) {
        meaningfulParagraph = text;
        break;
      }
    }
    
    // If no meaningful paragraph found, use the longest paragraph
    if (!meaningfulParagraph && paragraphs.length > 0) {
      let longestText = '';
      for (let i = 0; i < paragraphs.length; i++) {
        const text = paragraphs[i].textContent?.trim() || '';
        if (text.length > longestText.length && text.length > 30) {
          longestText = text;
        }
      }
      meaningfulParagraph = longestText;
    }
    
    // Clean up the text
    let textOnly = meaningfulParagraph || tempDiv.textContent || tempDiv.innerText || '';
    
    // Remove any remaining metadata patterns
    textOnly = textOnly.replace(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\s*-\s*BY\s+[\w\s]+/gi, '');
    textOnly = textOnly.replace(/BY\s+[\w\s]+\s*[-|]?\s*/gi, '');
    textOnly = textOnly.replace(/^\s*\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*-\s*/gi, '');
    
    // Clean up whitespace
    textOnly = textOnly.replace(/\s+/g, " ").trim();
    
    // If still empty, use meta_description as fallback
    if (!textOnly || textOnly.length < 20) {
      textOnly = blog.meta_description || "No description available";
    }
    
    // Limit length for card preview (aim for 2-3 lines)
    const maxLength = 200;
    if (textOnly.length > maxLength) {
      // Try to cut at a word boundary
      const lastSpace = textOnly.lastIndexOf(' ', maxLength);
      const cutPoint = lastSpace > 0 ? lastSpace : maxLength;
      textOnly = textOnly.substring(0, cutPoint).trim() + "...";
    }
    
    return textOnly;
  }, [blog.content, blog.meta_description]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-[200px] w-full sm:w-[280px] md:w-[300px] flex-shrink-0 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          onError={() => {
            if (!imgError) setImgError(true);
          }}
        />
      </div>

      <div className="p-4 flex flex-col justify-center items-start flex-1">
        <Link to={`/blogs/${blog.slug}`}>
          <h3 className="cursor-pointer text-[14px] md:text-[16.66px] font-semibold text-black hover:text-[#0B10A4] transition leading-tight line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2 font-regular text-[13.33px] text-[#555555]">
          <div className="flex items-center gap-2">
            <svg
              className="opacity-70 w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formattedDate}
          </div>
          {blog.author && (
            <>
              <span className="text-[#555555] opacity-50">•</span>
              <div className="flex items-center gap-2">
                <svg
                  className="opacity-70 w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                By {blog.author}
              </div>
            </>
          )}
        </div>

        <p className="mt-2 text-[15px] text-[#777777] font-regular line-clamp-3 leading-relaxed mb-3">
          {excerpt}
        </p>

        <Link 
          to={`/blogs/${blog.slug}`}
          className="inline-flex items-center gap-4 bg-gradient-to-r from-[#04063E] to-[#090E92] text-white px-10 py-3 text-[12px] rounded-full font-bold cursor-pointer border-none no-underline transition-all hover:opacity-90"
        >
          READ MORE →
        </Link>
      </div>
    </div>
  );
}