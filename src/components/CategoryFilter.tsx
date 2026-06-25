"use client";

import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) {
  // Helper to format category names for display
  const formatCategoryName = (name: string) => {
    if (name === "all") return "All Products";
    if (name === "jewelery") return "Jewelry";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full">
      {/* Horizontal pill row - elegant, full-width, scrollable on mobile, flex-wrap on larger screens */}
      <div className="flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto pb-3 md:pb-0 scrollbar-none scroll-smooth">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-md px-4 py-2 text-xs font-medium tracking-wide transition-all duration-200 whitespace-nowrap border ${
                isActive
                  ? "bg-gray-900 border-gray-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 font-semibold shadow-sm"
                  : "bg-gray-150 border-gray-200/80 text-gray-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 hover:bg-gray-200/60 dark:hover:bg-zinc-850"
              }`}
            >
              <span className={isActive ? "text-shimmer-silver dark:text-shimmer-charcoal" : ""}>
                {formatCategoryName(category)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
