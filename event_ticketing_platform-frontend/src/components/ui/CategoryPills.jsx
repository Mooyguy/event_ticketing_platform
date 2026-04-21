import React from "react";

export default function CategoryPills({
  categories,
  selectedCategory,
  onSelect,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => {
        const active = category === selectedCategory;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-md transition sm:px-5 sm:py-2.5 sm:text-base ${
              active
                ? "border-transparent bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}