import PageBanner from '@/components/common/PageBanner';
import SubmitCaseForm from '@/components/submit-case/SubmitCaseForm';
import { useBoot } from '@/context/BootContext';

export default function SubmitCaseClient() {
    const { breadcrumbImage } = useBoot();

    return (
        <main className="min-h-screen bg-[#F8F9FA]">
            <PageBanner
                title="Submit your Case Documents"
                subtitle="Submit Case"
                breadcrumbImage={breadcrumbImage}
            />

            <div className="container mx-auto px-4 md:px-10 py-16 md:py-24">
                <SubmitCaseForm />
            </div>
        </main>
    );
}