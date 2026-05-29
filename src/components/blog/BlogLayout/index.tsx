// components/blog/BlogLayout/index.tsx
import { useState, useEffect, useMemo } from "react";
import BlogList from "../BlogList/index";
import BlogSidebar from "../BlogSidebar/index";
import { API_BASE_URL } from '@/lib/config';

interface BlogLayoutProps {
  initialCategory?: string;
}

// Shimmer Skeleton Component
function BlogLayoutSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* Blog List Skeleton */}
      <div className="lg:col-span-3">
        <div className="space-y-6">
          {/* Search bar skeleton */}
          <div className="mb-6">
            <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
          </div>
          
          {/* Blog cards skeleton */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Image skeleton */}
                <div className="md:w-48 h-48 bg-gray-200 rounded-lg animate-pulse" />
                
                {/* Content skeleton */}
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
                  <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-5/6" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-24" />
                    <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-32" />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Pagination skeleton */}
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          {/* Categories skeleton */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-5 bg-gray-200 rounded-lg animate-pulse w-full" />
              ))}
            </div>
          </div>
          
          {/* Recent posts skeleton */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-40 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
                  <div className="h-3 bg-gray-200 rounded-lg animate-pulse w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogLayout({ initialCategory = "All" }: BlogLayoutProps) {
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Sync URL category
  useEffect(() => {
    setSelectedCategory(initialCategory || "All");
  }, [initialCategory]);

  // Fetch all blogs AND all categories from all pages
  useEffect(() => {
    const fetchAllBlogs = async () => {
      setLoading(true);

      try {
        let allBlogsData: any[] = [];
        let allCategoriesMap = new Map(); // Use Map to deduplicate categories
        let totalPages = 1;

        // First request
        const firstResponse = await fetch(
          `${API_BASE_URL}/InvestigationServices/Website/front/blogs?page=1&per_page=100`
        );

        const firstResult = await firstResponse.json();

        if (firstResult.success) {
          // Collect categories from first page
          const firstPageCategories = firstResult.data?.bcats || [];
          firstPageCategories.forEach((cat: any) => {
            if (Number(cat.status) === 1) {
              allCategoriesMap.set(String(cat.id), cat);
            }
          });

          totalPages =
            firstResult.data?.blogs?.pagination?.total_pages ||
            firstResult.data?.pagination?.total_pages ||
            firstResult.data?.blogs?.last_page ||
            1;

          const firstPageBlogs =
            firstResult.data?.blogs?.data ||
            firstResult.data?.data ||
            [];

          allBlogsData = [...firstPageBlogs];

          // Fetch remaining pages
          for (let page = 2; page <= totalPages; page++) {
            const pageResponse = await fetch(
              `${API_BASE_URL}/InvestigationServices/Website/front/blogs?page=${page}&per_page=100`
            );

            const pageResult = await pageResponse.json();

            if (pageResult.success) {
              const pageBlogs =
                pageResult.data?.blogs?.data ||
                pageResult.data?.data ||
                [];

              allBlogsData = [...allBlogsData, ...pageBlogs];

              // IMPORTANT: Collect categories from every page
              const pageCategories = pageResult.data?.bcats || [];
              pageCategories.forEach((cat: any) => {
                if (Number(cat.status) === 1) {
                  allCategoriesMap.set(String(cat.id), cat);
                }
              });
            }
          }

          // Remove duplicate blogs
          const uniqueBlogs = Array.from(
            new Map(allBlogsData.map((blog) => [blog.id, blog])).values()
          );

          // Get active categories that have blogs
          const blogCategoryIds = new Set(
            uniqueBlogs.map((blog: any) =>
              String(blog.bcategory_id || blog.category_id)
            )
          );

          // Filter categories to only those that have blogs AND are active
          const activeCategories = Array.from(allCategoriesMap.values()).filter((cat: any) =>
            blogCategoryIds.has(String(cat.id))
          );

          console.log("Total unique blogs:", uniqueBlogs.length);
          console.log("Total active categories:", activeCategories.length);
          console.log("Categories:", activeCategories.map(c => ({ id: c.id, name: c.name })));

          setCategories(activeCategories);
          setAllBlogs(uniqueBlogs);
        }
      } catch (error) {
        console.error("Blog Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, []);

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    let filtered = [...allBlogs];

    // Always filter out blogs from inactive categories
    const activeCategoryIds = new Set(
      categories.map(cat => String(cat.id))
    );

    filtered = filtered.filter((blog: any) => {
      const blogCategoryId = String(blog.bcategory_id || blog.category_id || "");
      return activeCategoryIds.has(blogCategoryId);
    });

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();

      filtered = filtered.filter((blog: any) => {
        const title = blog.title?.toLowerCase() || "";
        const description =
          blog.meta_description?.toLowerCase() ||
          blog.content?.toLowerCase() ||
          "";

        return (
          title.includes(search) ||
          description.includes(search)
        );
      });
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((blog: any) => {
        const blogCategoryId = String(
          blog.bcategory_id || blog.category_id || ""
        );

        return blogCategoryId === String(selectedCategory);
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || a.publish_date || 0);
      const dateB = new Date(b.created_at || b.publish_date || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return filtered;
  }, [allBlogs, searchTerm, selectedCategory, categories]);

  // Pagination calculations
  const totalFilteredBlogs = filteredBlogs.length;
  const totalPages = Math.ceil(totalFilteredBlogs / itemsPerPage);

  // Current page blogs
  const currentBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredBlogs.slice(startIndex, endIndex);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  // Recent posts - only from active categories (excluding current blog if on detail page)
  const recentPosts = useMemo(() => {
    const activeCategoryIds = new Set(
      categories.map(cat => String(cat.id))
    );

    return [...allBlogs]
      .filter(blog => {
        const blogCategoryId = String(blog.bcategory_id || blog.category_id || "");
        return activeCategoryIds.has(blogCategoryId);
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.publish_date || 0);
        const dateB = new Date(b.created_at || b.publish_date || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);
  }, [allBlogs, categories]);

  const handlePageChange = (page: number) => {
    if (
      page === currentPage ||
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ONLY THIS PART CHANGED - replaced spinner with skeleton
  if (loading) {
    return <BlogLayoutSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* Blog List */}
      <div className="lg:col-span-3">
        <BlogList
          blogs={currentBlogs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          paginationProps={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
          }}
          totalBlogsCount={totalFilteredBlogs}
        />
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <BlogSidebar
          categories={categories}
          recentPosts={recentPosts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
    </div>
  );
}