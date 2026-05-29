// pages/BlogSlug.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import BackButton from '@/components/common/BackButton';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogDetailClient from "./BlogDetailClient";
import { API_BASE_URL } from '@/lib/config';

// Skeleton Component - to be used INSIDE BlogDetailClient
function BlogSkeletonContent() {
  return (
    <div className="relative">
      <div className="absolute -top-12 right-0 z-10">
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 mt-12">
        <article className="lg:col-span-3">
          {/* Title skeleton */}
          <div className="mb-4">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-3/4 mb-4" />
          </div>
          
          {/* Author & Date skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-24" />
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-32" />
          </div>
          
          {/* Image skeleton */}
          <div className="relative mb-8 h-[300px] md:h-[450px] overflow-hidden rounded-xl bg-gray-200 animate-pulse" />
          
          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-4/5" />
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-5/6" />
          </div>
        </article>

        <aside className="lg:col-span-1">
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
        </aside>
      </div>
    </div>
  );
}

// Separate image component to handle error state
function BlogMainImage({ src, alt }: { src: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = imgError || !src ? "/blog/placeholder.png" : src.replace("http://", "https://");

  return (
    <div className="relative mb-8 h-auto max-h-[450px] overflow-hidden rounded-xl">
      <img
        src={imageUrl}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => {
          if (!imgError) {
            setImgError(true);
          }
        }}
      />
    </div>
  );
}

// Helper function to format date
const formatBlogDate = (dateString: string) => {
  if (!dateString) return "Date not available";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  // Format as "21 Dec, 2025"
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        setLoading(true);
        
        const firstUrl = `${API_BASE_URL}/InvestigationServices/Website/front/blogs?page=1`;
        const firstRes = await fetch(firstUrl);
        if (!firstRes.ok) {
          setError(true);
          return;
        }
        const firstResult = await firstRes.json();
        if (!firstResult.success || !firstResult.data) {
          setError(true);
          return;
        }

        const bcats = firstResult.data.bcats || [];
        const activeBcats = bcats.filter((cat: any) => cat.status === 1);

        let allBlogs = firstResult.data.blogs?.data || [];
        const totalPages = firstResult.data.blogs?.pagination?.total_pages || 
                          firstResult.data.blogs?.last_page || 1;
        
        for (let page = 2; page <= totalPages; page++) {
          const pageRes = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/blogs?page=${page}`);
          const pageResult = await pageRes.json();
          if (pageResult.success && pageResult.data?.blogs?.data) {
            allBlogs = [...allBlogs, ...pageResult.data.blogs.data];
          }
        }

        const uniqueBlogs = Array.from(
          new Map(allBlogs.map((b: any) => [b.id, b])).values()
        );

        const activeCategoryIds = new Set(activeBcats.map((cat: any) => String(cat.id)));
        const activeBlogs = (uniqueBlogs as any[]).filter((b: any) => {
          const blogCatId = String(b.bcategory_id || b.category_id || "");
          return activeCategoryIds.has(blogCatId);
        });

        const decodedSlug = decodeURIComponent(slug);
        const blog = activeBlogs.find((b: any) => 
          b.slug === decodedSlug || 
          b.slug === slug ||
          b.slug?.toLowerCase() === decodedSlug.toLowerCase()
        );

        if (!blog) {
          console.error("Blog not found for slug:", slug);
          setError(true);
          return;
        }

        if (blog.bcategory_id) {
          setSelectedCategory(String(blog.bcategory_id));
        }

        const currentIndex = activeBlogs.findIndex((b: any) => 
          b.slug === decodedSlug || 
          b.slug === slug ||
          b.slug?.toLowerCase() === decodedSlug.toLowerCase()
        );
        const prevBlog = currentIndex > 0 ? activeBlogs[currentIndex - 1] : null;
        const nextBlog = currentIndex < activeBlogs.length - 1 ? activeBlogs[currentIndex + 1] : null;

        const recentBlogs = activeBlogs
          .sort((a: any, b: any) => {
            const dateA = new Date(a.created_at || a.publish_date || 0).getTime();
            const dateB = new Date(b.created_at || b.publish_date || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 5);

        setData({
          blog: blog,
          bcats: activeBcats,
          recent_blogs: recentBlogs,
          be: firstResult.data.be,
          prevPost: prevBlog ? { slug: prevBlog.slug, title: prevBlog.title } : null,
          nextPost: nextBlog ? { slug: nextBlog.slug, title: nextBlog.title } : null
        });
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`/blogs?category=${categoryId}`);
  };

  // Show skeleton inside container when loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <BlogDetailClient 
          title="" 
          slug=""
          metaTitle=""
          metaDescription=""
          prevPost={null}
          nextPost={null}
        >
          <BlogSkeletonContent />
        </BlogDetailClient>
      </div>
    );
  }
  
  if (error || !data || !data.blog) return <div className="min-h-screen flex items-center justify-center">Blog Not Found</div>;

  const { blog, bcats, recent_blogs, be, prevPost, nextPost } = data;
  const formattedDate = formatBlogDate(blog.created_at || blog.publish_date);

  return (
    <div className="min-h-screen bg-white">
      <BlogDetailClient 
        title={blog.title} 
        slug={slug || ""}
        metaTitle={be?.blogs_meta_title}
        metaDescription={be?.blogs_meta_description}
        prevPost={prevPost}
        nextPost={nextPost}
      >
        <div className="relative">
          <div className="absolute -top-12 right-0 z-10">
            <BackButton />
          </div>
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 mt-12">
            <article className="lg:col-span-3">
              {/* Blog Title */}
              <h1 className="text-2xl md:text-[36px] font-bold text-black mb-4 leading-tight">
                {blog.title}
              </h1>
              
              {/* Author and Date */}
              <div className="flex items-center gap-4 mb-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm text-[18px] text-[#777777] font-medium">By {blog.author || "SIFS India"}</span>
                </div>
                <span className="text-gray-300">●</span>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-[18px] text-[#777777] font-medium">{formattedDate}</span>
                </div>
              </div>
              
              <BlogMainImage 
                src={blog.main_image || ""} 
                alt={blog.title} 
              />

              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed blog-content-area"
                dangerouslySetInnerHTML={{ __html: blog.content }} 
              />
            </article>

            <aside className="lg:col-span-1">
              <BlogSidebar 
                categories={bcats || []} 
                recentPosts={recent_blogs || []}
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategoryClick}
              />
            </aside>
          </div>
        </div>
      </BlogDetailClient>
    </div>
  );
}