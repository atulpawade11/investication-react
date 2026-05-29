
import { API_BASE_URL } from '@/lib/config';
import TeamListingClient from "./TeamListingClient";

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`, {
      });
    const result = await response.json();

    if (result.success && result.data?.be) {
      const seo = result.data.be;
      return {
        title: seo.team_meta_title,
        description: seo.team_meta_description,
        keywords: seo.team_meta_keywords,
        openGraph: {
          title: seo.team_meta_title,
          description: seo.team_meta_description,
          images: ["/logo/logo.png"],
        }
      };
    }
  } catch (error) {
    console.error("Metadata fetch error for Team:", error);
  }
  return { title: "Our Experts | Forensic Team India" };
}

export default function TeamPage() {
  return <TeamListingClient />;
}