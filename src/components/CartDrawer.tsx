"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Product } from "@/types";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  onFormatPrice = (price: number) => `$${price.toFixed(2)}`, // Keep helper clean
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps & { onFormatPrice?: (price: number) => string }) {
  if (!isOpen) return null;

  // Compute Subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/40 dark:bg-zinc-950/60 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="w-screen max-w-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 shadow-2xl flex flex-col h-full border-l border-gray-100 dark:border-zinc-800/80"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gray-900 dark:text-zinc-100" />
              <h2 className="text-lg font-sans font-bold text-gray-955 dark:text-zinc-50">
                Your Bag
              </h2>
              <span className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-350 text-xs font-semibold px-2 py-0.5 rounded-md">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-650 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingBag className="h-16 w-16 text-gray-200 dark:text-zinc-800 stroke-[1.5]" />
                <h3 className="mt-4 font-sans text-lg font-semibold text-gray-800 dark:text-zinc-200">
                  Your bag is empty
                </h3>
                <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500 max-w-xs">
                  Browse our curated collections and add items to your shopping bag.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-white px-6 py-2.5 text-xs font-bold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800/50 last:border-0 last:pb-0"
                >
                  {/* Image container */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60 p-2 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">
                      {item.product.title}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-mono">
                      {item.product.category === "jewelery" ? "Jewelry" : item.product.category}
                    </span>
                    
                    <div className="mt-1 font-sans text-sm font-semibold text-gray-900 dark:text-zinc-100">
                      {onFormatPrice(item.product.price)}
                    </div>

                    {/* Quantity controls & Delete */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 dark:border-zinc-800 rounded-md bg-gray-50 dark:bg-zinc-900/60 px-2.5 py-1">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="text-gray-400 dark:text-zinc-550 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200 w-8 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="text-gray-400 dark:text-zinc-550 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 dark:text-zinc-500 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="px-6 py-6 border-t border-gray-100 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-950/20">
              <div className="space-y-1.5 mb-6">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase text-xs tracking-wider">
                    Free
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-gray-900 dark:text-zinc-100 border-t border-gray-250/60 dark:border-zinc-800/50 pt-3">
                  <span className="font-sans">Subtotal</span>
                  <span className="font-sans text-lg font-semibold text-gray-900 dark:text-zinc-100">
                    {onFormatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert("Proceeding to dummy checkout...")}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 py-3 text-sm font-semibold text-white transition-all duration-300"
              >
                Checkout Now
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
