import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageBanner from '@/components/common/PageBanner';
import { getTeamMembers } from '@/services/teamService';
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';
import { Users, FilterX } from "lucide-react";

// Define types
interface TeamMember {
  id: number;
  name: string;
  rank: string;
  image: string;
  team_category_id: number;
}

interface TeamCategory {
  id: number;
  name: string;
}

export default function TeamListingClient() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [categories, setCategories] = useState<TeamCategory[]>([]);
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { breadcrumbImage } = useBoot();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getTeamMembers();
        if (res.success) {
          setMembers(res.data.members);
          setCategories(res.data.team_categories);
        }
      } catch (err) {
        console.error("Team load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredMembers = activeCatId 
    ? members.filter((m) => m.team_category_id === activeCatId)
    : members;

  // Get current category name
  const currentCategoryName = activeCatId 
    ? categories.find((cat) => cat.id === activeCatId)?.name 
    : "All Members";

  // --- TEAM SKELETON ---
  const TeamSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Skeleton */}
      <aside className="w-full md:w-64">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
          <Skeleton className="h-6 w-1/2 mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </aside>

      {/* Grid Skeleton */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <Skeleton className="aspect-[4/5] w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- NO DATA COMPONENT ---
  const NoDataScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <FilterX className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Team Members Found</h3>
        <p className="text-gray-500 mb-4">
          We couldn&apos;t find any team members in the <span className="font-medium text-gray-700">&quot;{currentCategoryName}&quot;</span> category.
        </p>
        {activeCatId && (
          <button
            onClick={() => setActiveCatId(null)}
            className="bg-gradient-to-r from-[#0B10A4] to-[#04063E] text-white px-10 py-3 text-[18px] rounded-full font-bold flex items-center justify-center gap-4 cursor-pointer border-none no-underline transition-all hover:opacity-90 mx-auto"
          >
            <Users size={18} />
            View All Members
          </button>
        )}
      </div>
    </div>
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <PageBanner title="Our Experts" subtitle="Meet our Team Members" breadcrumbImage={breadcrumbImage} />

      {loading ? (
        <TeamSkeleton />
      ) : (
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold mb-4 border-b pb-2 text-[#04063E]">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveCatId(null)} 
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${!activeCatId ? 'bg-[#04063e] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    All Members
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button onClick={() => setActiveCatId(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${activeCatId === cat.id ? 'bg-[#04063e] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {filteredMembers.length === 0 ? (
            <NoDataScreen />
          ) : (
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <Link to={`/team/${member.id}`} key={member.id} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                    <div className="aspect-[5/5] overflow-hidden bg-gray-100 relative">
                      <img 
                        src={`https://forensicinstitute.in/uploads/Investigation-Services-Admin-Member/${member.image}`} 
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <h4 className="font-bold text-gray-900 group-hover:text-[#0B10A4] transition-colors">{member.name}</h4>
                      <p className="text-[#04063e] text-[10px] font-black uppercase tracking-widest mt-1">{member.rank}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}