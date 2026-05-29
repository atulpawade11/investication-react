// app/department/[slug]/DepartmentLayout.tsx
import { useBoot } from '@/context/BootContext';
import PageBanner from '@/components/common/PageBanner';
import HeroSection from '@/components/department/HeroSection';
import CoreServices from '@/components/department/CoreServices';
import WhyChooseUs from '@/components/department/WhyChooseUs';
import ContactBanner from '@/components/department/ContactBanner';

export default function DepartmentLayout({ page }: { page: any }) {
  const { breadcrumbImage } = useBoot();

  // Parse the flat HTML body into structured data for components
  const parseBody = (html: string) => {
    if (!html) return { 
      heroTitle: '', 
      heroDescription: '', 
      services: [], 
      whyChooseItems: [] 
    };

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let heroTitle = '';
    let heroDescription = '';
    let services: { title: string; points: string[] }[] = [];
    let whyChooseItems: { title: string; description: string }[] = [];

    let currentSection: 'hero' | 'services' | 'whyChoose' | 'closing' = 'hero';
    let currentService: { title: string; points: string[] } | null = null;

    Array.from(doc.body.children).forEach((el) => {
      const text = el.textContent?.trim() || '';
      const tag = el.tagName;

      // ---------- SECTION DETECTION ----------

      // Core Services heading
      if (tag === 'H4' && text.includes('Core Forensic Investigation Services')) {
        currentSection = 'services';
        return;
      }

      // Why Choose Us heading
      if (tag === 'H4' && text.includes('Why Choose Our Forensic Investigation Services')) {
        if (currentService) { services.push(currentService); currentService = null; }
        currentSection = 'whyChoose';
        return;
      }

      // Connect / closing heading → stop processing
      if (tag === 'H4' && text.includes('Connect with Our Expert Forensic Investigators')) {
        if (currentService) { services.push(currentService); currentService = null; }
        currentSection = 'closing';
        return;
      }

      // ---------- CONTENT HANDLING ----------

      if (currentSection === 'hero') {
        // First H4 is the hero title
        if (tag === 'H4' && !heroTitle) {
          heroTitle = text;
          return;
        }
        // Collect paragraphs as hero description
        if (tag === 'P') {
          heroDescription += el.outerHTML;
        }
      }

      else if (currentSection === 'services') {
        // A <p><strong>Title</strong></p> starts a new service block
        if (tag === 'P' && el.querySelector('strong')) {
          if (currentService) services.push(currentService);
          currentService = {
            title: el.querySelector('strong')!.textContent?.trim() || '',
            points: []
          };
        }
        // A <ul> after a service title contains the bullet points
        else if (tag === 'UL' && currentService) {
          const items = Array.from(el.querySelectorAll('li')).map(li => li.textContent?.trim() || '');
          currentService.points = items;
        }
        // Any other <p> that is not a title and not empty
        else if (tag === 'P' && !el.querySelector('strong') && text.length > 0) {
          if (currentService) { services.push(currentService); currentService = null; }
        }
      }

      else if (currentSection === 'whyChoose') {
        // Each <p> with a colon is a "Title: description" item
        if (tag === 'P' && text.includes(':')) {
          const colonIdx = text.indexOf(':');
          whyChooseItems.push({
            title: text.slice(0, colonIdx).trim(),
            description: text.slice(colonIdx + 1).trim()
          });
        }
      }

      // closing section is ignored (handled by ContactBanner)
    });

    // Push the last service if any
    if (currentService) services.push(currentService);

    return { heroTitle, heroDescription, services, whyChooseItems };
  };

  const { heroTitle, heroDescription, services, whyChooseItems } = parseBody(page?.body || '');

  // Get hero image from API or use null (HeroSection will use static fallback)
  const heroImage = page?.image_metadata?.[0]?.image_url || null;

  return (
    <main className="bg-white min-h-screen">
      {/* Banner */}
      <PageBanner
        title={page?.title}
        subtitle={page?.subtitle || page?.name}
        breadcrumbImage={breadcrumbImage}
      />

      {/* -------- HERO SECTION -------- */}
      <HeroSection 
        title={heroTitle}
        description={heroDescription}
        image={heroImage}
      />

      {/* -------- CORE SERVICES (dynamic, from API) -------- */}
      {services.length > 0 && (
        <CoreServices
          departmentName={page?.title}
          services={services}
        />
      )}

      {/* -------- WHY CHOOSE US (dynamic, from API) -------- */}
      {whyChooseItems.length > 0 && (
        <WhyChooseUs 
          departmentName={page?.title} 
          items={whyChooseItems} 
        />
      )}

      {/* -------- CONTACT BANNER -------- */}
      <ContactBanner />
    </main>
  );
}