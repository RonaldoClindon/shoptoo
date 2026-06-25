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
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Minimalist, modern sans-serif */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-900 dark:bg-zinc-100 font-sans text-lg font-bold text-white dark:text-zinc-950 shadow-sm">
            P
          </div>
          <span className="font-sans text-lg font-bold tracking-tight text-gray-900 dark:text-zinc-50 select-none">
            PREMIUM SHOP
          </span>
        </div>

        {/* Search Bar - Center, Sleek, rounded-md */}
        <div className="relative mx-6 hidden max-w-md flex-1 sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 py-2 pl-10 pr-10 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-455 dark:placeholder-zinc-500 outline-none transition-all duration-200 focus:border-gray-900/40 dark:focus:border-zinc-100/40 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-gray-900/40 dark:focus:ring-zinc-100/40"
            placeholder="Search by product name..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onThemeToggle}
            className="rounded-md border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-2 text-gray-500 dark:text-zinc-400 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-100"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-zinc-100" />
            ) : (
              <Moon className="h-5 w-5 text-gray-900" />
            )}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/RonaldoClindon/shoptoo.git"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-2 text-gray-500 dark:text-zinc-400 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-100"
            title="View Source on GitHub"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative rounded-md border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-2 text-gray-500 dark:text-zinc-400 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-100"
            title="Open Bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 dark:bg-zinc-100 text-[9px] font-bold text-white dark:text-zinc-950 select-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Sleek, rounded-md */}
      <div className="px-4 pb-4 sm:hidden">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 py-2 pl-9 pr-9 text-xs text-gray-900 dark:text-zinc-100 placeholder-gray-400 outline-none transition-all duration-200 focus:border-gray-900/40 dark:focus:border-zinc-100/40 focus:bg-white"
            placeholder="Search by product name..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-zinc-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
