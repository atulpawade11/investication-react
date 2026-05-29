import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { MoveRight, Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from '@/lib/config';

export default function Footer() {
  const [footerData, setFooterData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  
  // Social media links from API
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://www.facebook.com/ForensicScienceInstitute",
    twitter: "https://twitter.com/sifsinstitute",
    instagram: "https://www.instagram.com/forensicscienceinstitute",
    linkedin: "https://www.linkedin.com/school/forensicscienceinstitute/"
  });
  
  // Subscription States
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        const result = await response.json();
        if (result.success) {
          setFooterData(result.data.bs);
          setServices(result.data.serviceCategories?.slice(0, 6) || []);
          
          // Try to extract social media from team members if available
          if (result.data.members && result.data.members.length > 0) {
            const orgMember = result.data.members.find((member: any) => 
              member.name === "Niharika Mishra" || 
              member.facebook?.includes("ForensicScienceInstitute")
            );
            if (orgMember) {
              setSocialLinks({
                facebook: orgMember.facebook || socialLinks.facebook,
                twitter: orgMember.twitter || socialLinks.twitter,
                instagram: orgMember.instagram || socialLinks.instagram,
                linkedin: orgMember.linkedin || socialLinks.linkedin
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching footer:', err);
      }
    };
    fetchFooterData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage(result.message || "Successfully subscribed!");
        setEmail(""); 
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error(result.message || "Subscription failed");
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || "Something went wrong.");
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <footer className="bg-[#232827] text-white">
      {/* TOP CTA / NEWSLETTER */}
      <div className="mx-auto container px-4 pt-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <h2 className="text-[40px] font-bold text-white flex items-center w-auto md:w-1/2">
          {footerData?.newsletter_text || "Let’s contact"}

          <img
            src="/footer-arrow.png"
            alt="arrow"
            width={60}
            height={60}
            className="rotate-[-5deg]"
          />
        </h2>

          <form onSubmit={handleSubscribe} className="relative  transition-all w-auto md:w-1/3">
            <h4 className="text-white font-bold text-[24px] mb-3">Subscribe to our newletter</h4>
            <div className="flex w-full items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white text-sm text-black placeholder:text-black rounded-full px-4 py-4 "
              />
              <button 
                disabled={status === 'loading' || status === 'success'}
                className="ml-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#04063E] hover:bg-[#04063E] transition disabled:bg-gray-600"
              >
                {status === 'loading' ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : status === 'success' ? (
                  <CheckCircle2 size={16} className="text-white" />
                ) : (
                  <MoveRight size={16} className="text-white" />
                )}
              </button>
            </div>
            
            {status !== 'idle' && (
              <span className={`absolute -bottom-7 left-4 text-[11px] font-medium tracking-wide ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </span>
            )}
          </form>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="mx-auto container px-4 pb-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* ABOUT - 3 cols */}
          <div className="lg:pr-6  pt-10">
            <div className="mb-4 flex gap-2">
              <img 
                src={footerData?.footer_logo || "/logo/sifs-footer.png"} 
                alt="SIFS" 
                width={122} 
                height={122} 
                className="object-contain"
                
              />
            </div>
            <p className="text-[15px] font-light leading-relaxed text-white">
              {footerData?.footer_text || "Leading private Forensic Science Laboratory in India."}
            </p>
            <h4 className="mb-4 text-[18px] font-semibold text-white mt-5">Follow Us</h4>
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="flex gap-4 text-white items-center">
                <Link to={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <img src="/x.png" alt="X" className="w-3 h-3" />
                </Link>

                <Link to={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <img src="/facebook.png" alt="Facebook" className="w-3 h-3" />
                </Link>

                <Link to={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <img src="/instagram.png" alt="Instagram" className="w-3 h-3" />
                </Link>

                <Link to={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <img src="/linkedin.png" alt="LinkedIn" className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* QUICK LINKS - 2 cols */}
          <div className="lg:px-6 ">
            <h4 className="mb-4 text-[18px] font-semibold text-white pt-10">Quick Link</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about-us" className="text-white transition-colors flex items-center gap-2 text-[15px] font-light leading-relaxed"><span className="text-white text-[14px] font-light leading-relaxed">›</span> About SIFS</Link></li>
              <li><Link to="/services" className="text-white transition-colors flex items-center gap-2 text-[15px] font-light leading-relaxed"><span className="text-white text-[14px] font-light leading-relaxed">›</span>  Services</Link></li>
              <li><Link to="/team" className="text-white transition-colors flex items-center gap-2 text-[15px] font-light leading-relaxed"><span className="text-white text-[14px] font-light leading-relaxed">›</span> Our Experts</Link></li>
              <li><Link to="/portfolios" className="text-white transition-colors flex items-center gap-2 text-[15px] font-light leading-relaxed"><span className="text-white text-[14px] font-light leading-relaxed">›</span> Our Clients</Link></li>
              <li><Link to="/career" className="text-white transition-colors flex items-center gap-2 text-[15px] font-light leading-relaxed"><span className="text-white text-[14px] font-light leading-relaxed">›</span> Career</Link></li>
              <li><Link to="/blogs" className="text-white transition-colors flex items-center gap-2 text-[15px] font-light leading-relaxed"><span className="text-white text-[14px] font-light leading-relaxed">›</span> Blog</Link></li>
            </ul>
          </div>

          {/* SERVICES - 2 cols */}
          <div className="lg:px-6">
            <h4 className="mb-4 text-[18px] font-semibold text-white pt-10">Services</h4>
            <ul className="space-y-3 text-white text-[15px] font-light">
              {services.length > 0 ? (
                services.map((service) => {
                  const serviceSlug = service.slug || service.name.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <li key={service.id}>
                      <Link to={`/services/${serviceSlug}`} className="text-white transition-colors line-clamp-1 flex items-center gap-2">
                        <span className="text-white text-[15px] font-light leading-relaxed">›</span> {service.name}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <>
                  <li><Link to="/services/document-examination" className="text-white text-[15px] font-light leading-relaxed">› Document Examination</Link></li>
                  <li><Link to="/services/fingerprint-analysis" className="text-white text-[15px] font-light leading-relaxed">› Fingerprint Analysis</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* CONTACT & MAP FLEX SECTION - 5 cols */}
          <div className="lg:pl-6">
            <h4 className="mb-4 text-[18px] font-semibold text-white pt-10">Contact Information</h4>
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="w-full md:w-1/2">
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <Mail size={14} className="text-white shrink-0" />
                    {footerData?.contact_mail || "contact@sifsindia.com"}
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone size={14} className="text-white shrink-0" />
                    {footerData?.support_phone || "+91 114-707-4263"}
                  </li>
                </ul>
              </div>
            </div>
            <h4 className="mb-4 text-[18px] font-semibold text-white mt-5">Delhi Office</h4>
            <div className="flex items-start gap-3">
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2 group transition-colors hover:text-white">
                  <MapPin size={14} className="text-white shrink-0 mt-1" /> 
                  <span>
                    A-14, Mahendru Enclave, Model Town Metro, Delhi-110009, India
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-[#1F2423] py-4 text-xs text-gray-400 border-t border-[#343D3B]">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-center gap-2">
          <div 
            className="inline-flex items-center gap-1 footer-copyright-inline text-[15px] font-light text-white [&_p]:inline [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: footerData?.copyright_text || "© 2026 SIFS India." }} 
          />
          
          {/*<span className="hidden md:block mx-1">|</span>
          
          <div className="flex gap-3">
            <Link to="/" className="hover:text-white text-[15px] font-light text-white">Terms of Use</Link>
            <span>|</span>
            <Link to="/" className="hover:text-white text-[15px] font-light text-white">Privacy</Link>
            <span>|</span>
            <Link to="/" className="hover:text-white text-[15px] font-light text-white">Site map</Link>
              </div>*/}
        </div>
      </div>
    </footer>
  );
}