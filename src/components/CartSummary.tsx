"use client";

import React, { useState } from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AnimatePresence, motion } from "framer-motion";

interface CartSummaryProps {
  subtotal: number;
  onFormatPrice?: (price: number) => string;
}

export default function CartSummary({
  subtotal,
  onFormatPrice = (price: number) => `$${price.toFixed(2)}`,
}: CartSummaryProps) {
  const { clearCart } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const taxRate = 0.08; // 8% Tax
  const tax = subtotal * taxRate;
  
  // Free shipping above $100
  const shippingThreshold = 100;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 15;
  
  const total = subtotal + tax + shippingCost;

  const handleGooglePayClick = () => {
    if (subtotal === 0) return;
    setIsLoading(true);

    // Simulate network request delay (2 seconds)
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
      clearCart(); // Clear cart state on successful purchase
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800/80 rounded-md p-6 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-gray-955 dark:text-zinc-50 tracking-tight">
        Order Summary
      </h3>

      <div className="space-y-3 text-xs">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900 dark:text-zinc-200">
            {onFormatPrice(subtotal)}
          </span>
        </div>

        {/* Estimated Tax */}
        <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
          <span>Estimated Tax (8%)</span>
          <span className="font-semibold text-gray-900 dark:text-zinc-200">
            {onFormatPrice(tax)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
          <span>Shipping</span>
          {shippingCost === 0 ? (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider">
              Free
            </span>
          ) : (
            <span className="font-semibold text-gray-900 dark:text-zinc-200">
              {onFormatPrice(shippingCost)}
            </span>
          )}
        </div>

        {subtotal < shippingThreshold && subtotal > 0 && (
          <div className="text-[10px] text-gray-450 dark:text-zinc-550 leading-normal">
            * Add <span className="font-semibold text-gray-700 dark:text-zinc-350">{onFormatPrice(shippingThreshold - subtotal)}</span> more to qualify for Free Shipping!
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between text-sm font-bold text-gray-955 dark:text-zinc-50 border-t border-gray-250/50 dark:border-zinc-800/50 pt-4">
          <span>Total</span>
          <span className="text-base">
            {onFormatPrice(total)}
          </span>
        </div>
      </div>

      {/* Prominent Mock Google Pay Button */}
      <div className="space-y-3">
        <button
          onClick={handleGooglePayClick}
          disabled={isLoading || subtotal === 0}
          className="w-full h-11 bg-black hover:bg-zinc-900 text-white rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed select-none"
          title="Buy with Google Pay"
        >
          {isLoading ? (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex items-center justify-center">
              {/* Google Brand G */}
              <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              {/* Pay text */}
              <span className="font-semibold text-sm tracking-tight font-sans">Pay</span>
            </div>
          )}
        </button>
      </div>

      {/* Safety Badge */}
      <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-gray-400 dark:text-zinc-500">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Verified Google Pay checkout</span>
      </div>

      {/* Payment Successful Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative z-10 w-full max-w-sm rounded-md border border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                <CheckCircle className="h-8 w-8" />
              </div>

              <h3 className="mt-5 font-sans text-base font-bold text-gray-900 dark:text-zinc-50 tracking-tight">
                Payment Successful
              </h3>
              
              <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-zinc-400">
                Thank you for your premium purchase! Your payment was processed successfully via Google Pay.
              </p>

              <div className="mt-5 p-3 rounded-md bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-850 text-left">
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-zinc-550 font-mono">
                  <span>Merchant</span>
                  <span className="font-semibold text-gray-700 dark:text-zinc-350">PREMIUM SHOP</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-zinc-550 font-mono mt-1">
                  <span>Amount Paid</span>
                  <span className="font-semibold text-gray-700 dark:text-zinc-350">{onFormatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  window.location.href = "/"; // Go back to products
                }}
                className="mt-6 w-full rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
