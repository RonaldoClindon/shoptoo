"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Sun, Moon, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import SearchInput from "./SearchInput";
import { motion, AnimatePresence } from "framer-motion";

function NavbarContent() {
  const { cart, theme, toggleTheme, user, logout } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Calculate cart count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Search state bound locally
  const [localQuery, setLocalQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sync local query with URL search param
  useEffect(() => {
    const search = searchParams.get("search") || "";
    setLocalQuery(search);
  }, [searchParams]);

  // Instant filter on type / change
  const handleSearchChange = (val: string) => {
    setLocalQuery(val);
    router.push(`/?search=${encodeURIComponent(val)}`);
  };

  const handleSearchSubmit = () => {
    router.push(`/?search=${encodeURIComponent(localQuery)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-zinc-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Minimalist modern sans-serif */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-900 dark:bg-zinc-100 font-sans text-lg font-bold text-white dark:text-zinc-950 shadow-sm">
            P
          </div>
          <span className="font-sans text-lg font-bold tracking-tight text-gray-900 dark:text-white select-none">
            PREMIUM SHOP
          </span>
        </Link>

        {/* Search Bar - Center, Sleek, rounded-md */}
        <div className="relative mx-6 hidden max-w-md flex-1 sm:block">
          <SearchInput
            value={localQuery}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="rounded-md border border-gray-200 dark:border-zinc-850 bg-white/50 dark:bg-zinc-900/30 p-2.5 text-gray-500 dark:text-zinc-400 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-100"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-zinc-100" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-gray-900" />
            )}
          </button>

          {/* User Profile / Premium Dropdown Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm select-none"
              >
                <span className="font-semibold text-gray-905 dark:text-white">✨ Hi, {user.name}</span>
                <svg
                  className={`h-3 w-3 ml-0.5 text-gray-400 dark:text-zinc-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 z-20 w-48 origin-top-right rounded-md border border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-lg"
                    >
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-800/80 mb-1">
                        <p className="text-[10px] uppercase font-bold text-gray-450 dark:text-zinc-500 font-mono tracking-wider">Logged In As</p>
                        <p className="text-[10px] text-gray-600 dark:text-gray-300 truncate mt-0.5" title={user.email}>{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 transition-all duration-200 shadow-sm"
              title="Sign In"
            >
              <span>👤 Sign In</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative rounded-md border border-gray-200 dark:border-zinc-850 bg-white/50 dark:bg-zinc-900/30 p-2.5 text-gray-500 dark:text-zinc-400 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-100"
            title="Open Bag"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 dark:bg-zinc-100 text-[9px] font-bold text-white dark:text-zinc-950 select-none">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar - Center, Sleek, rounded-md */}
      <div className="px-4 pb-4 sm:hidden">
        <SearchInput
          value={localQuery}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
        />
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-zinc-800/80 bg-white/80 dark:bg-black/85 backdrop-blur-md h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-900 dark:bg-zinc-100 font-sans text-lg font-bold text-white dark:text-zinc-950 shadow-sm">
            P
          </div>
          <span className="font-sans text-lg font-bold tracking-tight text-gray-900 dark:text-white select-none">
            PREMIUM SHOP
          </span>
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  );
}
