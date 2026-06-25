"use client";

import React from "react";
import { CreditCard, ShieldCheck } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
  onFormatPrice?: (price: number) => string;
}

export default function CartSummary({
  subtotal,
  onCheckout,
  onFormatPrice = (price: number) => `$${price.toFixed(2)}`,
}: CartSummaryProps) {
  const taxRate = 0.08; // 8% Tax
  const tax = subtotal * taxRate;
  
  // Free shipping above $100
  const shippingThreshold = 100;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 15;
  
  const total = subtotal + tax + shippingCost;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800/80 rounded-md p-6 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-gray-950 dark:text-zinc-50 tracking-tight">
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
          <div className="text-[10px] text-gray-400 dark:text-zinc-500 leading-normal">
            * Add <span className="font-semibold text-gray-700 dark:text-zinc-300">{onFormatPrice(shippingThreshold - subtotal)}</span> more to qualify for Free Shipping!
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between text-sm font-bold text-gray-950 dark:text-zinc-50 border-t border-gray-200/50 dark:border-zinc-800/50 pt-4">
          <span>Total</span>
          <span className="text-base">
            {onFormatPrice(total)}
          </span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        onClick={onCheckout}
        disabled={subtotal === 0}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 py-3 text-xs font-semibold text-white transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CreditCard className="h-4 w-4" />
        <span>Proceed to Checkout</span>
      </button>

      {/* Safety Badge */}
      <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-gray-400 dark:text-zinc-500">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Secure Checkout Powered by stripe</span>
      </div>
    </div>
  );
}
