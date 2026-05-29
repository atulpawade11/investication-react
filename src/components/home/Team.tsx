import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';

interface TeamMember {
  id: number;
  name: string;
  rank: string;
  image: string;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  slug: string;
}

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [content, setContent] = useState({
    title: "Team Members",
    subtitle: "Meet Forensic Experts"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        const result = await response.json();

        if (result.success && result.data) {
          const bs = result.data.bs;

          setContent({
            title: bs.team_section_title || "Team Members",
            subtitle: bs.team_section_subtitle || "Meet Forensic Experts"
          });

          if (result.data.members) {
            setMembers(result.data.members.slice(0, 12));
          }
        }
      } catch (err) {
        console.error('Error fetching Team data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const TeamCard = ({ member }: { member: TeamMember }) => (
    <div className="flex flex-col">
      {/* Make the entire image area clickable */}
      <Link 
        to={`/team/${member.slug}`}
        className="relative w-full aspect-square rounded-[32px] overflow-hidden mb-6 group bg-slate-100 block"
      >
        <img
          src={member.image}
          alt={member.name}
          className="object-cover object-top transition-all duration-500 group-hover:scale-105 w-full h-full"
        />
      </Link>

      {/* Name and rank - also clickable */}
      <Link to={`/team/${member.slug}`} className="block space-y-1 mb-4">
        <h3 className="text-xl font-bold text-black line-clamp-1 hover:text-[#0B10A4] transition-colors">
          {member.name}
        </h3>
        <p className="text-[#525252] text-[12px] font-medium capitalize tracking-wider line-clamp-2 min-h-[32px]">
          {member.rank}
        </p>
      </Link>

      {/* Social icons - keep as is (they should not navigate to team page) */}
      <div className="flex items-center gap-2">
        {member.facebook && (
          <a 
            href={member.facebook} 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 border border-gray-200 rounded-full text-black hover:text-[#FF8C00] hover:border-[#FF8C00] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <FaFacebook size={14} />
          </a>
        )}
        {member.twitter && (
          <a 
            href={member.twitter} 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 border border-gray-200 rounded-full text-black hover:text-[#FF8C00] hover:border-[#FF8C00] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <FaTwitter size={14} />
          </a>
        )}
        {member.linkedin && (
          <a 
            href={member.linkedin} 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 border border-gray-200 rounded-full text-black hover:text-[#FF8C00] hover:border-[#FF8C00] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <FaLinkedin size={14} />
          </a>
        )}
        {member.instagram && (
          <a 
            href={member.instagram} 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 border border-gray-200 rounded-full text-black hover:text-[#FF8C00] hover:border-[#FF8C00] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <FaInstagram size={14} />
          </a>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="w-full aspect-square rounded-[32px]" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="w-8 h-8 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) return null;

  const useSlider = members.length > 5;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row md:justify-between justify-center md:items-end items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <p className="text-[#04063E] font-semibold text-[18px] mb-2 tracking-wide">
              {content.title}
            </p>
            <h2 className="text-4xl md:text-[36px] font-bold text-black leading-tight">
              {content.subtitle}
            </h2>
          </div>

          <Link
            to="/team"
            className="bg-gradient-to-r from-[#0B10A4] to-[#04063E] text-white px-10 py-3 text-[18px] rounded-full font-bold flex items-center gap-4 cursor-pointer border-none no-underline transition-all hover:opacity-90"
          >
            View All Teams
            <MoveRight size={20} />
          </Link>
        </div>

        {!useSlider ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            loop={members.length > 5}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={800}
            breakpoints={{
              320: { slidesPerView: 1.15 },
              480: { slidesPerView: 1.6 },
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="pb-4"
          >
            {members.map((member) => (
              <SwiperSlide key={member.id} className="h-auto">
                <TeamCard member={member} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Team;