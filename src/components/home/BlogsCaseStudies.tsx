import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { MoveRight, ImageOff } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { Skeleton } from '@/components/shared/Skeleton';

interface Blog {
  id: number;
  title: string;
  slug: string;
  home_image: string | null;
  publish_date: string;
  author: string;
  meta_description: string;
  content: any;
  bcategory_id: number;
}

interface Category {
  id: number;
  name: string;
  status: number;
}

const BlogsCaseStudies = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [content, setContent] = useState({
    title: "Forensic Insights",
    subtitle: "Blogs and Case Studies"
  });
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleString('en-GB', { month: 'long' });
      const year = date.getFullYear();

      const suffix = (d: number) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      };
      return `${day}${suffix(day)} ${month}, ${year}`;
    } catch {
      return dateStr;
    }
  };

  // Function to fetch all pages of blogs
  const fetchAllBlogs = async (baseUrl: string, activeCategoryIds: number[]) => {
    let allBlogs: Blog[] = [];
    let currentPage = 1;
    let hasMore = true;
    let maxPages = 20; // Safety limit to prevent infinite loops

    while (hasMore && currentPage <= maxPages) {
      try {
        const response = await fetch(`${baseUrl}?page=${currentPage}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const blogsData = result.data.blogs?.data || [];
          
          if (blogsData.length === 0) {
            hasMore = false;
            break;
          }
          
          // Filter blogs for active categories on this page
          const filteredPageBlogs = blogsData.filter((blog: Blog) => 
            activeCategoryIds.includes(blog.bcategory_id)
          );
          
          allBlogs = [...allBlogs, ...filteredPageBlogs];
          
          // Check if there's a next page
          const pagination = result.data.blogs?.pagination;
          if (pagination && !pagination.has_next) {
            hasMore = false;
          } else {
            currentPage++;
          }
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        hasMore = false;
      }
    }
    
    return allBlogs;
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        
        // First, fetch first page to get categories and initial data
        const initialResponse = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/blogs`);
        const initialResult = await initialResponse.json();

        if (initialResult.success && initialResult.data) {
          const categories: Category[] = initialResult.data.bcats || [];
          
          // Get active category IDs
          const activeCategoryIds = categories
            .filter(cat => cat.status === 1)
            .map(cat => cat.id);
          
          let allFilteredBlogs: Blog[] = [];
          
          if (activeCategoryIds.length > 0) {
            // Fetch all pages to get all blogs from active categories
            allFilteredBlogs = await fetchAllBlogs(
              `${API_BASE_URL}/InvestigationServices/Website/front/blogs`,
              activeCategoryIds
            );
            
            console.log(`Total blogs fetched from active categories: ${allFilteredBlogs.length}`);
            console.log('Blogs:', allFilteredBlogs.map(b => ({ title: b.title, category: b.bcategory_id })));
          }
          
          setBlogs(allFilteredBlogs);

          if (initialResult.data.bs) {
            setContent({
              title: initialResult.data.bs?.blog_section_title?.replace(/[.]+$/, "") || "Forensic Insights",
              subtitle: initialResult.data.bs?.blog_section_subtitle?.replace(/[.]+$/, "") || "Blogs and Case Studies"
            });
          }
        }
      } catch (err) {
        console.error('Error fetching Blog section:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Function to smartly distribute blogs for the right side
  const getDistributedBlogs = (allBlogs: Blog[], featuredBlogId: number, targetCount: number = 4) => {
    if (allBlogs.length <= 1) return [];
    
    // Exclude the featured blog
    const remainingBlogs = allBlogs.filter(blog => blog.id !== featuredBlogId);
    
    // Group blogs by category
    const blogsByCategory: { [key: number]: Blog[] } = {};
    remainingBlogs.forEach(blog => {
      if (!blogsByCategory[blog.bcategory_id]) {
        blogsByCategory[blog.bcategory_id] = [];
      }
      blogsByCategory[blog.bcategory_id].push(blog);
    });
    
    const categories = Object.keys(blogsByCategory).map(Number);
    const selectedBlogs: Blog[] = [];
    
    // Distribute blogs - take from different categories when possible
    let categoryIndex = 0;
    let itemIndex = 0;
    
    while (selectedBlogs.length < targetCount && selectedBlogs.length < remainingBlogs.length) {
      const categoryId = categories[categoryIndex % categories.length];
      const categoryBlogs = blogsByCategory[categoryId];
      
      if (categoryBlogs && categoryBlogs.length > itemIndex) {
        selectedBlogs.push(categoryBlogs[itemIndex]);
      }
      
      categoryIndex++;
      
      // Reset and move to next item if we've gone through all categories
      if (categoryIndex % categories.length === 0) {
        itemIndex++;
      }
      
      // Prevent infinite loop
      if (itemIndex > 20) break;
    }
    
    return selectedBlogs.slice(0, targetCount);
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="h-[450px] w-full rounded-[32px]" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-5">
                  <Skeleton className="w-44 h-32 rounded-2xl flex-shrink-0" />
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-10 text-center">
          <p className="text-gray-500">No blogs available from active categories.</p>
        </div>
      </section>
    );
  }

  const featuredBlog = blogs[0];
  const sideBlogs = getDistributedBlogs(blogs, featuredBlog.id, 3);

  console.log(`Featured: ${featuredBlog.title}`);
  console.log(`Side blogs (${sideBlogs.length}):`, sideBlogs.map(b => b.title));

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 gap-4">
          <div className="text-center md:text-left">
            <p className="text-[#04063E] font-semibold text-[18px] mb-2 tracking-wide">
              {content.title}
            </p>
            <h2 className="text-4xl md:text-[36px] font-bold text-black leading-tight">
              {content.subtitle}
            </h2>
          </div>
          <Link
            to="/blog"
            className="bg-gradient-to-r from-[#0B10A4] to-[#04063E]
                        text-white px-8 py-3 rounded-full font-bold
                        flex items-center gap-4 hover:shadow-xl transition-all group"
          >
            View All
            <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* LEFT SIDE: Featured Large Blog */}
          {featuredBlog && (
            <Link to={`/blog/${featuredBlog.slug}`} className="lg:col-span-7 group cursor-pointer">
              <div className="border border-[#D8D8D8]/60 rounded-[32px] p-2 h-full shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="relative mb-6">
                  <div className="relative h-[300px] w-full overflow-hidden rounded-[24px] md:h-[330px] bg-gray-100">
                    {featuredBlog.home_image ? (
                      <img
                        src={featuredBlog.home_image}
                        alt={featuredBlog.title || "Featured Blog"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <ImageOff className="text-gray-300" size={48} />
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-[-16px] left-4 z-20 flex items-center gap-2 rounded-full border border-[#D9D9D9] bg-white px-4 py-2 shadow-sm">
                    <span className="text-[10px] font-medium text-black">By {featuredBlog.author || 'Admin'}</span>
                    <div className="h-1 w-1 rounded-full bg-black" />
                    <span className="text-[10px] font-medium text-black">
                      {formatDate(featuredBlog.publish_date)}
                    </span>
                  </div>
                </div>

                <div className="px-2 pb-4 pt-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-black mb-3 group-hover:text-[#0B10A4] transition-colors line-clamp-2">
                    {featuredBlog.title}
                  </h3>
                  <p className="text-[#868686] font-regular text-[16px] line-clamp-3 leading-relaxed">
                    {featuredBlog.meta_description}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* RIGHT SIDE: Distributed Small Blogs from All Pages */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {sideBlogs.length > 0 ? (
              sideBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.slug}`}
                  className="flex flex-col sm:flex-row gap-5 p-2 border border-[#D8D8D8]/60 rounded-2xl hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="relative w-full sm:w-44 h-32 flex-shrink-0 rounded-l-xl overflow-hidden bg-gray-100">
                    {blog.home_image ? (
                      <img
                        src={blog.home_image}
                        alt={blog.title || "Blog thumbnail"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <ImageOff className="text-gray-300" size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center flex-1 pr-2">
                    <h4 className="text-[18px] font-bold text-black mb-2 leading-tight group-hover:text-[#0B10A4] transition-colors line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="text-[#525252] text-[14px] line-clamp-2 mb-3">
                      {blog.meta_description}
                    </p>

                    <div className="bg-white self-start rounded-full px-3 py-1 flex items-center gap-2 border border-[#D9D9D9]">
                      <span className="text-[9px] font-medium text-black">By {blog.author || 'Admin'}</span>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <span className="text-[9px] font-medium text-black">
                        {formatDate(blog.publish_date)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No more blogs to display
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsCaseStudies;