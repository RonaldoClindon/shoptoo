"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="mx-auto my-12 max-w-md rounded-md border border-red-200/50 dark:border-red-950/40 bg-white dark:bg-zinc-900 p-8 text-center shadow-md">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/40">
        <AlertCircle className="h-6 w-6" />
      </div>
      
      <h3 className="mt-5 font-sans text-base font-bold text-gray-900 dark:text-zinc-50">
        Failed to load collection
      </h3>
      
      <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-zinc-400">
        {message || "We encountered an issue fetching the product listings. Please check your connection and try again."}
      </p>

      <button
        onClick={onRetry}
        className="group mt-6 inline-flex items-center gap-2 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors duration-200"
      >
        <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
