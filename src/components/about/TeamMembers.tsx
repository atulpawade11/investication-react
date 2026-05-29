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

export default function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [header, setHeader] = useState({
    title: "Our Experts",
    subtitle: "Meet our Team Members"
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

          setHeader({
            title: bs.team_title || "Our Experts",
            subtitle: bs.team_subtitle || "Meet our Team Members"
          });

          if (result.data.members) {
            setMembers(result.data.members);
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
      {/* CARD - Same style as homepage */}
      <Link
        to={`/team/${member.slug}`}
        className="group relative overflow-hidden rounded-2xl bg-[#FFD707] block h-[320px]"
      >
        <div className="relative h-full w-full">
          <img
            src={member.image}
            alt={member.name}
            className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/team/placeholder.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05083D] via-[#05083D]/70 to-transparent" />
        </div>

        {/* REVEAL ZONE */}
        <div className="absolute bottom-0 w-full overflow-hidden h-[96px]">
          <div className="translate-y-[20px] transition-transform duration-300 ease-out group-hover:translate-y-[-20px]">
            <div className="py-4 px-2 text-left text-white">
              <h4 className="text-[20px] font-semibold leading-tight line-clamp-1">{member.name}</h4>
              <p className="text-[14px] font-regular text-white/80 line-clamp-2">{member.rank}</p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 px-4 pb-4">
              {member.facebook && (
                <a
                  href={member.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-white/80 p-1 text-[#05083D] hover:bg-white cursor-pointer transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaFacebook size={14} />
                </a>
              )}
              {member.twitter && (
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-white/80 p-1 text-[#05083D] hover:bg-white cursor-pointer transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaTwitter size={14} />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-white/80 p-1 text-[#05083D] hover:bg-white cursor-pointer transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaLinkedin size={14} />
                </a>
              )}
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-white/80 p-1 text-[#05083D] hover:bg-white cursor-pointer transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaInstagram size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <section className="mx-auto container px-4 py-12 text-center">
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-4 relative">
            <div className="absolute w-full h-px bg-[#8c8c8c] opacity-60 z-0 top-3"></div>
            <div className="relative z-1 bg-white inline-block px-5 py-2 rounded-full">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-64 mx-auto mb-12" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="rounded-2xl overflow-hidden h-[320px]">
                <Skeleton className="w-full h-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (members.length === 0) return null;

  const useSlider = members.length > 5;

  return (
    <section className="mx-auto container px-4 py-12 text-center">
      <div className="mx-auto max-w-7xl">
        {/* Header with line decoration */}
        <div className="mb-4 relative">
          <div className="absolute w-full h-px bg-[#8c8c8c] opacity-60 z-0 top-3 border border-[#D9D9D9]"></div>
          <span className="text-black text-[14px] font-normal mb-2 border border-[#D9D9D9] rounded-full px-5 py-2 z-1 relative bg-white">
            {header.title}
          </span>
        </div>

        <h2 className="mb-12 text-[30px] font-semibold text-black">
          {header.subtitle}
        </h2>
      </div>

      {/* Grid or Slider based on member count */}
      {!useSlider ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
    </section>
  );
}