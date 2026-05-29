
import { API_BASE_URL } from '@/lib/config';
import Hero from '@/components/home/Hero';
import AboutIntro from '@/components/home/AboutIntro';
import ForensicServices from '@/components/home/ForensicServices';
import VisionMission from '@/components/home/VisionMission';
import ShowcaseStats from '@/components/home/ShowcaseStats';
import Team from '@/components/home/Team';
import Testimonials from '@/components/home/Testimonials';
import BlogsCaseStudies from '@/components/home/BlogsCaseStudies';
//import ExpertSupport from '@/components/home/ExpertSupport';
import DownloadsSlider from '@/components/common/DownloadsSlider';

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`, {
      });
    const result = await response.json();

    if (result.success && result.data && result.data.be) {
      const seo = result.data.be;
      return {
        title: seo.home_meta_title,
        description: seo.home_meta_description,
        keywords: seo.home_meta_keywords,
        openGraph: {
          title: seo.home_meta_title,
          description: seo.home_meta_description,
        }
      };
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  return {};
}


export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <ForensicServices />
      <VisionMission />
      <ShowcaseStats />
      <Team />
      <Testimonials />
      <BlogsCaseStudies />
      {/*<ExpertSupport />*/}
      <DownloadsSlider />
    </>
  );
}
