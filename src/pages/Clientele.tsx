import { useEffect, useState } from 'react';
import ClientelePortfolio from '@/components/common/ClientelePortfolio';
import PageBanner from '@/components/common/PageBanner';
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';

// Internal Skeleton for this page
function LocalSkeletonGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center p-8 bg-white rounded-3xl border border-gray-100 space-y-4">
            <Skeleton className="w-24 h-24 rounded-2xl bg-gray-100" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientelePage() {
  const { breadcrumbImage } = useBoot();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPortfolioSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        const result = await res.json();
        if (result.success && result.data?.bs) {
          setSettings({
            title: result.data.bs.portfolio_title || "Our Clientele",
            subtitle: result.data.bs.portfolio_subtitle || "Satisfied Clients",
            breadcrumbImage: result.data.bs.breadcrumb || breadcrumbImage || null,
          });
        }
      } catch (e) { 
        console.error(e); 
      } finally {
        setLoading(false);
      }
    }
    getPortfolioSettings();
  }, [breadcrumbImage]);

  if (loading) return <div className="min-h-screen"><LocalSkeletonGrid /></div>;

  return (
    <main className="bg-white min-h-screen">
      <PageBanner 
        title={settings?.title || "Our Clientele"} 
        subtitle={settings?.subtitle || "Satisfied Clients"} 
        breadcrumbImage={settings?.breadcrumbImage || breadcrumbImage}
      />
      
      <ClientelePortfolio />
    </main>
  );
}