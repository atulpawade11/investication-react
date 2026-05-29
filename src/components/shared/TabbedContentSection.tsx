import { useState } from "react";

// The API provides HTML strings, so we update the type expectation
type TabItem = {
  title: string;
  description: string; // HTML string from API
  image: string;
};

type Props = {
  tabs: TabItem[];
};

export default function TabbedContentSection({ tabs }: Props) {
  const [active, setActive] = useState(0);

  // Guard clause in case tabs are empty
  if (!tabs || tabs.length === 0) return null;

  const current = tabs[active];

  return (
    <div className="grid md:grid-cols-3 gap-8 mt-12">
      {/* Tabs Sidebar */}
      <div className="flex flex-col gap-3">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`w-full text-left px-5 py-4 text-sm font-bold rounded-xl transition-all duration-300 border-l-4 
              ${
                active === index
                  ? "bg-white text-[#0B4F8A] border-[#F68A07] shadow-md shadow-blue-900/5"
                  : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
              }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Content Display Area */}
      <div className="md:col-span-2 bg-white rounded-2xl p-2">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#0B4F8A] mb-4">
            {current.title}
          </h3>
          
          {/* HTML Content Rendering */}
          <div 
            className="text-sm text-gray-600 leading-relaxed prose prose-slate max-w-none
            [&>p]:mb-4 [&>b]:text-gray-900 [&>b]:font-bold"
            dangerouslySetInnerHTML={{ __html: current.description }}
          />
        </div>

        {current.image && (
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-auto object-cover max-h-[350px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}