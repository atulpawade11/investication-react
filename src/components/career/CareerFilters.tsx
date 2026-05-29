import React from 'react';

type Props = {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  categories: string[];
};

export default function CareerFilters({ 
  search, 
  setSearch, 
  category, 
  setCategory, 
  categories 
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <input
        type="text"
        placeholder="Search Jobs"
        className="w-full md:w-1/3 p-3 border border-gray-200 rounded text-sm outline-none text-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="w-full md:w-1/4 p-3 border border-green-400 rounded text-sm outline-none bg-white cursor-pointer text-black"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((cat: string) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}