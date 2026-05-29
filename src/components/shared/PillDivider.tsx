type Props = {
  label: string;
};

export default function PillDivider({ label }: Props) {
  return (
    <div className="flex items-center my-10">
      
      {/* Left line */}
      <div className="flex-1 h-px bg-gray-300"></div>

      {/* Pill */}
      <span className="mx-4 px-4 py-1 text-xs font-bold tracking-wide uppercase text-[#0B4F8A] bg-gray-50 border border-gray-200 rounded-full">
        {label}
      </span>

      {/* Right line */}
      <div className="flex-1 h-px bg-gray-300"></div>

    </div>
  );
}