import PageBanner from '@/components/common/PageBanner';
import AboutIntroSection from '@/components/about/AboutIntroSection';
import AboutMissionTabs from '@/components/about/AboutMissionTabs';
import TeamMembers from '@/components/about/TeamMembers';
import ClientelePortfolio from '@/components/common/ClientelePortfolio';
import OurAlliance from '@/components/about/OurAlliance';
import DownloadsSlider from '@/components/common/DownloadsSlider';
import { useBoot } from '@/context/BootContext';

export default function AboutPage() {
  const { breadcrumbImage } = useBoot();

  return (
    <>
      <PageBanner
        title="About SIFS India"
        breadcrumbImage={breadcrumbImage}
      />

      <AboutIntroSection />
      <AboutMissionTabs />
      <TeamMembers />
      <ClientelePortfolio />
      <OurAlliance />
      <DownloadsSlider />
    </>
  );
}