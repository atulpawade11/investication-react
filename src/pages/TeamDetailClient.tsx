import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageBanner from '@/components/common/PageBanner';
import { getTeamMembers, getTeamMemberById } from '@/services/teamService';
import { AlertCircle, ArrowLeft } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Skeleton } from '@/components/shared/Skeleton';
import { useBoot } from '@/context/BootContext';

export default function TeamDetailClient({ idFromUrl }: { idFromUrl: string }) {
  const router = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { breadcrumbImage } = useBoot();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await getTeamMemberById(idFromUrl);

        if (res && !res.fallback && res.data?.member) {
          setMember(res.data.member);
        } else {
          const listRes = await getTeamMembers();
          const found = listRes.data?.members?.find((m: any) => m.id.toString() === idFromUrl.toString());
          if (found) {
            setMember(found);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [idFromUrl]);

  // --- TEAM DETAIL SKELETON ---
  const DetailSkeleton = () => (
    <div className="bg-white min-h-screen">
      <div className="w-full h-[300px] bg-gray-100 flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-10 w-64 bg-gray-200" />
        <Skeleton className="h-4 w-40 bg-gray-200" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-32 mb-6" /> {/* Back Button placeholder */}
        
        <div className="bg-white rounded-3xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 shadow-xl">
          {/* Sidebar Skeleton */}
          <div className="lg:w-1/3 bg-gray-50 p-8 text-center border-r border-gray-100 flex flex-col items-center">
            <Skeleton className="w-64 h-64 rounded-2xl mb-6 shadow-lg" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-12 w-full mt-4" />
            <div className="flex gap-4 mt-8">
               <Skeleton className="w-10 h-10 rounded-full" />
               <Skeleton className="w-10 h-10 rounded-full" />
               <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>

          {/* Bio Skeleton */}
          <div className="lg:w-2/3 p-8 lg:p-16 space-y-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-4 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <DetailSkeleton />;

  if (error || !member) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <AlertCircle className="text-red-500 mb-2" />
      <p>Expert Not Found (ID: {idFromUrl})</p>
      <button onClick={() => router('/team')} className="mt-4 text-[#04063e] font-bold underline">Return to Team</button>
    </div>
  );

  return (
    <main className="bg-white min-h-screen pb-20">
      <PageBanner title={member.name} subtitle={member.rank} breadcrumbImage={breadcrumbImage} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={() => router(-1)} 
          className="flex items-center gap-2 text-gray-600 hover:text-[#04063e] transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Team</span>
        </button>

        <div className="bg-white rounded-3xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 shadow-xl">
          {/* Sidebar */}
          <div className="lg:w-1/3 bg-gray-50 p-8 text-center border-r border-gray-100">
            <div className="relative w-64 h-64 mx-auto mb-6">
              <img 
                src={`https://forensicinstitute.in/uploads/Investigation-Services-Admin-Member/${member.image}`} 
                alt={member.name}
                className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white bg-white"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#04063E]">{member.name}</h2>
            <p className="text-[#04063e] font-bold text-xs uppercase mt-2 tracking-widest">{member.rank}</p>
            <p className="text-gray-500 text-sm mt-4 font-medium">{member.education}</p>
            
            <div className="flex justify-center gap-4 mt-8">
               {member.facebook && <a href={member.facebook} target="_blank" className="p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-blue-600 hover:shadow-md transition-all"><FaFacebook size={18}/></a>}
               {member.linkedin && <a href={member.linkedin} target="_blank" className="p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-blue-700 hover:shadow-md transition-all"><FaLinkedin size={18}/></a>}
               {member.instagram && <a href={member.instagram} target="_blank" className="p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-pink-600 hover:shadow-md transition-all"><FaInstagram size={18}/></a>}
            </div>
          </div>

          {/* Biography Content */}
          <div className="lg:w-2/3 p-8 lg:p-16">
            <h3 className="text-xl font-bold mb-6 text-[#04063E] flex items-center gap-2">
              <span className="w-8 h-1 bg-[#96C11F] rounded-full"></span>
              Professional Biography
            </h3>
            <div 
              className="prose prose-slate max-w-none text-gray-700 leading-relaxed text-justify expert-bio"
              dangerouslySetInnerHTML={{ __html: member.about }} 
            />
          </div>
        </div>
      </div>
      <style>{`
        .expert-bio p { margin-bottom: 1.5rem; }
        .expert-bio strong { color: #04063E; }
      `}</style>
    </main>
  );
}