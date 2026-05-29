import { useEffect, useState } from 'react';
import PageBanner from '@/components/common/PageBanner';
import AllTestimonials from '@/components/testimonial/AllTestimonials';
import { API_BASE_URL } from '@/lib/config';
import { useBoot } from '@/context/BootContext';

export default function TestimonialsPage() {
  const { breadcrumbImage: bootBreadcrumb } = useBoot();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        const result = await res.json();
        if (result?.success) {
          setData(result.data.bs);
        }
      } catch (e) {
        console.error("Testimonials Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Testimonials...</div>;

  return (
    <main className="bg-[#F3F1F2] min-h-screen">
      <PageBanner
        title={data?.testimonial_title || "Success Stories"}
        subtitle={data?.testimonial_subtitle || "Hear What Our Clients Say"}
        breadcrumbImage={data?.breadcrumb || bootBreadcrumb || null}
      />

      <section className="py-20 max-w-7xl mx-auto px-4">
        <AllTestimonials />
      </section>
    </main>
  );
}