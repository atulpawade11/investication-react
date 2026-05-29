import React, { useState } from 'react';
import { Link2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageBanner from '@/components/common/PageBanner';
import { useBoot } from '@/context/BootContext';

interface BlogDetailClientProps {
  children: React.ReactNode;
  title: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  prevPost?: {
    slug: string;
    title: string;
  } | null;
  nextPost?: {
    slug: string;
    title: string;
  } | null;
}

export default function BlogDetailClient({ 
  children, 
  title, 
  slug,
  metaTitle,
  metaDescription,
  prevPost,
  nextPost
}: BlogDetailClientProps) {
  const { breadcrumbImage } = useBoot();
  const [copied, setCopied] = useState(false);

  const share = (platform: string) => {
    const url = window.location.href;
    const shareLinks: Record<string, string> = {
      fb: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    };
    
    // Instagram and YouTube - copy link since no direct share URL
    if (platform === 'ig' || platform === 'yt') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Page Banner */}
      {/*<PageBanner
        title={metaTitle || title || "Blog Details"}
        subtitle={metaDescription || "Explore our latest forensic insights and discoveries"}
        breadcrumbImage={breadcrumbImage}
      />*/}

      <PageBanner
        title="Latest News & Blog"
        subtitle="Forensic Discoveries: From Lab to Field"
        breadcrumbImage={breadcrumbImage}
      />

      {/* Content Container */}
      <div className="mx-auto container px-4 md:px-10 py-12 relative">
        {/* Blog Content */}
        {children}

        {/* Social Share + Navigation - inside content width, not full width */}
        <div className="max-w-5xl">
          {/* Social Share After Content */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-bold text-gray-700 tracking-wider">Share this Article:</span>
              <div className="flex gap-2">
                {/* Facebook */}
                <button 
                  onClick={() => share('fb')} 
                  className="p-3 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all"
                  aria-label="Share on Facebook"
                >
                  <FaFacebook size={18}/>
                </button>
                
                {/* X (Twitter) */}
                <button 
                  onClick={() => share('x')} 
                  className="p-3 rounded-full bg-black/10 text-black hover:bg-black hover:text-white transition-all"
                  aria-label="Share on X"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                
                {/* Instagram */}
                <button 
                  onClick={() => share('ig')} 
                  className="p-3 rounded-full bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all"
                  aria-label="Share on Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </button>
                
                {/* YouTube */}
                <button 
                  onClick={() => share('yt')} 
                  className="p-3 rounded-full bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all"
                  aria-label="Share on YouTube"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </button>
                
                {/* Copy Link */}
                {/*<button 
                  onClick={copyToClipboard} 
                  className={`p-3 rounded-full transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-800 hover:text-white'}`}
                  aria-label="Copy link"
                >
                  {copied ? <Check size={18}/> : <Link2 size={18}/>}
  </button>*/}
              </div>
            </div>
          </div>

          {/* Previous / Next Post Navigation */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Previous Post */}
            {prevPost ? (
              <Link 
                to={`/blogs/${prevPost.slug}`}
                className="group flex items-center gap-4 px-5 py-10 rounded-xl border border-gray-200 bg-white hover:border-[#0B4F8A] hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-[#0B4F8A] flex items-center justify-center transition-colors">
                  <ChevronLeft size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] text-gray-600 font-regular mb-3">Prev Article</p>
                  <p className="text-[16.36px] font-semibold text-black group-hover:text-[#0B4F8A] truncate transition-colors">
                    {prevPost.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {/* Next Post */}
            {nextPost ? (
              <Link 
                to={`/blogs/${nextPost.slug}`}
                className="group flex items-center justify-end gap-4 px-5 py-10 rounded-xl border border-gray-200 bg-white hover:border-[#0B4F8A] hover:shadow-md transition-all"
              >
                <div className="min-w-0 text-right">
                  <p className="text-[12px] text-gray-600 font-regular mb-3">Next Article</p>
                  <p className="text-[16.36px] font-semibold text-black group-hover:text-[#0B4F8A] truncate transition-colors">
                    {nextPost.title}
                  </p>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-[#0B4F8A] flex items-center justify-center transition-colors">
                  <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        .blog-content-area img {
          border-radius: 12px;
          margin: 24px 0;
          height: auto;
          width: 100%;
        }
        .blog-content-area p {
          margin-bottom: 1.2rem;
        }
        .blog-content-area h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 2rem;
          color: #1a202c;
        }
      `}</style>
    </>
  );
}