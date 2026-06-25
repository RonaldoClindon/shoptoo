"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Star, StarHalf, ShoppingBag, ChevronUp, ChevronDown, Check } from "lucide-react";
import { Product } from "@/types";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onPurchaseNow: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onPurchaseNow,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !product) return null;

  const { title, price, description, category, image, rating } = product;

  // Star Rating renderer using premium monochrome / dark charcoal stars
  const renderStars = (rate: number) => {
    const stars = [];
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.4;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 text-slate-200 dark:text-zinc-700" />
        );
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Helper to format category
  const formatCategory = (cat: string) => {
    if (cat === "jewelery") return "Jewelry";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/70 dark:bg-zinc-950/80 backdrop-blur-md"
      />

      {/* Modal Dialog Card - Compact size (max-w-3xl) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", duration: 0.45, bounce: 0.05 }}
        className="relative z-10 flex h-full max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-t-4 border-t-slate-900 dark:border-t-zinc-100 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.35)] ring-1 ring-black/10 dark:ring-white/5 md:h-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 text-gray-400 dark:text-zinc-500 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-600 dark:hover:text-zinc-300"
          aria-label="Close product details"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
            
            {/* Left Column: Image Area - Shrunk size, mix-blend-multiply inside light gray frame */}
            <div className="flex items-center justify-center rounded-md border border-gray-100 dark:border-zinc-800/80 bg-gray-50 dark:bg-zinc-900/60 p-6 md:col-span-5 h-[220px] md:h-[280px] w-full self-center">
              <img
                src={image}
                alt={title}
                className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>

            {/* Right Column: Info & Actions */}
            <div className="flex flex-col justify-center md:col-span-7">
              {/* Category */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                {formatCategory(category)}
              </span>

              {/* Title */}
              <h2 className="mt-1 font-sans text-lg md:text-xl font-bold leading-snug tracking-tight text-gray-955 dark:text-white">
                {title}
              </h2>

              {/* Ratings */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">{renderStars(rating.rate)}</div>
                <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                  {rating.rate}
                </span>
                <span className="text-xs text-gray-400 dark:text-zinc-500">
                  • {rating.count} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 border-b border-t border-gray-100 dark:border-zinc-800/50 py-3">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-zinc-550 font-mono">Price</span>
                <div className="font-sans text-xl font-semibold text-gray-900 dark:text-white">
                  ${price.toFixed(2)}
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-550 font-mono">
                  Description
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-650 dark:text-gray-300">
                  {description}
                </p>
              </div>

              {/* Actions Area */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Quantity Selector */}
                <div className="flex items-center self-start sm:self-auto rounded-md border border-gray-200 dark:border-zinc-800 bg-gray-55 dark:bg-zinc-900/60 px-3 py-1.5">
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 mr-3 select-none font-mono">Qty</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200 w-5 text-center select-none">
                    {quantity}
                  </span>
                  <div className="flex flex-col ml-2">
                    <button
                      onClick={incrementQty}
                      className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
                      aria-label="Increase quantity"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={decrementQty}
                      className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
                      aria-label="Decrease quantity"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2.5 text-xs font-semibold transition-all duration-200 border ${
                    isAdded
                      ? "bg-emerald-600 border-emerald-650 text-white font-bold"
                      : "bg-transparent border-gray-250 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {/* Purchase Now */}
                <button
                  onClick={() => onPurchaseNow(product, quantity)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 py-2.5 text-xs font-semibold text-white transition-transform transform hover:scale-105 active:scale-95 duration-200 shadow-sm"
                >
                  <span>🛍️ Purchase Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
