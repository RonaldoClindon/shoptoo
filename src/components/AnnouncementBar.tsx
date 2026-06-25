"use client";

import React, { useState, useEffect } from "react";
import { X, Zap, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const offers = [
  "🚀 Free Shipping on orders over $100 — Shop Now",
  "💎 Use code PREMIUM10 for 10% off your first order",
  "🎁 Buy 2 Get 1 Free on selected Men's Clothing",
  "⚡ Flash Sale: Up to 40% off on Electronics today only!",
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-slate-900 dark:bg-zinc-950 text-white text-[11px] font-semibold py-2 px-4 text-center overflow-hidden">
      {/* Shimmer stripe */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="inline-block tracking-wide"
        >
          {offers[current]}
        </motion.span>
      </AnimatePresence>

      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export function TrustBar() {
  const features = [
    { icon: Truck, text: "Free Shipping Over $100" },
    { icon: ShieldCheck, text: "Secure SSL Checkout" },
    { icon: RotateCcw, text: "30-Day Easy Returns" },
    { icon: Zap, text: "Lightning Fast Delivery" },
  ];

  return (
    <div className="border-b border-slate-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-0 divide-x divide-slate-100 dark:divide-zinc-800">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 px-4 py-2.5">
              <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400 shrink-0" />
              <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 whitespace-nowrap uppercase tracking-wide">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
