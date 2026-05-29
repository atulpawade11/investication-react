import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ClipboardCheck, Users, Briefcase, GraduationCap, Shield, Award, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';

// Static logos with names
const LOGOS = [
  { src: "/about/client1.jpg", name: "Cadila Pharmaceuticals" },
  { src: "/about/client2.jpg", name: "Leading Banking Institution" },
  { src: "/about/client3.jpg", name: "Delhi University" },
  { src: "/about/client4.png", name: "Detective Agency" },
  { src: "/about/client5.jpg", name: "Insurance Company" },
  { src: "/about/client5.jpg", name: "Law Firm" },
  { src: "/about/client1.jpg", name: "Police Department" },
];

// Counter animation component
const Counter = ({ end, duration }: { end: number; duration: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return <span>{count.toLocaleString()}</span>;
};

const ShowcaseStats = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [content, setContent] = useState({
    title: "Forensic Solutions",
    subtitle: "Showcasing Our Best Work"
  });
  const [loading, setLoading] = useState(true);

  const iconMap = [
    <Shield key="1" className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />,
    <Users key="2" className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />,
    <Briefcase key="3" className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />,
    <Award key="4" className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
  ];

  const formatStatValue = (valStr: string) => {
    const num = parseInt(valStr);
    if (isNaN(num)) return { val: 0, suffix: "" };
    if (num >= 1000) return { val: num / 1000, suffix: "K+" };
    return { val: num, suffix: "+" };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
        const result = await response.json();

        if (result.success && result.data) {
          const bs = result.data.bs;
          setContent({
            title: bs.portfolio_section_title || "Forensic Solutions",
            subtitle: bs.portfolio_section_text || "Showcasing Our Best Work"
          });

          setStats(result.data.statistics || []);
        }
      } catch (err) {
        console.error('Error fetching stats data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-[#0B0F2E] to-[#1A1F4E] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-32 mx-auto bg-white/20 rounded-full" />
            <Skeleton className="h-12 w-96 mx-auto mt-4 bg-white/20" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 bg-white/10 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 md:py-24">
  {/* Soft background accents */}
  <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
  <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-200/25 blur-3xl" />

  <div className="relative z-10 container mx-auto px-4">
    {/* Header */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
        <img src="/cap.png" alt="icon" className="h-5 w-5 object-contain" />
        <span>{content.title}</span>
      </div>

      <h2 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
        {content.subtitle}
      </h2>
</div>

    {/* Logos */}
    <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white/80 p-4 md:p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={18}
        slidesPerView={2}
        loop
        autoplay={{ delay: 2200, disableOnInteraction: false }}
        speed={900}
        breakpoints={{
          480: { slidesPerView: 2.2, spaceBetween: 18 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 22 },
          1024: { slidesPerView: 5, spaceBetween: 24 },
          1280: { slidesPerView: 5, spaceBetween: 24 },
        }}
        className="py-2"
      >
        {LOGOS.map((logo, index) => (
          <SwiperSlide key={index}>
          <div className="group relative  w-full border border-slate-200 bg-white p-2 shadow-sm rounded-2xl">
            <div className="flex h-full w-full rounded-2xl">
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                className="max-h-full max-w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </SwiperSlide>
        ))}
      </Swiper>
    </div>

    {/* Divider */}
    <div className="mx-auto my-12 h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

    {/* Stats */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.slice(0, 4).map((stat, i) => {
        const { val, suffix } = formatStatValue(stat.quantity);
        return (
          <div
            key={stat.id || i}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#a8c8ff] via-[#898fcc] to-[#060764]" />
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100 transition-transform duration-300 group-hover:scale-105">
                {React.cloneElement(iconMap[i], { className: "w-7 h-7 text-blue-600" })}
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 leading-none">
                  <Counter end={val} duration={1800} />
                  <span className="text-black"> {suffix}</span>
                </div>
                <p className="mt-2 text-sm md:text-base text-slate-600">
                  {stat.title}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>
  );
};

export default ShowcaseStats;