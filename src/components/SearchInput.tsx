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

  return (
    <form onSubmit={handleFormSubmit} className={`relative w-full ${className}`}>
      <div className="relative">
        <button
          type="submit"
          className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
          title="Search"
        >
          <Search className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 py-2.5 pl-11 pr-10 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-450 dark:placeholder-zinc-500 outline-none transition-all duration-200 focus:border-gray-900/40 dark:focus:border-zinc-100/40 focus:ring-1 focus:ring-gray-900/40 dark:focus:ring-zinc-100/40 shadow-sm"
          placeholder={placeholder}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
    </form>
  );
}
