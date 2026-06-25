"use client";

import React from "react";
import { Star, StarHalf, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const { title, price, description, category, image, rating } = product;

  // Star Rating renderer using premium monochrome / dark charcoal stars
  const renderStars = (rate: number) => {
    const stars = [];
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.4;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 fill-gray-900 text-gray-900 dark:fill-zinc-100 dark:text-zinc-100" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf key={i} className="h-3.5 w-3.5 fill-gray-900 text-gray-900 dark:fill-zinc-100 dark:text-zinc-100" />
        );
      } else {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 text-gray-200 dark:text-zinc-800" />
        );
      }
    }
    return stars;
  };

  // Helper to format category
  const formatCategory = (cat: string) => {
    if (cat === "jewelery") return "Jewelry";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <article className="glass-panel glass-panel-hover flex flex-col overflow-hidden rounded-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 transition-all duration-300">
      {/* Product Image Section - Clickable with Premium light gray framing */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative flex h-64 w-full cursor-pointer items-center justify-center bg-gray-50 dark:bg-zinc-900/60 p-8 transition-all duration-300 group border-b border-gray-100 dark:border-zinc-800/65"
        title="Click to view details"
      >
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-gray-900/0 transition-colors duration-300 group-hover:bg-gray-900/[0.01] pointer-events-none" />
        
        {/* Image with mix-blend-multiply for clean integration */}
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Tag */}
        <span className="absolute left-4 top-4 rounded-md bg-gray-900/90 dark:bg-zinc-100/95 px-2.5 py-1 text-[9px] font-semibold tracking-wider uppercase text-white dark:text-zinc-950 backdrop-blur-sm shadow-sm">
          {formatCategory(category)}
        </span>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col p-5 bg-white dark:bg-zinc-900">
        {/* Ratings & Count */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">{renderStars(rating.rate)}</div>
          <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500">
            ({rating.count})
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="mt-3 font-sans text-sm font-semibold leading-snug text-gray-900 dark:text-zinc-100 line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-gray-600 dark:hover:text-zinc-350 transition-colors"
        >
          {title}
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-zinc-400 line-clamp-2">
          {description}
        </p>

        {/* Spacer */}
        <div className="mt-auto pt-4">
          {/* Price & Action Buttons */}
          <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-zinc-800/80 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-mono">Price</span>
              <span className="font-sans text-base font-semibold text-gray-900 dark:text-zinc-100">
                ${price.toFixed(2)}
              </span>
            </div>
            
            {/* Double Button CTA */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewDetails(product)}
                className="flex-1 flex items-center justify-center gap-1 rounded-md border border-gray-200 dark:border-zinc-855 hover:bg-gray-50 dark:hover:bg-zinc-800/60 py-2 text-[11px] font-medium text-gray-700 dark:text-zinc-300 transition-colors"
                title="View product details"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Details</span>
              </button>
              
              <button
                onClick={() => onAddToCart(product)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-white py-2 text-[11px] font-medium transition-colors"
                title="Purchase Now"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Purchase Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
