
import { API_BASE_URL } from '@/lib/config';
import ContactClient from "./ContactClient";

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`, {
      });
    const result = await response.json();

    if (result.success && result.data?.be) {
      const seo = result.data.be;
      return {
        title: seo.contact_meta_title,
        description: seo.contact_meta_description,
        keywords: seo.contact_meta_keywords,
        openGraph: {
          title: seo.contact_meta_title,
          description: seo.contact_meta_description,
          images: ["/logo/logo.png"],
        }
      };
    }
  } catch (error) {
    console.error("Metadata fetch error for Contact:", error);
  }

  return { title: "Contact Us | Forensic Agency Labs in Delhi India" };
}

export default function ContactPage() {
  return <ContactClient />;
}