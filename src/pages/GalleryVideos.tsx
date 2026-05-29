
import { API_BASE_URL } from '@/lib/config';
import VideoGalleryClient from "./VideoGalleryClient";

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`, {
      });
    const result = await response.json();

    if (result.success && result.data?.be) {
      const seo = result.data.be;
      return {
        title: seo.video_gallery_title,
        description: seo.video_gallery_description,
        keywords: seo.video_gallery_keywords,
        openGraph: {
          title: seo.video_gallery_title,
          description: seo.video_gallery_description,
          images: ["/logo/logo.png"],
        }
      };
    }
  } catch (error) {
    console.error("Metadata fetch error for Video Gallery:", error);
  }

  return { title: "Video Gallery | SIFS India" };
}

export default function VideoGalleryPage() {
  return <VideoGalleryClient />;
}