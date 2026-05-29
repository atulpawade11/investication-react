
import { API_BASE_URL } from '@/lib/config';
import FAQClient from "./FAQClient";

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/faq/`, {
      });
    const result = await response.json();

    if (result.success && result.data?.be) {
      const seo = result.data.be;
      return {
        title: seo.faq_meta_title,
        description: seo.faq_meta_description,
        keywords: seo.faq_meta_keywords,
        openGraph: {
          title: seo.faq_meta_title,
          description: seo.faq_meta_description,
          images: ["/logo/logo.png"],
        }
      };
    }
  } catch (error) {
    console.error("Metadata fetch error for FAQ:", error);
  }

  return { title: "F.A.Q | SIFS India" };
}

export default function FAQPage() {
  return <FAQClient />;
}