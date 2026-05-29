import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DepartmentLayout from "./DepartmentLayout";
import LegalLayout from "./LegalLayout";
import { API_BASE_URL } from '@/lib/config';

const legalSlugs = ["privacy-policy", "terms-and-conditions"];

export default function DepartmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/page/${slug}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const result = await res.json();
        if (!result.success) {
          setError(true);
          return;
        }
        setPage(result.data.page);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchData();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !page) return <div className="min-h-screen flex items-center justify-center">Page Not Found</div>;

  if (slug && legalSlugs.includes(slug)) {
    return <LegalLayout page={page} />;
  }

  return <DepartmentLayout page={page} />;
}