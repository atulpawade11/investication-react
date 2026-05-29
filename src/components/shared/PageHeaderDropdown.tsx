import { useState } from "react";


type Props = {
  title: string;
};

export default function PageHeaderDropdown({ title }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="w-full bg-[#0B4F8A] text-white px-6 py-4 rounded-md flex justify-between items-center"
    >
      <span className="font-semibold">{title}</span>
    </button>
  );
}
