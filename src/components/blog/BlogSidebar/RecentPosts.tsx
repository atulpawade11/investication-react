import { Link } from "react-router-dom";
import { useState } from "react";

interface RecentPostsProps {
  posts: any[];
}

// Separate component for each post to have its own error state
function RecentPostItem({ post }: { post: any }) {
  const [imgError, setImgError] = useState(false);

  // Format date with error handling
  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Date not available";
    }
  };

  // Get image URL with fallback
  const originalUrl = (post.main_image || post.home_image || "").replace("http://", "https://");
  const imageUrl = imgError || !originalUrl ? "/blog/placeholder.png" : originalUrl;
  const formattedDate = formatDate(post.created_at || post.publish_date);

  return (
    <div className="mb-4 flex items-center gap-3 last:mb-0 group">
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded bg-gray-100">
        <img
          src={imageUrl}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => {
            if (!imgError) {
              setImgError(true);
            }
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <Link to={`/blogs/${post.slug}`}>
          <p className="text-[14px] font-medium text-black line-clamp-2 mb-1 hover:text-[#0B10A4] transition-colors cursor-pointer leading-tight">
            {post.title}
          </p>
        </Link>
        
        <span className="text-[12px] flex items-center gap-2 font-regular text-black">
          <img
            src="/blog/calander.png"
            alt="date"
            className="w-3 h-3"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {formattedDate}
        </span>
      </div>
    </div>
  );
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h4 className="mb-3 text-[20px] text-black font-semibold">Recent Post</h4>
        <div className="my-4 h-px bg-gray-200" />
        <p className="text-sm text-gray-400 text-center py-4">No recent posts available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-3 text-[20px] text-black font-semibold">Recent Post</h4>
      <div className="my-4 h-px bg-gray-200" />

      {posts.slice(0, 5).map((post) => (
        <RecentPostItem key={post.id} post={post} />
      ))}
    </div>
  );
}