"use client";

import React from "react";

// Individual Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="glass-panel flex flex-col overflow-hidden rounded-md border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900">
      {/* Image Skeleton */}
      <div className="shimmer h-64 w-full border-b border-gray-100 dark:border-zinc-800/60" />

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-5 bg-white dark:bg-zinc-900">
        {/* Rating Stars Placeholder */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="shimmer h-3.5 w-3.5 rounded-full" />
            ))}
          </div>
          <div className="shimmer h-3 w-8 rounded-md" />
        </div>

        {/* Title Placeholder */}
        <div className="mt-4 space-y-2">
          <div className="shimmer h-4 w-5/6 rounded-md" />
          <div className="shimmer h-4 w-2/3 rounded-md" />
        </div>

        {/* Short Description Placeholder */}
        <div className="mt-3 space-y-1.5">
          <div className="shimmer h-3 w-full rounded-md" />
          <div className="shimmer h-3 w-11/12 rounded-md" />
        </div>

        {/* Footer Area Placeholder */}
        <div className="mt-auto pt-4">
          <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-zinc-800/80 pt-4">
            <div className="flex items-center justify-between">
              <div className="shimmer h-2.5 w-10 rounded-md" />
              <div className="shimmer h-4.5 w-16 rounded-md" />
            </div>
            {/* Dual CTA Skeleton */}
            <div className="flex gap-2">
              <div className="shimmer h-8 flex-1 rounded-md" />
              <div className="shimmer h-8 w-14 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Pill Skeleton
export function CategoryPillSkeleton() {
  return <div className="shimmer h-8 w-24 rounded-md" />;
}

// Grid of Cards Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

// Category filter container skeleton
export function CategoryFilterSkeleton() {
  return (
    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-3">
      {Array.from({ length: 5 }).map((_, idx) => (
        <CategoryPillSkeleton key={idx} />
      ))}
    </div>
  );
}
