"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Sun, Moon, LogIn, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import SearchInput from "./SearchInput";

function NavbarContent() {
  const { cart, theme, toggleTheme, user, logout } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Calculate cart count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Search state bound locally
  const [localQuery, setLocalQuery] = useState("");

  // Sync local query with URL search param
  useEffect(() => {
    const search = searchParams.get("search") || "";
    setLocalQuery(search);
  }, [searchParams]);

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
          <span className="font-sans text-lg font-bold tracking-tight text-gray-900 dark:text-zinc-550 select-none">
            PREMIUM SHOP
          </span>
        </Link>

        {/* Search Bar - Center, Sleek, rounded-md */}
        <div className="relative mx-6 hidden max-w-md flex-1 sm:block">
          <SearchInput
            value={localQuery}
            onChange={setLocalQuery}
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

          {/* User Profile / Login Link */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-gray-500 dark:text-zinc-400 font-medium">
                {user.email.split("@")[0]}
              </span>
              <button
                onClick={logout}
                className="rounded-md border border-gray-200 dark:border-zinc-850 bg-white/50 dark:bg-zinc-900/30 p-2.5 text-gray-500 dark:text-zinc-400 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-650 dark:hover:text-red-405"
                title="Log Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-gray-200 dark:border-zinc-850 bg-white/50 dark:bg-zinc-900/30 p-2.5 text-gray-500 dark:text-zinc-400 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-100"
              title="Sign In"
            >
              <LogIn className="h-4.5 w-4.5" />
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

      {/* Mobile Search Bar - Sleek, rounded-md */}
      <div className="px-4 pb-4 sm:hidden">
        <SearchInput
          value={localQuery}
          onChange={setLocalQuery}
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
          <span className="font-sans text-lg font-bold tracking-tight text-gray-900 dark:text-zinc-550 select-none">
            PREMIUM SHOP
          </span>
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  );
}
