// Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Mail, Phone, ChevronDown, Menu, X, ArrowRight, Globe } from 'lucide-react';
import MegaMenu from '@/components/common/MegaMenu';
import MobileMegaMenu from '@/components/common/MobileMegaMenu';
import { getBootData, getProducts, getDepartments, getLaboratories } from '@/services/webService';
import { API_BASE_URL } from '@/lib/config';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedLang, setSelectedLang] = useState<any>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [laboratories, setLaboratories] = useState<any[]>([]);
  
  // Mobile expanded state
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  useEffect(() => {
    async function loadBootData() {
      try {
        const res = await getBootData();
        if (res && res.success) {
          setData(res.data);
          const defaultLang = res.data.langs?.find((l: any) => l.is_default === 1) || res.data.langs?.[0];
          setSelectedLang(defaultLang);
        }
      } catch (err) {
        console.error("Failed to load header data:", err);
      }
    }
    loadBootData();

    async function loadProducts() {
      try {
        const res = await getProducts();
        if (res && res.success) {
          setProducts(res?.data?.data || []); 
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }
    loadProducts();

    const loadDepartmentsData = async () => {
      try {
        const deptRes = await getDepartments();
        console.log("Departments API response:", deptRes);
        
        if (deptRes && deptRes.success) {
          const departmentsArray = deptRes.data?.departments || [];
          console.log("Processed departments:", departmentsArray);
          setDepartments(departmentsArray);
          
          // Laboratories - fetch ALL pages
          const labRes = await getLaboratories();
          console.log("Laboratories API response:", labRes);

          if (labRes && labRes.success) {
            let allLabs = labRes?.data?.data || [];
            const totalPages = labRes?.data?.pagination?.total_pages || 1;
            
            // Fetch remaining pages if there are more
            for (let page = 2; page <= totalPages; page++) {
              const pageRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/laboratories?page=${page}`);
              const pageData = await pageRes.json();
              if (pageData.success && pageData.data?.data) {
                allLabs = [...allLabs, ...pageData.data.data];
              }
            }
            
            console.log(`Laboratories: ${allLabs.length} total (fetched from ${totalPages} pages)`);
            setLaboratories(allLabs);
          } else {
            setLaboratories([]);
          }
        } else {
          setDepartments([]);
          setLaboratories([]);
        }
      } catch (err) {
        console.error("Failed to load departments/laboratories:", err);
        setDepartments([]);
        setLaboratories([]);
      }
    }
    loadDepartmentsData();
  }, []);

  useEffect(() => {
    if (selectedLang) {
      document.documentElement.dir = selectedLang.rtl === 1 ? 'rtl' : 'ltr';
      document.documentElement.lang = selectedLang.code || 'en';
    }
  }, [selectedLang]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Get logo URL from API or fallback to hardcoded path
  const logoUrl = data?.bs?.logo || '/logo/logo.png';

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#04063E] text-white py-2 px-4 md:px-10 hidden md:flex justify-between items-center text-sm font-medium">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <a href={`mailto:${data?.bs?.support_email || 'contact@sifsindia.com'}`}>
              {data?.bs?.support_email || 'contact@sifsindia.com'}
            </a>
          </div>
          <div className="flex items-center gap-2 border-l border-white pl-8">
            <Phone size={16} />
            <a href={`tel:${data?.bs?.support_phone?.replace(/\s+/g, '') || '+911147074263'}`}>
              {data?.bs?.support_phone || '+91 114-707 4263'}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {/* Language Selector */}
          {Array.isArray(data?.langs) && data.langs.length > 0 && (
            <div className="relative border-r border-white/20 pr-6">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 hover:text-[#F68A07] transition-all uppercase tracking-wide"
              >
                <Globe size={14} className="text-white/70" />
                <span>{selectedLang?.name || 'Select Language'}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-3 w-40 bg-white text-gray-800 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-1">
                    {data.langs.map((lang: any) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setSelectedLang(lang);
                          setIsLangOpen(false);
                        }}
                        className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition-colors ${selectedLang?.id === lang.id ? 'bg-blue-50 text-[#0B10A4]' : ''}`}
                      >
                        {lang.name}
                        {selectedLang?.id === lang.id && <div className="w-1.5 h-1.5 rounded-full bg-[#0B10A4]"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            {data?.socials?.map((social: any) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer hover:text-blue-100 transition-colors"
              >
                <i className={`${social.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN Header - Fixed on scroll */}
      <div className="bg-white sticky top-0 z-50 px-4 md:px-6 lg:px-10 py-3 flex items-center justify-between shadow-sm md:gap-4">
        {/* LOGO - Dynamic from admin panel */}
        <Link to="/" className="flex items-center">
          <img
            src={logoUrl}
            alt={data?.bs?.website_title || "SIFS India Logo"}
            width={180}
            height={50}
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center md:gap-8 xl:gap-14 font-semibold text-gray-700">
          <Link to="/" className="hover:text-[#F68A07] text-lg md:text-[16px] font-normal text-black">Home</Link>

          {/* About Dropdown */}
          <div className="group relative">
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#F68A07] py-2 text-lg md:text-[16px] font-normal text-black">
              About <ChevronDown size={16} />
            </div>
            <div className="absolute left-0 top-full w-[220px] bg-white rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#ececec] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <ul className="py-2">
                <li>
                  <Link to="/about-us" className="block px-5 py-3 text-md  md:text-[14px] font-normal text-gray-700 hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/team" className="block px-5 py-3 text-md md:text-[14px] font-normal text-gray-700  hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition">
                    Experts & Associates
                  </Link>
                </li>
                <li>
                  <Link to="/portfolios" className="block px-5 py-3 text-md md:text-[14px] font-normal text-gray-700 hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition">
                    Our Clientele
                  </Link>
                </li>
                <li>
                  <Link to="/image-gallery" className="block px-5 py-3 text-md md:text-[14px] font-normal text-gray-700  hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition">
                    Image Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/video-gallery" className="block px-5 py-3 text-md md:text-[14px] font-normal text-gray-700  hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition">
                    Video Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/career" className="block px-5 py-3 text-md md:text-[14px] font-normal text-gray-700  hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition">
                    Career
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="block px-5 py-3 text-md md:text-[14px] font-normal text-gray-700  hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="block px-5 py-3 text-md md:text-[14px] font-normal text-gray-700  hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Services Mega Menu */}
          <MegaMenu trigger={<span className="text-lg md:text-[16px] font-normal text-black hover:text-[#F68A07] transition-colors">Services</span>} />

          {/* Department Dropdown */}
          {Array.isArray(departments) && departments.length > 0 && (
            <div className="group relative">
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#F68A07] py-2 text-lg md:text-[16px] font-normal text-black">
                Department <ChevronDown size={16} />
              </div>
              <div className="absolute left-0 top-full w-[240px] bg-white rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#ececec] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-[400px] overflow-y-auto">
                <ul className="py-2">
                  {departments.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/department/${item.slug}`}
                        className="block px-5 py-3 text-md md:text-[14px] font-regular text-gray-700  hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Laboratory Dropdown */}
          {Array.isArray(laboratories) && laboratories.length > 0 && (
            <div className="group relative">
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#F68A07] py-2 text-lg md:text-[16px] font-normal text-black">
                Laboratory <ChevronDown size={16} />
              </div>
              <div className="absolute left-0 top-full w-[260px] bg-white rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#ececec] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-[400px] overflow-y-auto">
                <ul className="py-2">
                  {laboratories.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/laboratory/${item.slug}`}
                        className="block px-5 py-3 text-md md:text-[14px] font-normal text-gray-700  hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Product Dropdown (Dynamic) */}
          <div className="group relative">
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#F68A07] py-2 text-lg md:text-[16px] font-normal text-black">
              Product <ChevronDown size={16} />
            </div>
            <div className="absolute left-0 top-full w-[240px] bg-white rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#ececec] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-[400px] overflow-y-auto">
              <ul className="py-2">
              {Array.isArray(products) && products.length > 0 ? (
                  products.map((item) => (
                    <li key={item.id}>
                      <Link to={`/product/${item.slug}`} className="block px-5 py-3 text-md md:text-[14px] font-normal text-gray-700  hover:bg-[#F5F7FF] hover:text-[#0B10A4] transition">
                        {item.name || item.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-5 py-3 text-sm text-gray-400 italic">No products available</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/contact" className="hidden md:flex bg-gradient-to-r from-[#0B10A4] to-[#04063E] text-white md:text-[14px] px-8 py-3 rounded-full font-semibold flex items-center gap-4 hover:from-[#1217c0] hover:to-[#0a0f6b] transition-all group">
            Contact Us <ArrowRight size={18} />
          </Link>

          <button className="lg:hidden p-2 bg-gray-100 rounded-md" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] z-[100] bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-6 font-semibold text-gray-700">
            <Link to="/" className="block text-lg border-b border-gray-50 pb-2" onClick={() => setIsOpen(false)}>
              Home
            </Link>

            {/* About Mobile */}
            <div className="border-b border-gray-50 pb-2">
              <button
                onClick={() => toggleMenu("about")}
                className="flex justify-between w-full text-left text-lg"
              >
                About <ChevronDown size={18} className={`transition-transform ${openMenu === "about" ? "rotate-180" : ""}`} />
              </button>

              {openMenu === "about" && (
                <div className="pl-4 mt-2 space-y-3 bg-gray-50 rounded-lg p-3">
                  <Link to="/about-us" className="block text-sm text-gray-600" onClick={() => setIsOpen(false)}>About Us</Link>
                  <Link to="/team" className="block text-sm text-gray-600" onClick={() => setIsOpen(false)}>Experts & Associates</Link>
                  <Link to="/portfolios" className="block text-sm text-gray-600" onClick={() => setIsOpen(false)}>Our Clientele</Link>
                  <Link to="/image-gallery" className="block text-sm text-gray-600" onClick={() => setIsOpen(false)}>Image Gallery</Link>
                  <Link to="/video-gallery" className="block text-sm text-gray-600" onClick={() => setIsOpen(false)}>Video Gallery</Link>
                  <Link to="/career" className="block text-sm text-gray-600" onClick={() => setIsOpen(false)}>Career</Link>
                  <Link to="/blogs" className="block text-sm text-gray-600" onClick={() => setIsOpen(false)}>Blog</Link>
                  <Link to="/faq" className="block text-sm text-gray-600" onClick={() => setIsOpen(false)}>FAQ</Link>
                </div>
              )}
            </div>

            {/* Services Mobile Mega Menu */}
            <div className="border-b border-gray-50 pb-2">
              <button
                onClick={() => toggleMenu("services")}
                className="flex justify-between w-full text-left text-lg"
              >
                Services <ChevronDown size={18} className={`transition-transform ${openMenu === "services" ? "rotate-180" : ""}`} />
              </button>

              {openMenu === "services" && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                  <MobileMegaMenu onClose={() => setIsOpen(false)} />
                </div>
              )}
            </div>

            {/* Department Mobile */}
            {Array.isArray(departments) && departments.length > 0 && (
              <div className="border-b border-gray-50 pb-2">
                <button
                  onClick={() => toggleMenu("departments")}
                  className="flex justify-between w-full text-left text-lg"
                >
                  Department
                  <ChevronDown size={18} className={`transition-transform ${openMenu === "departments" ? "rotate-180" : ""}`} />
                </button>

                {openMenu === "departments" && (
                  <div className="pl-4 mt-2 space-y-3 bg-gray-50 rounded-lg p-3">
                    {departments.map((item) => (
                      <Link key={item.id} className="block text-sm text-gray-600" to={`/department/${item.slug}`} onClick={() => setIsOpen(false)}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Laboratory Mobile */}
            {Array.isArray(laboratories) && laboratories.length > 0 && (
              <div className="border-b border-gray-50 pb-2">
                <button
                  onClick={() => toggleMenu("laboratories")}
                  className="flex justify-between w-full text-left text-lg"
                >
                  Laboratory
                  <ChevronDown size={18} className={`transition-transform ${openMenu === "laboratories" ? "rotate-180" : ""}`} />
                </button>

                {openMenu === "laboratories" && (
                  <div className="pl-4 mt-2 space-y-3 bg-gray-50 rounded-lg p-3">
                    {laboratories.map((item) => (
                      <Link key={item.id} className="block text-sm text-gray-600" to={`/laboratory/${item.slug}`} onClick={() => setIsOpen(false)}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Product Mobile */}
            <div className="border-b border-gray-50 pb-2">
              <button
                onClick={() => toggleMenu("products")}
                className="flex justify-between w-full text-left text-lg"
              >
                {data?.bs?.parent_product_name || 'Products'} 
                <ChevronDown size={18} className={`transition-transform ${openMenu === "products" ? "rotate-180" : ""}`} />
              </button>

              {openMenu === "products" && (
                <div className="pl-4 mt-2 space-y-3 bg-gray-50 rounded-lg p-3">
                  {products.map((item) => (
                    <Link key={item.id} className="block text-sm text-gray-600" to={`/product/${item.slug}`} onClick={() => setIsOpen(false)}>
                      {item.name || item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/contact" className="block text-gray-600 text-lg pt-2" onClick={() => setIsOpen(false)}>
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;