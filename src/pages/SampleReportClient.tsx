import PageBanner from '@/components/common/PageBanner';
import SampleReportForm from '@/components/sample-report/SampleReportForm';
import { useBoot } from '@/context/BootContext';

export default function SubmitCaseClient() {
    const { breadcrumbImage } = useBoot();

    return (
        <main className="min-h-screen bg-[#F8F9FA]">
            <PageBanner
                title="Request Sample Report"
                subtitle="Sample Report"
                breadcrumbImage={breadcrumbImage}
            />

            <div className="container mx-auto px-4 md:px-10 py-16 md:py-24">
                <SampleReportForm />
            </div>
        </main>
    );
}