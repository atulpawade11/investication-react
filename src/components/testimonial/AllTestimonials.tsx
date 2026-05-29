import React, { useEffect, useState } from 'react';
import { getTestimonials } from '@/services/testimonialService';
import { Skeleton } from '@/components/shared/Skeleton';

export default function AllTestimonials() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getTestimonials(page);
      if (res?.success) setData(res.data);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    load();
  }, [page]);

  const list = data?.data || [];
  const pagination = data?.pagination;

  if (loading && !data) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{/* Skeleton code */}</div>;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((item: any) => (
          <div key={item.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[#0B10A4] text-4xl mb-4 font-serif">“</div>
              <p className="text-gray-700 leading-relaxed mb-6 italic">{item.comment}</p>
            </div>
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-[#04063E] leading-tight">{item.name}</p>
                <p className="text-xs text-gray-500">{item.rank}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-6">
          <button 
            disabled={!pagination.has_previous}
            onClick={() => setPage(p => p - 1)}
            className="px-6 py-2 border border-gray-300 rounded-full disabled:opacity-30 hover:bg-gray-50 transition-all font-bold"
          >
            ← 
          </button>
          <span className="text-sm font-medium">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
          <button 
            disabled={!pagination.has_next}
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2 bg-[#0B10A4] text-white rounded-full disabled:opacity-30 hover:bg-[#04063E] transition-all font-bold"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}