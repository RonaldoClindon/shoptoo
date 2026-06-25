"use client";

import React, { useState } from "react";
import { Star, StarHalf, Eye, ShoppingCart, Zap } from "lucide-react";
import { Product } from "@/types";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onPurchaseNow: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails, onPurchaseNow }: ProductCardProps) {
  const { title, price, description, category, image, rating } = product;
  const [hovered, setHovered] = useState(false);

  const renderStars = (rate: number) => {
    const stars = [];
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.4;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="h-3 w-3 text-slate-200 dark:text-zinc-700" />);
      }
    }
    return stars;
  };

  const formatCategory = (cat: string) => {
    if (cat === "jewelery") return "Jewelry";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Compute a "was price" (original price before discount)
  const wasPrice = (price * 1.25).toFixed(2);
  const discountPct = 20;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-[0_4px_20px_rgba(59,130,246,0.12)] hover:shadow-[0_12px_32px_rgba(59,130,246,0.25)] transition-shadow duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Section */}
      <div
        onClick={() => onViewDetails(product)}
        className="relative flex h-52 w-full cursor-pointer items-center justify-center bg-slate-50 dark:bg-zinc-800/40 p-6 overflow-hidden"
      >
        {/* Product image */}
        <motion.img
          src={image}
          alt={title}
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
          loading="lazy"
        />

        {/* Discount badge */}
        <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-black text-white shadow-sm">
          -{discountPct}%
        </div>

        {/* Category badge */}
        <span className="absolute top-3 right-3 rounded-full bg-slate-800/80 dark:bg-zinc-700/80 backdrop-blur-sm px-2.5 py-0.5 text-[8px] font-bold tracking-widest uppercase text-white">
          {formatCategory(category)}
        </span>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Ratings */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">{renderStars(rating.rate)}</div>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
            {rating.rate.toFixed(1)} ({rating.count})
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(product)}
          className="mt-2 text-sm font-bold leading-snug text-slate-800 dark:text-white line-clamp-2 cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300 transition-colors min-h-[2.5rem]"
        >
          {title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400 dark:text-zinc-500 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Price row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-900 dark:text-white">${price.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 line-through">${wasPrice}</span>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full">
            Save ${(parseFloat(wasPrice) - price).toFixed(2)}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-none h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-all hover:scale-110 active:scale-95"
            title="View Details"
            aria-label={`View details for ${title}`}
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-[11px] font-semibold transition-all"
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </button>

          <button
            onClick={() => onPurchaseNow(product)}
            className="flex-none h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white transition-all hover:scale-110 active:scale-95 shadow-sm"
            title="Buy Now"
            aria-label={`Buy ${title} now`}
          >
            <Zap className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
