import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  canLoadMore: boolean;
  canLoadLess: boolean;
  onLoadMore: () => void;
  onLoadLess: () => void;
};

export default function LoadMoreButton({
  canLoadMore,
  canLoadLess,
  onLoadMore,
  onLoadLess,
}: Props) {
  // If we can't do either, don't show the container at all
  if (!canLoadMore && !canLoadLess) return null;

  return (
    <div className="mt-8 flex justify-center gap-4">
      {canLoadLess && (
        <button
          onClick={onLoadLess}
          className="bg-gradient-to-r from-[#04063E] to-[#090E92] text-white px-10 py-3 text-[18px] rounded-full font-bold flex items-center gap-4 cursor-pointer border-none no-underline transition-all hover:opacity-90"
        >
          <ArrowLeft size={20} className="group-hover:translate-x-1 transition-transform" />
          Load Less
        </button>
      )}

      {canLoadMore && (
        <button
          onClick={onLoadMore}
          className="bg-gradient-to-r from-[#04063E] to-[#090E92] text-white px-10 py-3 text-[18px] rounded-full font-bold flex items-center gap-4 cursor-pointer border-none no-underline transition-all hover:opacity-90"
        >
          Load More 
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}