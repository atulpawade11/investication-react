import { Search, X } from "lucide-react";

interface BlogSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function BlogSearch({ searchTerm, setSearchTerm }: BlogSearchProps) {
  return (
    <div className="flex justify-end">
      <div className="relative w-full max-w-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full rounded-md border border-gray-200 bg-white pl-4 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B4F8A] focus:border-transparent transition-all"
        />
        
        {/* Search Icon on the right */}
        {searchTerm ? (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        ) : (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}