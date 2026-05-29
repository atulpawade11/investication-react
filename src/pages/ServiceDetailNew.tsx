// pages/ServiceDetailNew.tsx
import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '@/lib/config';
import ServiceDetailClient from './ServiceDetailClient';

export default function ServiceDetailNew() {
  const { slug } = useParams<{ slug: string }>();
  const [mappedCategory, setMappedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCategoryBySlug() {
      try {
        // Fetch all services to find which category this slug belongs to
        const res = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/services?page=1&per_page=500`);
        const data = await res.json();
        
        if (data.success && data.data?.data) {
          const service = data.data.data.find((s: any) => s.slug === slug);
          if (service && service.scategory_id) {
            // Find category name by ID
            const category = data.data.categories?.find((c: any) => c.id === service.scategory_id);
            if (category) {
              // Generate category slug from name (same logic as before)
              const categorySlug = category.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              setMappedCategory(categorySlug);
            }
          }
        }
      } catch (err) {
        console.error("Error mapping service to category:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) findCategoryBySlug();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B10A4]"></div>
    </div>;
  }

  if (mappedCategory && slug) {
    // Reuse your existing ServiceDetailClient with the mapped category
    return <ServiceDetailClient categorySlug={mappedCategory} serviceSlug={slug} />;
  }

  return <Navigate to="/services" replace />;
}