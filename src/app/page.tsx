"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { ProductGridSkeleton, CategoryFilterSkeleton } from "@/components/Skeletons";
import ErrorView from "@/components/ErrorView";
import { Product } from "@/types";

interface Toast {
  id: number;
  message: string;
  productName: string;
}

function ProductListing() {
  const { addToCart } = useApp();
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);

  // Sync search state from URL query parameter
  const searchQuery = searchParams.get("search") || "";

  // Fetch Products
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred while fetching products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Strict Categories definition
  const categories = useMemo(() => {
    return ["all", "jewelery", "men's clothing", "women's clothing", "electronics"];
  }, []);

  // Filter Products based on search and category strictly
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Strictly categorize into the specified 4 categories
      const isStrictCategory = ["jewelery", "men's clothing", "women's clothing", "electronics"].includes(
        product.category
      );
      if (!isStrictCategory) return false;

      // 2. Filter by Category Filter Pill
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      // 3. Filter by case-insensitive Search Query
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Reset pagination when query/filters change
  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory, searchQuery]);

  // Add to Cart toast triggers
  const handleAddToCart = (product: Product, quantity = 1) => {
    addToCart(product, quantity);

    // Trigger Toast
    const newToast: Toast = {
      id: toastIdCounter,
      message: `Added ${quantity} item${quantity > 1 ? "s" : ""} to your bag`,
      productName: product.title,
    };
    setToasts((prev) => [...prev, newToast]);
    setToastIdCounter((prev) => prev + 1);

    // Auto-remove toast
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredProducts.length));
  };

  return (
    <div className="relative min-h-screen bg-transparent text-gray-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      {/* Navigation */}
      <Navbar />

      {/* Hero Banner */}
      <Hero />

      {/* Main Grid Content */}
      <main id="product-grid-section" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Full width Category Filter pill row */}
        <div className="mb-8">
          {isLoading ? (
            <CategoryFilterSkeleton />
          ) : (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}
        </div>

        {/* Product Listing Grid Area */}
        <section className="w-full">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <ErrorView message={error} onRetry={fetchProducts} />
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-md border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-16 text-center shadow-sm max-w-xl mx-auto">
              <Search className="mx-auto h-12 w-12 text-gray-400 dark:text-zinc-650" />
              <h3 className="mt-4 font-sans text-base font-bold text-gray-800 dark:text-zinc-200">No products found</h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
                No products matched &ldquo;{searchQuery}&rdquo;. Try adjusting your keywords or category filters.
              </p>
            </div>
          ) : (
            <>
              {/* Result Info */}
              <div className="mb-6 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/65 pb-3">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-zinc-200">{Math.min(visibleCount, filteredProducts.length)}</span> of{" "}
                  <span className="font-semibold text-gray-900 dark:text-zinc-100">{filteredProducts.length}</span> premium products
                </p>
              </div>

              {/* Grid: 1 Mobile, 2 Tablet, 3-4 Desktop */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="mt-12 flex flex-col items-center justify-center gap-2.5">
                  <button
                    onClick={handleLoadMore}
                    className="rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 px-8 py-3 text-xs font-semibold text-gray-700 dark:text-zinc-300 shadow-sm transition-colors hover:bg-gray-55 dark:hover:bg-zinc-850"
                  >
                    Load More Products
                  </button>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-550 uppercase tracking-widest font-mono font-bold">
                    {filteredProducts.length - visibleCount} products remaining
                  </span>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-100 dark:border-zinc-900/80 bg-gray-50 dark:bg-zinc-950/40 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} PREMIUM SHOP. Created as a technical evaluation. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Details Modal overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <ProductDetailModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Floating Notifications (Toast list) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="pointer-events-auto flex items-start gap-3 rounded-md border border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-lg shadow-gray-200/50 dark:shadow-zinc-950/80"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 border border-gray-200/40 dark:border-zinc-700/40">
                <ShoppingBag className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-zinc-100">
                  {toast.message}
                </p>
                <p className="mt-1 truncate text-[10px] leading-tight text-gray-500 dark:text-zinc-400">
                  {toast.productName}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen bg-transparent flex flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <ProductGridSkeleton count={8} />
        </main>
      </div>
    }>
      <ProductListing />
    </Suspense>
  );
}
