
import { API_BASE_URL } from '@/lib/config';
import ImageGalleryClient from "./ImageGalleryClient";

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`, {
      });
    const result = await response.json();

    if (result.success && result.data?.be) {
      const seo = result.data.be;
      return {
        title: seo.gallery_meta_title,
        description: seo.gallery_meta_description,
        keywords: seo.gallery_meta_keywords,
        openGraph: {
          title: seo.gallery_meta_title,
          description: seo.gallery_meta_description,
          images: ["/logo/logo.png"],
        }
      };
    }
  } catch (error) {
    console.error("Metadata fetch error for Gallery:", error);
  }

  return { title: "Image Gallery | SIFS India" };
}

export default function ImageGalleryPage() {
  return <ImageGalleryClient />;
}