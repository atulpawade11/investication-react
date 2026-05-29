// components/blog/BlogSidebar/index.tsx
import CategoriesList from "./CategoriesList";
import RecentPosts from "./RecentPosts";

interface BlogSidebarProps {
  categories: any[];
  recentPosts: any[];
  selectedCategory: string;
  setSelectedCategory?: (id: string) => void;
}

export default function BlogSidebar({ 
  categories, 
  recentPosts, 
  selectedCategory, 
  setSelectedCategory 
}: BlogSidebarProps) {
  
  const handleCategoryClick = (id: string) => {
    if (setSelectedCategory) {
      setSelectedCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <CategoriesList 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryClick} 
      />
      <RecentPosts posts={recentPosts} />
    </div>
  );
}