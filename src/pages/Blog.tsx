
import { API_BASE_URL } from '@/lib/config';
import BlogPageClient from "./BlogPageClient";

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`, {
      });
    const result = await response.json();

    if (result.success && result.data?.be) {
      const seo = result.data.be;
      return {
        title: seo.blogs_meta_title,
        description: seo.blogs_meta_description,
        keywords: seo.blogs_meta_keywords,
        openGraph: {
          title: seo.blogs_meta_title,
          description: seo.blogs_meta_description,
          images: ["/logo/logo.png"],
        }
      };
    }
  } catch (error) {
    console.error("Metadata fetch error for Blogs:", error);
  }

  return { title: "Forensic Blogs | SIFS India" };
}

export default function BlogPage() {
  return <BlogPageClient />;
}