"use client";

import React, { useEffect, useState } from "react";
import { Star, TrendingUp } from "lucide-react";

interface MarqueeProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: { rate: number; count: number };
}

export default function FeaturedMarquee() {
  const [products, setProducts] = useState<MarqueeProduct[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((r) => r.json())
      .then((data: MarqueeProduct[]) => {
        const sorted = [...data].sort((a, b) => b.rating.rate - a.rating.rate);
        setProducts(sorted.slice(0, 12));
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  const items = [...products, ...products];

  const formatCategory = (cat: string) => {
    if (cat === "jewelery") return "Jewelry";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <section className="py-8 bg-transparent">
      {/* Contained card with margin */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section wrapper with ash/slate styling */}
        <div className="rounded-2xl bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/50 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-center gap-2 py-4 px-6 border-b border-slate-200 dark:border-zinc-700/50 bg-slate-50 dark:bg-zinc-800/80">
            <TrendingUp className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
              Best Sellers — Trending Now
            </span>
            <TrendingUp className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
          </div>

          {/* Marquee Track */}
          <div
            className="relative py-4 px-2 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-slate-100 dark:from-zinc-800 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-slate-100 dark:from-zinc-800 to-transparent pointer-events-none" />

            <div
              className="flex gap-3"
              style={{
                animation: isPaused ? "none" : "marqueeScroll 38s linear infinite",
                width: "max-content",
              }}
            >
              {items.map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="flex-shrink-0 w-44 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Image */}
                  <div className="h-28 flex items-center justify-center bg-slate-50 dark:bg-zinc-800/50 p-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-2.5 space-y-1">
                    <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 dark:text-zinc-500">
                      {formatCategory(product.category)}
                    </span>
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 leading-snug line-clamp-1">
                      {product.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[9px] text-slate-500 dark:text-zinc-400 font-semibold">
                          {product.rating.rate.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-200">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
