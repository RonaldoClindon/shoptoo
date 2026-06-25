"use client";

import React from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import CartSummary from "@/components/CartSummary";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useApp();

  // Compute Subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    alert("Proceeding to Stripe secure checkout...");
  };

  return (
    <div className="relative min-h-screen bg-transparent text-gray-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Products</span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold font-sans text-gray-955 dark:text-zinc-50 mb-8 tracking-tight">
          Your Shopping Bag
        </h1>

        {cart.length === 0 ? (
          <div className="rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-16 text-center shadow-sm max-w-xl mx-auto">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-200 dark:text-zinc-800 stroke-[1.5]" />
            <h3 className="mt-4 font-sans text-base font-semibold text-gray-800 dark:text-zinc-200">
              Your bag is empty
            </h3>
            <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
              Browse our handpicked premium collections and add items to your shopping bag.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-white px-6 py-2.5 text-xs font-bold transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* Cart Items Grid (Left 8 columns on desktop) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800/80 rounded-md shadow-sm"
                >
                  {/* Image Frame */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60 p-2 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">
                      {item.product.title}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-550 font-mono">
                      {item.product.category === "jewelery" ? "Jewelry" : item.product.category}
                    </span>
                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">
                      ${item.product.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 dark:border-zinc-800 rounded-md bg-gray-50 dark:bg-zinc-900/60 px-2.5 py-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="text-gray-400 dark:text-zinc-550 hover:text-gray-700 dark:hover:text-zinc-350 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200 w-8 text-center select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="text-gray-400 dark:text-zinc-555 hover:text-gray-750 dark:hover:text-zinc-300 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 dark:text-zinc-500 hover:text-red-500 transition-colors p-2"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Payment Summary Box (Right 4 columns on desktop) */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <CartSummary subtotal={subtotal} onCheckout={handleCheckout} />
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-100 dark:border-zinc-900/80 bg-gray-50 dark:bg-zinc-950/40 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} PREMIUM SHOP. Created as a technical evaluation. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
