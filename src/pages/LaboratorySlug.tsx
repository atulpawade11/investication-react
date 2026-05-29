import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DynamicDetailPage from '@/components/shared/DynamicDetailPage';
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';

// Define the type for mapped data
interface MappedPageData {
  title: string;
  banner: {
    title: string;
    subtitle: string;
  };
  overview: {
    heading: string;
    description: string;
    image: string;
  };
  accordions: {
    id: string;
    title: string;
    content: string;
  }[];
  cta: {
    title: string;
    description: string;
    image: string;
  };
  videoId: string | null;
}

export default function LaboratoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [pageData, setPageData] = useState<MappedPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLabData() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/laboratory/${slug}`);
        const result = await res.json();

        if (result.success && result.data?.page) {
          const p = result.data.page;

          const mappedData: MappedPageData = {
            title: p.title || p.name,
            banner: {
              title: p.title,
              subtitle: p.subtitle,
            },
            overview: {
              heading: p.heading_1 || "Overview of Laboratory",
              description: p.body_1 || "",
              image: "/overview.png"
            },
            accordions: [
              {
                id: "methodology",
                title: p.heading_2 || "Methodology",
                content: p.body_2 || ""
              },
              {
                id: "services",
                title: p.heading_3 || "Available Services",
                content: p.body_3 || ""
              },
              {
                id: "equipment",
                title: p.heading_4 || "Equipments",
                content: p.body_4 || ""
              }
            ].filter(a => a.content && a.content.replace(/<[^>]*>/g, "").trim() !== "" && a.content !== "<p><br></p>"),
            cta: {
              title: "Connect with Our Expert Forensic Investigators",
              description: "No matter where you are located, we're here to help.",
              image: "/images/cta-lab.jpg"
            },
            videoId: p.video_id || null
          };
          
          console.log("Mapped data:", mappedData);
          setPageData(mappedData);
        }
      } catch (err) {
        console.error("Lab Page Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchLabData();
  }, [slug]);

  const LaboratorySkeleton = () => (
    <div className="bg-white min-h-screen">
      <div className="w-full h-[400px] bg-gray-100 flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-6 w-48 bg-gray-200" />
        <Skeleton className="h-12 w-96 bg-gray-200" />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <Skeleton className="h-16 w-full rounded-lg mb-8" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return <LaboratorySkeleton />;
  if (!pageData) return <div className="min-h-screen flex items-center justify-center">Laboratory Not Found</div>;

  return <DynamicDetailPage data={pageData} />;
}