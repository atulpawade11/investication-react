import { useBoot } from '@/context/BootContext';
import PageBanner from '@/components/common/PageBanner';

export default function LegalLayout({ page }: { page: any }) {
  const { breadcrumbImage } = useBoot();

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageBanner
        title={page?.title}
        subtitle="SIFS India"
        breadcrumbImage={breadcrumbImage}
      />

      <div className="relative z-10 -mt-12 pb-20 px-4">
        <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
          <div className="p-8 md:p-16">
            <div
              className="api-content text-sm md:text-base prose prose-slate max-w-none 
                         prose-headings:text-[#04063E] 
                         prose-p:text-gray-600 
                         prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page?.body }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}