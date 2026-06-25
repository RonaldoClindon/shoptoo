"use client";

import React from "react";
import { ArrowRight, Tag, Gem, Cpu, Shirt, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const scrollToProducts = () => {
    const element = document.getElementById("product-grid-section");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Background accent blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/50 dark:bg-zinc-800/30 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-300/30 dark:bg-zinc-700/20 rounded-full blur-2xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-4 py-5 lg:py-7">

          {/* LEFT — Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Flash deal badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400"
            >
              <Tag className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Flash Sale — Up to 40% Off</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Premium Goods,
              <br />
              <span className="text-slate-500 dark:text-zinc-400 font-bold">Delivered to You</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-3 text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              World-class jewelry, clothing & electronics — handpicked for premium quality at unbeatable prices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-5 flex items-center gap-3 justify-center lg:justify-start flex-wrap"
            >
              <button
                onClick={scrollToProducts}
                className="group flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white px-6 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Shop Now
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={scrollToProducts}
                className="text-sm font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 transition-colors"
              >
                View All Products
              </button>
            </motion.div>

            {/* Compact stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex items-center gap-4 justify-center lg:justify-start"
            >
              {[
                { value: "10K+", label: "Customers" },
                { value: "4.9★", label: "Rating" },
                { value: "Free", label: "Shipping $100+" },
              ].map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-base font-black text-slate-800 dark:text-zinc-100">{s.value}</div>
                  <div className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-wide font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Category quick-links visual grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0 w-full lg:w-96"
          >
            <div className="grid grid-cols-2 gap-1.5">
              {[
                {
                  label: "Jewelry",
                  Icon: Gem,
                  bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40",
                  text: "text-amber-700 dark:text-amber-300",
                  iconBg: "bg-amber-100 dark:bg-amber-900/40",
                  iconColor: "text-amber-600 dark:text-amber-400",
                  desc: "Rings, Bracelets & More",
                },
                {
                  label: "Electronics",
                  Icon: Cpu,
                  bg: "bg-slate-50 dark:bg-zinc-800/50 border-slate-100 dark:border-zinc-700",
                  text: "text-slate-700 dark:text-zinc-200",
                  iconBg: "bg-slate-200 dark:bg-zinc-700",
                  iconColor: "text-slate-600 dark:text-zinc-300",
                  desc: "Gadgets & Devices",
                },
                {
                  label: "Men's",
                  Icon: Shirt,
                  bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40",
                  text: "text-blue-700 dark:text-blue-300",
                  iconBg: "bg-blue-100 dark:bg-blue-900/40",
                  iconColor: "text-blue-600 dark:text-blue-400",
                  desc: "Style for Men",
                },
                {
                  label: "Women's",
                  Icon: Sparkles,
                  bg: "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40",
                  text: "text-rose-700 dark:text-rose-300",
                  iconBg: "bg-rose-100 dark:bg-rose-900/40",
                  iconColor: "text-rose-600 dark:text-rose-400",
                  desc: "Fashion & Trends",
                },
              ].map((cat, i) => (
                <motion.button
                  key={cat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  onClick={scrollToProducts}
                  className={`rounded-2xl border p-3 text-left transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 group ${cat.bg}`}
                >
                  {/* Icon box */}
                  <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl mb-2 ${cat.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                    <cat.Icon className={`h-4 w-4 ${cat.iconColor}`} strokeWidth={1.75} />
                  </div>
                  <div className={`text-sm font-black ${cat.text}`}>{cat.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">{cat.desc}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
