"use client";

import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categoryMeta: Record<string, { emoji: string; label: string }> = {
  all: { emoji: "🛍️", label: "All Products" },
  jewelery: { emoji: "💍", label: "Jewelry" },
  "men's clothing": { emoji: "👔", label: "Men's" },
  "women's clothing": { emoji: "👗", label: "Women's" },
  electronics: { emoji: "📱", label: "Electronics" },
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full">
      <div className="flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          const meta = categoryMeta[category] || { emoji: "🏷️", label: category };
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-[11px] font-bold tracking-wide transition-all duration-200 whitespace-nowrap border shadow-sm hover:scale-105 active:scale-95 ${
                isActive
                  ? "bg-slate-900 border-slate-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 shadow-md"
                  : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-400 dark:hover:border-zinc-600 hover:text-slate-800 dark:hover:text-zinc-200"
              }`}
            >
              <span className="text-base leading-none">{meta.emoji}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
