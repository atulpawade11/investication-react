import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageBanner from '@/components/common/PageBanner';
import CareerFAQSection from '@/components/career/CareerFAQSection';
import DownloadsSlider from '@/components/common/DownloadsSlider';
import { API_BASE_URL } from '@/lib/config';
import { Calendar, MapPin, Briefcase, Users, Mail, GraduationCap, CheckCircle2, List, Loader2 } from 'lucide-react';
import { useBoot } from '@/context/BootContext';

export default function CareerDetailsClient({ slug }: { slug: string }) {
  const router = useNavigate();
  const { breadcrumbImage } = useBoot();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/career-details/${slug}`);
      const json = await response.json();

      if (json.success && json.data?.job) {
        setData(json.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleCategorySwitch = async (categoryId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/career/`);
      const json = await res.json();

      if (json.success && json.data?.data) {
        const nextJob = json.data.data.find((j: any) => j.jcategory_id === categoryId);
        if (nextJob) {
          router(`/career/${nextJob.slug}`);
        } else {
          router(`/career?category=${categoryId}`);
        }
      }
    } catch (err) {
      console.error("Navigation error:", err);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#1B2A7A]" size={48} />
        <p className="uppercase tracking-widest text-xs font-bold text-[#1B2A7A]">Loading Job Details...</p>
      </div>
    </div>
  );

  if (error || !data?.job) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
      <h2 className="text-xl font-semibold text-gray-800">Position Not Found</h2>
      <button onClick={() => router('/career')} className="bg-[#1B2A7A] text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest">
        Back to All Jobs
      </button>
    </div>
  );

  const { job, jcats } = data;

  return (
    <main className="bg-white">
      <PageBanner 
        title={job.title} 
        subtitle={`Career Opportunity in ${job.job_location}`}
        breadcrumbImage={breadcrumbImage}
      />

      <section className="py-20">
        <div className="mx-auto container px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8 space-y-12">
              <DetailSection title="Job Responsibilities" icon={<Briefcase size={24}/>} html={job.job_responsibilities} />
              <div className="grid md:grid-cols-2 gap-8">
                <DetailSection title="Education" icon={<GraduationCap size={24}/>} html={job.educational_requirements} />
                <DetailSection title="Experience" icon={<CheckCircle2 size={24}/>} html={job.experience_requirements} />
              </div>
              <DetailSection title="Additional Skills" icon={<List size={24}/>} html={job.additional_requirements} />
              <DetailSection title="Company Benefits" icon={<Users size={24}/>} html={job.benefits} />

              <div className="rounded-2xl bg-blue-50/50 p-8 border border-blue-100 mt-10">
                <h4 className="font-bold text-[#1B2A7A] mb-3 uppercase text-[10px] tracking-[0.2em]">
                  Application Notice
                </h4>
                
                <div 
                  className="text-gray-600 leading-relaxed text-sm italic mb-4 prose-p:m-0"
                  dangerouslySetInnerHTML={{ __html: job.read_before_apply }} 
                />

                <div className="flex items-center gap-2 text-[#1B2A7A] font-bold text-sm">
                  <Mail size={16} />
                  <span>Send Resume: {job.email}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-28 space-y-8">
                <div className="bg-[#1B2A7A] text-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Job Summary</h3>
                  <div className="space-y-6">
                    <SidebarItem label="Location" value={job.job_location} icon={<MapPin size={20} />} />
                    <SidebarItem label="Deadline" value={job.deadline} icon={<Calendar size={20} />} />
                    <SidebarItem label="Experience" value={job.experience} icon={<Briefcase size={20} />} />
                    <SidebarItem label="Vacancy" value={`${job.vacancy} Positions`} icon={<Users size={20} />} />
                    <SidebarItem label="Salary" value="Negotiable" icon={<Mail size={20} />} isHtml html={job.salary} />
                  </div>
                  <button className="w-full mt-10 bg-white text-[#1B2A7A] py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform">
                    Apply For Position
                  </button>
                </div>

                {jcats && (
                  <div className="bg-[#FAFAFA] border border-gray-200 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
                        <List size={20} className="text-[#1B2A7A]" /> Job Categories
                    </h3>
                    <div className="flex flex-col gap-2">
                      {jcats.map((cat: any) => (
                        <button 
                          key={cat.id} 
                          onClick={() => handleCategorySwitch(cat.id)}
                          className={`group flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                            job.jcategory_id === cat.id 
                            ? "bg-[#1B2A7A] border-[#1B2A7A] text-white" 
                            : "bg-white border-gray-200 text-gray-600 hover:border-[#1B2A7A] hover:text-[#1B2A7A]"
                          }`}
                        >
                          <span className="text-[11px] font-bold uppercase truncate max-w-[200px]">
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CareerFAQSection />
      <DownloadsSlider />
    </main>
  );
}

// Helper components
function DetailSection({ title, icon, html }: { title: string; icon: React.ReactNode; html: string }) {
  if (!html || html === "null" || html === "undefined") return null;
  return (
    <div>
      <h3 className="text-xl font-bold text-black mb-5 flex items-center gap-3">
        <span className="bg-[#1B2A7A]/5 p-2 rounded-lg text-[#1B2A7A]">{icon}</span> {title}
      </h3>
      <div 
        className="text-gray-600 leading-relaxed job-rich-text"
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    </div>
  );
}

function SidebarItem({ label, value, icon, isHtml, html }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white leading-tight mb-1">{label}</p>
        {isHtml ? <div className="text-sm font-bold text-white" dangerouslySetInnerHTML={{ __html: html }} /> : <p className="text-md font-bold text-white">{value}</p>}
      </div>
    </div>
  );
}