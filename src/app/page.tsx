"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import CartDrawer from "@/components/CartDrawer";
import { ProductGridSkeleton, CategoryFilterSkeleton } from "@/components/Skeletons";
import ErrorView from "@/components/ErrorView";
import { Product } from "@/types";

interface Toast {
  id: number;
  message: string;
  productName: string;
}

export default function Home() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Theme Toggle State
  const [theme, setTheme] = useState<string>("light");
  
  // Cart & Toast States
  const [cart, setCart] = useState<{ [id: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);

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

  // Theme Toggling logic
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Compute Categories Dynamically with strict ordering:
  // All -> Jewelry -> Men's clothing -> Women's clothing -> Electronics
  const categories = useMemo(() => {
    if (products.length === 0) return ["all"];
    const unique = Array.from(new Set(products.map((p) => p.category)));
    const list = ["all", ...unique];
    
    const customOrder = ["all", "jewelery", "men's clothing", "women's clothing", "electronics"];
    
    return list.sort((a, b) => {
      const indexA = customOrder.indexOf(a);
      const indexB = customOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [products]);

  // Filter Products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory, searchQuery]);

  // Dynamic Cart Items mapping
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === parseInt(id));
        return { product, quantity: qty };
      })
      .filter((item): item is { product: Product; quantity: number } => item.product !== undefined);
  }, [cart, products]);

  // Cart total count
  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Add to Cart handler (automatically triggers CartDrawer popup)
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + quantity,
    }));

    // Auto-slide open the Cart Drawer
    setIsCartOpen(true);

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

  // Update Cart Quantity
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  // Remove Cart Item
  const handleRemoveItem = (productId: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  // Trigger modal detail view
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Load More logic
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, filteredProducts.length));
  };

  return (
    <div className="relative min-h-screen bg-transparent text-gray-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

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
            <div className="rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-16 text-center shadow-sm">
              <Search className="mx-auto h-12 w-12 text-gray-400 dark:text-zinc-650" />
              <h3 className="mt-4 font-sans text-base font-bold text-gray-800 dark:text-zinc-200">No results found</h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
                No products matched &ldquo;{searchQuery}&rdquo;. Try adjusting your keywords or category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-5 rounded-md border border-gray-300 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60 px-5 py-2 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-105 dark:hover:bg-zinc-800"
              >
                Clear all filters
              </button>
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
                    className="rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 px-8 py-3 text-xs font-semibold text-gray-700 dark:text-zinc-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-zinc-850"
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
          <div className="mt-4 flex justify-center gap-6 text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-550 font-mono">
            <a href="#" className="hover:text-gray-600 dark:hover:text-zinc-400">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-655 dark:hover:text-zinc-400">Terms of Service</a>
            <span>•</span>
            <a href="https://fakestoreapi.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-655 dark:hover:text-zinc-400">API Provider</a>
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
          />
        )}
      </AnimatePresence>

      {/* Sliding Cart Drawer overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
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
