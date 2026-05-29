import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  
  // Debug log
  console.log("Pagination Component - totalPages:", totalPages, "currentPage:", currentPage);
  
  // If totalPages is 0 or undefined, set to 1 for testing
  const safeTotalPages = totalPages && totalPages > 0 ? totalPages : 1;
  
  // Don't hide pagination - always show for debugging
  // Just show single page if needed

  console.log("Safe totalPages:", safeTotalPages);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(safeTotalPages);
      } else if (currentPage >= safeTotalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = safeTotalPages - 4; i <= safeTotalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(safeTotalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`h-9 w-9 flex items-center justify-center rounded-full border transition ${
          currentPage === 1
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-300 text-[#0B10A4] hover:bg-[#0B10A4] hover:text-white hover:border-[#0B10A4]"
        }`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`min-w-[36px] h-9 px-3 rounded-full text-sm font-medium transition ${
            currentPage === page
              ? "bg-[#0B10A4] text-white"
              : typeof page === 'number'
                ? "border border-gray-300 text-gray-600 hover:bg-[#0B10A4] hover:text-white hover:border-[#0B10A4]"
                : "border-none cursor-default text-gray-400"
          }`}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === safeTotalPages}
        className={`h-9 w-9 flex items-center justify-center rounded-full border transition ${
          currentPage === safeTotalPages
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-300 text-[#0B10A4] hover:bg-[#0B10A4] hover:text-white hover:border-[#0B10A4]"
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}