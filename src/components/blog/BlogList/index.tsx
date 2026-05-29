import BlogSearch from "./BlogSearch";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import { Loader2 } from "lucide-react";

interface BlogListProps {
  blogs: any[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  paginationProps: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
  };
  totalBlogsCount?: number;
}

export default function BlogList({ 
  blogs, 
  searchTerm, 
  setSearchTerm, 
  paginationProps,
  totalBlogsCount
}: BlogListProps) {
  
  // Don't show pagination if only 1 page or no blogs
  const showPagination = !paginationProps.isLoading && 
                         blogs.length > 0 && 
                         paginationProps.totalPages > 1;
  
  // Don't show result count if no blogs
  const showResultCount = totalBlogsCount && totalBlogsCount > 0;
  
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-[30px] font-semibold text-black">All News</h2>
        <BlogSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Blog List */}
      <div className="mt-8 space-y-6">
        {paginationProps.isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#0B10A4]" size={40} />
          </div>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-xl bg-gray-50">
            <p className="text-gray-400">
              {searchTerm ? `No articles found matching "${searchTerm}"` : "No news articles found."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-sm text-[#0B10A4] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="mt-10">
          <Pagination 
            currentPage={paginationProps.currentPage}
            totalPages={paginationProps.totalPages}
            onPageChange={paginationProps.onPageChange}
          />
        </div>
      )}
      
      {/* Result Count */}
      {showResultCount && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {blogs.length} of {totalBlogsCount} article{totalBlogsCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}