import { useState } from "react";
;
import { X } from "lucide-react";

// --- STATIC DATA ---
const SECTOR_NAME_MAP: Record<string, string> = {
  "1": "Courts",
  "2": "Govt Dept",
  "3": "State Police",
  "4": "Insurance Sector",
  "5": "Indian Bank",
  "6": "Corporates",
  "7": "Law Firms",
  "8": "Detectives",
  "9": "Others"
};

// Static header data
const HEADER_DATA = {
  title: "OUR CLIENTELE",
  subtitle: "Satisfied Clients' Portfolio"
};

// All categories (keep all for sidebar)
const ALL_CATEGORIES = [
  { id: "1", name: "Courts" },
  { id: "2", name: "Govt Dept" },
  { id: "3", name: "State Police" },
  { id: "4", name: "Insurance Sector" },
  { id: "5", name: "Indian Bank" },
  { id: "6", name: "Corporates" },
  { id: "7", name: "Law Firms" },
  { id: "8", name: "Detectives" },
  { id: "9", name: "Others" }
];

// EXACTLY 20 STATIC PORTFOLIO ITEMS
const STATIC_PORTFOLIOS = [
  {
    id: 1,
    client_category_id: "1",
    title: "Cadilla",
    featured_image: "/about/cadila.png",
    content: `<p>Cadila Pharmaceuticals Ltd. stands as one of India's largest privately held pharmaceutical firms. For over seven decades, they have dedicated themselves to crafting affordable medications for patients globally. Their innovation-driven drug discovery methods prioritize the health and wellness of individuals worldwide. As a care-focused and research-oriented entity, they uphold the highest ethical standards in clinical research and medical practices. Their aim is not only to deliver quality pharmaceuticals but also to conduct our operations with integrity, ensuring trust and value in all their endeavors. Through investments in R&D, they have achieved medical breakthroughs that transform lives.</p>`
  },
  {
    id: 2,
    client_category_id: "1",
    title: "Delhi University",
    featured_image: "/about/delhi-university.png",
    content: `<p>The University of Delhi indeed stands as a beacon of academic excellence in India, tracing its roots back to 1922, when it was established with a unitary, teaching, and residential model. Delhi University's rich legacy, diverse educational programs, eminent faculty, and notable alumni collectively contribute to its esteemed reputation both nationally and internationally. With a wide array of academic disciplines and vibrant co-curricular activities, it offers students a holistic learning experience, preparing them not only for their chosen careers but also for contributing meaningfully to society, and serves as a role model for other universities.</p>`
  },
  {
    id: 3,
    client_category_id: "2",
    title: "Income Tax Department",
    featured_image: "/about/lawfirm.png",
    content: `<p>The Income Tax Department operates under the Central Board for Direct Taxes (CBDT), functioning within the Department of Revenue under the Ministry of Finance. It provides comprehensive information regarding its organizational structure, functions, tax laws, international taxation, and more. Users can find details about PAN, TAN, TDS, Form 16, the Tax Information Network, the Tax Return Prepare Scheme (TRPS), Aaykar Sampark Kendra (ASK), and taxpayer-related information. Additionally, online services like filing income tax returns, making tax payments, viewing tax credits, and checking tax return status are accessible to users, facilitating convenient tax compliance and administration.</p>`
  },
  {
    id: 4,
    client_category_id: "2",
    title: "Veterinary Council of India",
    featured_image: "/about/bank.png",
    content: `<p>The Veterinary Council of India (VCI) is a statutory body formed under the Indian Veterinary Council Act 1984. It receives full financial support from the Department of Animal Husbandry and Dairying, Ministry of Fisheries, Animal Husbandry, and Dairying, Government of India, to sustain its operations. Established by the central government through a Gazette notification dated August 2, 1989, VCI's primary role is to regulate veterinary practice and uphold standards in veterinary education. It oversees the Indian Veterinary Practitioners' Register, conducts elections for council members, and handles related matters.</p>`
  },
  {
    id: 5,
    client_category_id: "3",
    title: "Maharashtra Police",
    featured_image: "/about/insurance.png",
    content: `<p>The National Human Rights Commission (NHRC) of India, established on October 12, 1993, operates under the Protection of Human Rights Act (PHRA), 1993, as amended by the Protection of Human Rights (Amendment) Act, 2006. Aligned with the Paris Principles, endorsed by the UN General Assembly, it embodies India's commitment to promoting and safeguarding human rights. The NHRC's mandate, outlined in Section 2(1)(d) of the PHRA, encompasses rights to life, liberty, equality, and dignity guaranteed by the Constitution or international covenants, enforceable by Indian courts. Serving as a guardian of human rights, the NHRC plays a crucial role in upholding these fundamental values in India.</p>`
  },
  {
    id: 6,
    client_category_id: "1",
    title: "Cadilla",
    featured_image: "/about/cadila.png",
    content: `<p>Cadila Pharmaceuticals Ltd. stands as one of India's largest privately held pharmaceutical firms. For over seven decades, they have dedicated themselves to crafting affordable medications for patients globally. Their innovation-driven drug discovery methods prioritize the health and wellness of individuals worldwide. As a care-focused and research-oriented entity, they uphold the highest ethical standards in clinical research and medical practices. Their aim is not only to deliver quality pharmaceuticals but also to conduct our operations with integrity, ensuring trust and value in all their endeavors. Through investments in R&D, they have achieved medical breakthroughs that transform lives.</p>`
  },
  {
    id: 7,
    client_category_id: "1",
    title: "Delhi University",
    featured_image: "/about/delhi-university.png",
    content: `<p>The University of Delhi indeed stands as a beacon of academic excellence in India, tracing its roots back to 1922, when it was established with a unitary, teaching, and residential model. Delhi University's rich legacy, diverse educational programs, eminent faculty, and notable alumni collectively contribute to its esteemed reputation both nationally and internationally. With a wide array of academic disciplines and vibrant co-curricular activities, it offers students a holistic learning experience, preparing them not only for their chosen careers but also for contributing meaningfully to society, and serves as a role model for other universities.</p>`
  },
  {
    id: 8,
    client_category_id: "2",
    title: "Income Tax Department",
    featured_image: "/about/lawfirm.png",
    content: `<p>The Income Tax Department operates under the Central Board for Direct Taxes (CBDT), functioning within the Department of Revenue under the Ministry of Finance. It provides comprehensive information regarding its organizational structure, functions, tax laws, international taxation, and more. Users can find details about PAN, TAN, TDS, Form 16, the Tax Information Network, the Tax Return Prepare Scheme (TRPS), Aaykar Sampark Kendra (ASK), and taxpayer-related information. Additionally, online services like filing income tax returns, making tax payments, viewing tax credits, and checking tax return status are accessible to users, facilitating convenient tax compliance and administration.</p>`
  },
  {
    id: 9,
    client_category_id: "2",
    title: "Veterinary Council of India",
    featured_image: "/about/bank.png",
    content: `<p>The Veterinary Council of India (VCI) is a statutory body formed under the Indian Veterinary Council Act 1984. It receives full financial support from the Department of Animal Husbandry and Dairying, Ministry of Fisheries, Animal Husbandry, and Dairying, Government of India, to sustain its operations. Established by the central government through a Gazette notification dated August 2, 1989, VCI's primary role is to regulate veterinary practice and uphold standards in veterinary education. It oversees the Indian Veterinary Practitioners' Register, conducts elections for council members, and handles related matters.</p>`
  },
  {
    id: 10,
    client_category_id: "3",
    title: "Maharashtra Police",
    featured_image: "/about/insurance.png",
    content: `<p>The National Human Rights Commission (NHRC) of India, established on October 12, 1993, operates under the Protection of Human Rights Act (PHRA), 1993, as amended by the Protection of Human Rights (Amendment) Act, 2006. Aligned with the Paris Principles, endorsed by the UN General Assembly, it embodies India's commitment to promoting and safeguarding human rights. The NHRC's mandate, outlined in Section 2(1)(d) of the PHRA, encompasses rights to life, liberty, equality, and dignity guaranteed by the Constitution or international covenants, enforceable by Indian courts. Serving as a guardian of human rights, the NHRC plays a crucial role in upholding these fundamental values in India.</p>`
  },
  {
    id: 11,
    client_category_id: "1",
    title: "Cadilla",
    featured_image: "/about/cadila.png",
    content: `<p>Cadila Pharmaceuticals Ltd. stands as one of India's largest privately held pharmaceutical firms. For over seven decades, they have dedicated themselves to crafting affordable medications for patients globally. Their innovation-driven drug discovery methods prioritize the health and wellness of individuals worldwide. As a care-focused and research-oriented entity, they uphold the highest ethical standards in clinical research and medical practices. Their aim is not only to deliver quality pharmaceuticals but also to conduct our operations with integrity, ensuring trust and value in all their endeavors. Through investments in R&D, they have achieved medical breakthroughs that transform lives.</p>`
  },
  {
    id: 12,
    client_category_id: "1",
    title: "Delhi University",
    featured_image: "/about/delhi-university.png",
    content: `<p>The University of Delhi indeed stands as a beacon of academic excellence in India, tracing its roots back to 1922, when it was established with a unitary, teaching, and residential model. Delhi University's rich legacy, diverse educational programs, eminent faculty, and notable alumni collectively contribute to its esteemed reputation both nationally and internationally. With a wide array of academic disciplines and vibrant co-curricular activities, it offers students a holistic learning experience, preparing them not only for their chosen careers but also for contributing meaningfully to society, and serves as a role model for other universities.</p>`
  },
  {
    id: 13,
    client_category_id: "2",
    title: "Income Tax Department",
    featured_image: "/about/lawfirm.png",
    content: `<p>The Income Tax Department operates under the Central Board for Direct Taxes (CBDT), functioning within the Department of Revenue under the Ministry of Finance. It provides comprehensive information regarding its organizational structure, functions, tax laws, international taxation, and more. Users can find details about PAN, TAN, TDS, Form 16, the Tax Information Network, the Tax Return Prepare Scheme (TRPS), Aaykar Sampark Kendra (ASK), and taxpayer-related information. Additionally, online services like filing income tax returns, making tax payments, viewing tax credits, and checking tax return status are accessible to users, facilitating convenient tax compliance and administration.</p>`
  },
  {
    id: 14,
    client_category_id: "2",
    title: "Veterinary Council of India",
    featured_image: "/about/bank.png",
    content: `<p>The Veterinary Council of India (VCI) is a statutory body formed under the Indian Veterinary Council Act 1984. It receives full financial support from the Department of Animal Husbandry and Dairying, Ministry of Fisheries, Animal Husbandry, and Dairying, Government of India, to sustain its operations. Established by the central government through a Gazette notification dated August 2, 1989, VCI's primary role is to regulate veterinary practice and uphold standards in veterinary education. It oversees the Indian Veterinary Practitioners' Register, conducts elections for council members, and handles related matters.</p>`
  },
  {
    id: 15,
    client_category_id: "3",
    title: "Maharashtra Police",
    featured_image: "/about/insurance.png",
    content: `<p>The National Human Rights Commission (NHRC) of India, established on October 12, 1993, operates under the Protection of Human Rights Act (PHRA), 1993, as amended by the Protection of Human Rights (Amendment) Act, 2006. Aligned with the Paris Principles, endorsed by the UN General Assembly, it embodies India's commitment to promoting and safeguarding human rights. The NHRC's mandate, outlined in Section 2(1)(d) of the PHRA, encompasses rights to life, liberty, equality, and dignity guaranteed by the Constitution or international covenants, enforceable by Indian courts. Serving as a guardian of human rights, the NHRC plays a crucial role in upholding these fundamental values in India.</p>`
  },
  {
    id: 16,
    client_category_id: "1",
    title: "Cadilla",
    featured_image: "/about/cadila.png",
    content: `<p>Cadila Pharmaceuticals Ltd. stands as one of India's largest privately held pharmaceutical firms. For over seven decades, they have dedicated themselves to crafting affordable medications for patients globally. Their innovation-driven drug discovery methods prioritize the health and wellness of individuals worldwide. As a care-focused and research-oriented entity, they uphold the highest ethical standards in clinical research and medical practices. Their aim is not only to deliver quality pharmaceuticals but also to conduct our operations with integrity, ensuring trust and value in all their endeavors. Through investments in R&D, they have achieved medical breakthroughs that transform lives.</p>`
  },
  {
    id: 17,
    client_category_id: "1",
    title: "Delhi University",
    featured_image: "/about/delhi-university.png",
    content: `<p>The University of Delhi indeed stands as a beacon of academic excellence in India, tracing its roots back to 1922, when it was established with a unitary, teaching, and residential model. Delhi University's rich legacy, diverse educational programs, eminent faculty, and notable alumni collectively contribute to its esteemed reputation both nationally and internationally. With a wide array of academic disciplines and vibrant co-curricular activities, it offers students a holistic learning experience, preparing them not only for their chosen careers but also for contributing meaningfully to society, and serves as a role model for other universities.</p>`
  },
  {
    id: 18,
    client_category_id: "2",
    title: "Income Tax Department",
    featured_image: "/about/lawfirm.png",
    content: `<p>The Income Tax Department operates under the Central Board for Direct Taxes (CBDT), functioning within the Department of Revenue under the Ministry of Finance. It provides comprehensive information regarding its organizational structure, functions, tax laws, international taxation, and more. Users can find details about PAN, TAN, TDS, Form 16, the Tax Information Network, the Tax Return Prepare Scheme (TRPS), Aaykar Sampark Kendra (ASK), and taxpayer-related information. Additionally, online services like filing income tax returns, making tax payments, viewing tax credits, and checking tax return status are accessible to users, facilitating convenient tax compliance and administration.</p>`
  },
  {
    id: 19,
    client_category_id: "2",
    title: "Veterinary Council of India",
    featured_image: "/about/bank.png",
    content: `<p>The Veterinary Council of India (VCI) is a statutory body formed under the Indian Veterinary Council Act 1984. It receives full financial support from the Department of Animal Husbandry and Dairying, Ministry of Fisheries, Animal Husbandry, and Dairying, Government of India, to sustain its operations. Established by the central government through a Gazette notification dated August 2, 1989, VCI's primary role is to regulate veterinary practice and uphold standards in veterinary education. It oversees the Indian Veterinary Practitioners' Register, conducts elections for council members, and handles related matters.</p>`
  },
  {
    id: 20,
    client_category_id: "3",
    title: "Maharashtra Police",
    featured_image: "/about/insurance.png",
    content: `<p>The National Human Rights Commission (NHRC) of India, established on October 12, 1993, operates under the Protection of Human Rights Act (PHRA), 1993, as amended by the Protection of Human Rights (Amendment) Act, 2006. Aligned with the Paris Principles, endorsed by the UN General Assembly, it embodies India's commitment to promoting and safeguarding human rights. The NHRC's mandate, outlined in Section 2(1)(d) of the PHRA, encompasses rights to life, liberty, equality, and dignity guaranteed by the Constitution or international covenants, enforceable by Indian courts. Serving as a guardian of human rights, the NHRC plays a crucial role in upholding these fundamental values in India.</p>`
  }
];

const DEFAULT_IMAGE = "/images/clients/placeholder.png";

export default function ClientelePortfolio() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const portfolios = STATIC_PORTFOLIOS;
  const categories = ALL_CATEGORIES;
  const header = HEADER_DATA;

  // Filter portfolios based on active tab
  const filteredLogos = portfolios.filter((p) => {
    if (activeTab === "All") return true;
    const currentCat = categories.find(c => c.name === activeTab);
    return currentCat ? String(p.client_category_id) === String(currentCat.id) : false;
  });

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Check if current category has data
  const hasData = filteredLogos.length > 0;

  return (
    <section className="mx-auto container px-4 py-12 lg:py-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">
        
        {/* SIDEBAR - Filter Navigation */}
        <aside className="lg:sticky lg:top-24 z-30">
          <div className="rounded-2xl bg-white py-4 shadow-lg border border-gray-100">
          <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setActiveTab("All")} 
                  className={`relative flex w-full items-center px-4 py-2 transition ${
                    activeTab === "All" 
                      ? "text-[14px] font-semibold text-[#1C274C] border-l-2 border-[#1C274C]" 
                      : "text-[14px] font-normal text-[#777777]"
                  }`}
                >
                  All Portfolios
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => setActiveTab(cat.name)} 
                    className={`relative flex w-full items-center px-4 py-2 transition ${
                      activeTab === cat.name 
                        ? "text-[14px] font-semibold text-[#1C274C] border-l-2 border-[#1C274C]" 
                        : "text-[14px] font-normal text-[#777777]"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* LOGO GRID AREA */}
        <div className="relative min-h-[400px]">
          
          {/* BACKGROUND DECORATIVE BADGE - Only show when there are items */}
          {/*{hasData && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="h-[280px] w-[280px] md:h-[300px] md:w-[300px] rounded-full border border-dashed border-[#c7c7c7] flex flex-col items-center justify-center text-center p-8 bg-white/10 backdrop-blur-[2px]">
                <p className="text-[14px] font-semibold text-black mb-2">{header.title}</p>
                <h4 className="text-[24px] font-[900] text-black leading-tight">{header.subtitle}</h4>
              </div>
            </div>
          )} */}

          {/* GRID OF LOGOS - Foreground - 5 columns on desktop */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full relative z-10">
            {filteredLogos.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)} 
                className="group flex h-[95px] cursor-pointer items-center justify-center rounded-3xl bg-[#EBEBEB] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 backdrop-blur-md"
              >
                <div className="relative h-16 w-full flex items-center justify-center transition-all duration-500 transform">
                  <img 
                    src={item.featured_image} 
                    alt={item.title} 
                     
                    className="object-contain p-2 " 
                    
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Empty State - Shows when category has no data */}
          {!hasData && (
            <div className="flex flex-col items-center justify-center min-h-[500px] relative z-20">
              <div className="text-center max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Portfolios Yet</h3>
                <p className="text-gray-500">
                  We don't have any portfolios in the <span className="font-medium text-gray-700">"{activeTab}"</span> category at the moment.
                </p>
                <p className="text-gray-400 text-sm mt-3">
                  Check back later or explore other categories.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL (30:70 Split) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-fit max-h-[90vh] animate-in zoom-in-95 duration-300">
            {/* Sidebar (30%) */}
            <div className="w-full md:w-[32%] bg-gray-50 p-8 md:p-12 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-3xl shadow-lg p-6 mb-6 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center">
                  <img 
                    src={selectedItem.featured_image} 
                    alt="Client Logo" 
                     
                    className="object-contain w-full" 
                    
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-black text-[#020433] uppercase">{selectedItem.title}</h3>
            </div>
            {/* Content (70%) */}
            <div className="w-full md:w-[68%] p-8 md:p-16 overflow-y-auto bg-white relative">
              <button 
                onClick={() => setSelectedItem(null)} 
                className="absolute top-6 right-6 md:top-10 md:right-10 p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={24} className="text-gray-400" />
              </button>
              <div className="prose prose-slate max-w-none prose-img:rounded-xl">
                <div 
                  className="text-gray-600 text-base md:text-lg leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: selectedItem.content }} 
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedItem(null)} />
        </div>
      )}
    </section>
  );
}