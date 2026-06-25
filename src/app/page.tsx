"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, SearchX } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import SearchInput from "@/components/SearchInput";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { ProductGridSkeleton, CategoryFilterSkeleton } from "@/components/Skeletons";
import ErrorView from "@/components/ErrorView";
import FeaturedMarquee from "@/components/FeaturedMarquee";
import AnnouncementBar, { TrustBar } from "@/components/AnnouncementBar";
import { Product } from "@/types";
 
interface Toast {
  id: number;
  message: string;
  productName: string;
}
 
function ProductListing() {
  const { addToCart } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
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

      // 3. Filter by case-insensitive Search Query (matches title OR category)
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category === "jewelery" && "jewelry".includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Reset pagination when query/filters change
  useEffect(() => {
    setCurrentPage(1);
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

  const handlePurchaseNow = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    router.push("/cart?checkout=true");
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="relative min-h-screen bg-transparent text-gray-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      {/* Announcement bar */}
      <AnnouncementBar />

      {/* Navigation */}
      <Navbar />

      {/* Hero Banner */}
      <Hero />

      {/* Trust strip */}
      <TrustBar />

      {/* Best Sellers Marquee */}
      <FeaturedMarquee />

      {/* ── Main Product Grid Section ── */}
      <main id="product-grid-section" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">

        {/*
          Filter + Search Bar Row
          ─────────────────────────────────────────────────────────────
          Layout: category pills on the left, search input on the right.
          On mobile they stack vertically (flex-col), on sm+ go side-by-side.
          The search bar is scoped here (not in the Navbar) so it is only
          visible on the product listing page and sits contextually next
          to the filters it affects.
        */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-3">
          {/* Category filter pills */}
          <div className="flex-1">
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

          {/* Search input — max-width keeps it compact on wide screens */}
          <div className="w-full sm:w-64 lg:w-72 shrink-0">
            <SearchInput
              value={searchQuery}
              onChange={(val) => router.push(`/?search=${encodeURIComponent(val)}`, { scroll: false })}
              onSubmit={() => {}}
              placeholder="Search products..."
            />
          </div>
        </div>

        {/* ── Product Listing ── */}
        <section className="w-full">
          {isLoading ? (
            // Skeleton placeholders while API is fetching
            <ProductGridSkeleton count={8} />
          ) : error ? (
            // Error boundary fallback with retry
            <ErrorView message={error} onRetry={fetchProducts} />
          ) : filteredProducts.length === 0 ? (
            /*
              Empty State — shown when search/filter returns 0 results.
              Gives the user clear feedback and a one-click way to reset.
            */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-dashed border-gray-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/30 p-16 text-center shadow-sm max-w-lg mx-auto mt-6"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                <SearchX className="h-8 w-8 text-gray-400 dark:text-zinc-500" />
              </div>
              <h3 className="font-sans text-base font-bold text-gray-800 dark:text-white">
                No products found
              </h3>
              {searchQuery ? (
                <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                  No results for&nbsp;<span className="font-semibold text-gray-800 dark:text-zinc-200">&ldquo;{searchQuery}&rdquo;</span>.<br />
                  Try a different keyword or clear the search.
                </p>
              ) : (
                <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
                  No products match the selected category.
                </p>
              )}
              {/* Quick-reset buttons */}
              <div className="mt-5 flex items-center justify-center gap-2">
                {searchQuery && (
                  <button
                    onClick={() => router.push("/?search=", { scroll: false })}
                    className="rounded-md bg-gray-900 dark:bg-zinc-100 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-950 hover:opacity-90 transition-opacity"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => { setSelectedCategory("all"); router.push("/"); }}
                  className="rounded-md border border-gray-200 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Show All Products
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Result count summary */}
              <div className="mb-6 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/65 pb-3">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-zinc-200">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                  </span> of{" "}
                  <span className="font-semibold text-gray-900 dark:text-zinc-100">{filteredProducts.length}</span> premium products
                </p>
              </div>

              {/* Grid: 1 Mobile, 2 Tablet, 3-4 Desktop */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    onPurchaseNow={(p) => handlePurchaseNow(p, 1)}
                  />
                ))}
              </div>

              {/* Horizontal Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-1.5 select-none">
                  {/* Prev Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-gray-705 dark:text-zinc-300 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    &lt; Prev
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-md px-3.5 py-1.5 text-xs font-semibold border transition-all ${
                        currentPage === page
                          ? "bg-gray-900 border-gray-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 font-bold shadow-sm"
                          : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-gray-705 dark:text-zinc-300 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-100 dark:border-zinc-900 bg-slate-50 dark:bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-slate-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 text-xs font-black">P</div>
              <span className="font-bold text-slate-700 dark:text-zinc-300 text-sm">PREMIUM SHOP</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} Premium Shop. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-zinc-500">
              <span>Privacy</span><span>·</span><span>Terms</span><span>·</span><span>Support</span>
            </div>
          </div>
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
            onPurchaseNow={handlePurchaseNow}
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
