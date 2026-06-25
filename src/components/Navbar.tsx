"use client";

import React from "react";
import { Search, ShoppingBag, X, Sun, Moon } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onCartClick: () => void;
  theme: string;
  onThemeToggle: () => void;
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  cartCount,
  onCartClick,
  theme,
  onThemeToggle,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Enlarged */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 font-serif text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
            P
          </div>
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-blue-600 dark:from-zinc-50 dark:via-zinc-200 dark:to-blue-400 bg-clip-text font-serif text-2xl font-bold tracking-wider text-transparent select-none">
            PREMIUM SHOP
          </span>
        </div>

        {/* Search Bar - Center, Enlarged & Name-focused */}
        <div className="relative mx-6 hidden max-w-lg flex-1 sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-slate-400 dark:text-zinc-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 py-3 pl-11 pr-12 text-sm md:text-base text-slate-900 dark:text-zinc-100 placeholder-slate-450 dark:placeholder-zinc-500 outline-none transition-all duration-300 focus:border-blue-500/60 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500/60"
            placeholder="Search by product name..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={onThemeToggle}
            className="rounded-full border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-2.5 text-slate-450 dark:text-zinc-400 transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-100"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-5.5 w-5.5 text-amber-500 fill-amber-500/10" />
            ) : (
              <Moon className="h-5.5 w-5.5 text-blue-600 fill-blue-600/5" />
            )}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/RonaldoClindon/shoptoo.git"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-2.5 text-slate-450 dark:text-zinc-400 transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-100"
            title="View Source on GitHub"
          >
            <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative rounded-full border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-2.5 text-slate-450 dark:text-zinc-400 transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-100"
            title="Open Bag"
          >
            <ShoppingBag className="h-5.5 w-5.5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Enlarged */}
      <div className="px-4 pb-4 sm:hidden">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4.5 w-4.5 text-slate-400 dark:text-zinc-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 py-2.5 pl-10 pr-8 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500/50 focus:bg-white"
            placeholder="Search by product name..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-zinc-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
