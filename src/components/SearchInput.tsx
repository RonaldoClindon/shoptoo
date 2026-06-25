"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search by product name...",
  className = "",
}: SearchInputProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const hasValue = value.trim().length > 0;

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleFormSubmit} className="relative w-full">
        <div className="relative">
          <button
            type="submit"
            className={`absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors ${
              hasValue
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100"
            }`}
            title="Search"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`block w-full rounded-md border py-2.5 pl-10 pr-10 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 outline-none transition-all duration-200 shadow-sm bg-white dark:bg-zinc-900/50 ${
              hasValue
                ? "border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-400/30 dark:ring-emerald-500/25"
                : "border-gray-250 dark:border-zinc-800 focus:border-gray-900/40 dark:focus:border-zinc-100/40 focus:ring-1 focus:ring-gray-900/20 dark:focus:ring-zinc-100/20"
            }`}
            placeholder={placeholder}
          />
          {hasValue && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Active search badge */}
      {hasValue && (
        <div className="mt-1.5 flex items-center gap-1.5 px-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[220px]">
            Searching for &ldquo;{value}&rdquo;
          </span>
          <button
            onClick={() => onChange("")}
            className="ml-auto text-[10px] text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
