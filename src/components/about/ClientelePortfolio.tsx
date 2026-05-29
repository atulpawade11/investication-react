import { useState, useEffect } from "react";
;
import { X, ChevronDown, Loader2, MapPin } from "lucide-react";
import { API_BASE_URL } from '@/lib/config';

// --- PROFESSIONAL CATEGORY MAPPING ---
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

export default function ClientelePortfolio() {
  const [activeTab, setActiveTab] = useState("All");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [header, setHeader] = useState({ title: "OUR CLIENTELE", subtitle: "Satisfied Clients’ Portfolio" });

  useEffect(() => {
    const initFetch = async () => {
      try {
        const [mainRes, portRes] = await Promise.all([
          fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`).then(res => res.json()),
          fetch(`${API_BASE_URL}/InvestigationServices/Website/front/portfolios`).then(res => res.json())
        ]);

        // 1. Dynamic Header Logic
        if (mainRes.success && mainRes.data?.bs) {
          setHeader({
            title: mainRes.data.bs.portfolio_title || "OUR CLIENTELE",
            subtitle: mainRes.data.bs.portfolio_subtitle || "Satisfied Clients’ Portfolio"
          });
        }

        // 2. Portfolio & Category Logic
        if (portRes.success && portRes.data) {
          const portData = portRes.data.data || [];
          setPortfolios(portData);
          setNextPageUrl(portRes.data.next_page_url || null);

          // Build professional categories from unique IDs in data
          const uniqueIds = Array.from(new Set(portData.map((p: any) => p.client_category_id)));
          const mappedCats = uniqueIds.map(id => ({
            id: String(id),
            name: SECTOR_NAME_MAP[String(id)] || `Sector ${id}`
          }));

          const preferredOrder = ["Courts", "Govt Dept", "State Police", "Insurance Sector", "Indian Bank", "Corporates", "Law Firms", "Detectives", "Others"];
          mappedCats.sort((a, b) => preferredOrder.indexOf(a.name) - preferredOrder.indexOf(b.name));
          setCategories(mappedCats);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    initFetch();
  }, []);

  const handleLoadMore = async () => {
    if (!nextPageUrl || loadMoreLoading) return;
    setLoadMoreLoading(true);
    try {
      const res = await fetch(nextPageUrl).then(r => r.json());
      if (res.success && res.data?.data) {
        setPortfolios(prev => [...prev, ...res.data.data]);
        setNextPageUrl(res.data.next_page_url || null);
      }
    } catch (err) { console.error(err); } finally { setLoadMoreLoading(false); }
  };

  const filteredLogos = portfolios.filter((p) => {
    if (activeTab === "All") return true;
    const currentCat = categories.find(c => c.name === activeTab);
    return currentCat ? String(p.client_category_id) === String(currentCat.id) : false;
  });

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-900" size={40} /></div>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 bg-white min-h-screen">
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        
        {/* SIDEBAR */}
        <aside className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 h-fit sticky top-24 z-20">
          <ul className="space-y-1 text-sm">
            <li>
              <button 
                onClick={() => setActiveTab("All")} 
                className={`relative flex w-full items-center rounded-lg px-4 py-3 transition ${activeTab === "All" ? "bg-gray-100 font-bold text-[#04063E]" : "text-gray-500 hover:bg-gray-50"}`}
              >
                {activeTab === "All" && <span className="absolute left-0 top-2 h-8 w-[4px] rounded-r bg-[#1C274C]" />}
                All Portfolios
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button 
                  onClick={() => setActiveTab(cat.name)} 
                  className={`relative flex w-full items-center rounded-lg px-4 py-3 transition ${activeTab === cat.name ? "bg-gray-100 font-bold text-[#04063E]" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  {activeTab === cat.name && <span className="absolute left-0 top-2 h-8 w-[4px] rounded-r bg-[#1C274C]" />}
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* LOGO GRID AREA */}
        <div className="relative">
          
          {/* THE CENTRAL BADGE (Floating behind logos) */}
          {/*<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-21">
             <div className="h-[200px] w-[200px] md:h-[350px] md:w-[350px] rounded-full border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-10 bg-white/40 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-800 mb-2">{header.title}</p>
                <h4 className="text-2xl font-black text-black leading-tight">{header.subtitle}</h4>
              </div>
          </div> */}

          {/* GRID OF LOGOS */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 w-full relative z-10">
            {filteredLogos.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)} 
                className="group flex h-[130px] cursor-pointer items-center justify-center rounded-3xl bg-white/80 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="relative h-14 w-28 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                  <img src={item.featured_image} alt={item.title}  className="object-contain"  />
                </div>
              </div>
            ))}
          </div>

          {/* VIEW MORE */}
          {nextPageUrl && (
            <div className="mt-16 flex justify-center relative z-20">
              <button 
                onClick={handleLoadMore} 
                disabled={loadMoreLoading} 
                className="flex items-center gap-3 px-10 py-4 bg-[#04063E] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl disabled:opacity-50"
              >
                {loadMoreLoading ? <Loader2 className="animate-spin" /> : <ChevronDown size={18} />}
                {loadMoreLoading ? "Fetching..." : "View More Clients"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 30:70 DETAIL POPUP */}
      {selectedItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-6xl bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[85vh] animate-in zoom-in-95 duration-300">
            <div className="w-full md:w-[32%] bg-[#F8FAFC] p-12 flex flex-col items-center justify-center text-center border-r border-gray-100">
              <div className="w-40 h-40 bg-white rounded-full shadow-2xl p-6 mb-8 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <img src={selectedItem.featured_image} alt="Logo"  className="object-contain"  />
                </div>
              </div>
              <h3 className="text-xl font-black text-[#020433] leading-tight uppercase">{selectedItem.title}</h3>
            </div>
            <div className="w-full md:w-[68%] p-10 md:p-20 overflow-y-auto bg-white relative">
              <button onClick={() => setSelectedItem(null)} className="absolute top-10 right-10 p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-all"><X size={24} /></button>
              <div className="prose prose-slate max-w-none">
                <div className="text-gray-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedItem(null)} />
        </div>
      )}
    </section>
  );
}