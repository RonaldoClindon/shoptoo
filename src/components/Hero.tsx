"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const scrollToProducts = () => {
    const element = document.getElementById("product-grid-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden py-16 lg:py-20 bg-transparent border-b border-gray-100 dark:border-zinc-800/40 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-sans">
          <span className="block text-gray-900 dark:text-zinc-50">Elevate Your Lifestyle With</span>
          <span className="mt-2 block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent drop-shadow-sm font-black">
            Premium Curated Goods
          </span>
        </h1>

        {/* Hero Tagline */}
        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-gray-500 dark:text-zinc-400 leading-relaxed">
          Discover a handpicked marketplace of world-class jewelry, apparel, and electronics. 
          Crafted for those who value authenticity, modern style, and absolute premium quality.
        </p>

        {/* Call to Action */}
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={scrollToProducts}
            className="group flex items-center gap-2 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 px-6 py-3 text-xs font-semibold text-white shadow-sm transition-all duration-300"
          >
            <span>Shop the Collection</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
