// app/contact/ContactClient.tsx
import { useEffect, useState } from "react";
import PageBanner from '@/components/common/PageBanner';
import ContactInfoSection from '@/components/contact/ContactInfoSection';
import ContactFormSection from '@/components/contact/ContactFormSection';
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';

const API_URL = import.meta.env.VITE_API_URL || "https://forensicinstitute.in/api";

export default function ContactClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { breadcrumbImage } = useBoot();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/InvestigationServices/Website/front/contact`);
        const result = await res.json();
        console.log("Contact API response:", result);

        if (isMounted) {
          if (result && result.success) {
            setData(result.data);
          } else {
            setData({ locations: [], intrNtnlLocs: [], contact_info: {} });
          }
        }
      } catch (err) {
        console.error("Failed to load contact data:", err);
        if (isMounted) {
          setData({ locations: [], intrNtnlLocs: [], contact_info: {} });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2783] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading contact information...</p>
        </div>
      </div>
    );
  }

  console.log("Rendering with data:", data);

  return (
    <>
      <PageBanner
        title="Contact Us"
        subtitle="We are here to help you"
        breadcrumbImage={breadcrumbImage}
      />
      <ContactInfoSection
        locations={data?.locations || []}
        internationalLocations={data?.intrNtnlLocs || []}
        mainInfo={data?.contact_info}
      />
      <ContactFormSection />
    </>
  );
}