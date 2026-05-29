// components/shared/DynamicDetailPage.tsx
import PageBanner from "../common/PageBanner";
import OverviewSection from "./OverviewSection";
import CTASection from "./CTASection";
import MainAccordionSection from "./MainAccordionSection";
import { useBoot } from '@/context/BootContext';

interface DynamicPageData {
  title?: string;
  banner?: {
    title?: string;
    subtitle?: string;
  };
  overview?: {
    heading?: string;
    description?: string;
    image?: string;
  };
  accordions?: {
    id: string;
    title: string;
    content: string;
  }[];
  cta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  videoId?: string | null;
}

export default function DynamicDetailPage({ data }: { data: DynamicPageData }) {
  const { breadcrumbImage } = useBoot();

  if (!data) return null;

  // Build accordion items - Overview is first accordion, open by default
  const accordionItems = [
    {
      id: "overview",
      title: data.overview?.heading || "Overview of Laboratory",
      content: (
        <OverviewSection
          heading={data.overview?.heading || "Overview of Laboratory"}
          description={data.overview?.description || ""}
          image={data.overview?.image || ""}
        />
      )
    },
    // Dynamic sections (Methodology, Available Services, Equipment, etc.)
    ...(data.accordions || []).map((item) => ({
      id: item.id,
      title: item.title,
      content: (
        <div
          className="prose max-w-none text-gray-600
          [&>p]:mb-4 [&>p]:text-justify
          [&>h4]:text-xl [&>h4]:font-bold [&>h4]:text-[#04063E] [&>h4]:mt-6 [&>h4]:mb-4
          [&>ul]:list-disc [&>ul]:pl-5
          [&>li]:mb-2"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )
    }))
  ];

  return (
    <div className="bg-white">
      <PageBanner
        title={data.banner?.title || "Laboratory"}
        subtitle={data.banner?.subtitle || "SIFS India"}
        breadcrumbImage={breadcrumbImage}
      />

      <section className="container mx-auto px-4 py-10">
        {/* Main Accordion - Overview open by default */}
        <MainAccordionSection items={accordionItems} defaultOpenId="overview" />

        {/* Video */}
        {data.videoId && (
          <div className="mt-16">
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${data.videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* CTA Section */}
        {data.cta && (
          <CTASection
            title={data.cta.title || "Connect with Our Experts"}
            description={data.cta.description || "No matter where you are located, we're here to help."}
            image={data.cta.image || "/connect.png"}
          />
        )}
      </section>
    </div>
  );
}