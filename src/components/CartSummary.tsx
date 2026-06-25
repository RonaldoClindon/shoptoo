"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, ShieldCheck, ExternalLink, Loader2, Smartphone, X, CreditCard, Wallet, ShoppingBag, Star, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface CartSummaryProps {
  subtotal: number;
  onFormatPrice?: (price: number) => string;
}

export default function CartSummary({
  subtotal,
  onFormatPrice = (price: number) => `$${price.toFixed(2)}`,
}: CartSummaryProps) {
  const { clearCart } = useApp();
  const searchParams = useSearchParams();
  const checkoutParam = searchParams.get("checkout");

  const [isLoading, setIsLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(checkoutParam === "true");

  // Sync checkout modal visibility with URL search parameters
  useEffect(() => {
    if (checkoutParam === "true") {
      setShowCheckoutModal(true);
    }
  }, [checkoutParam]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Tabs: card | uae | gpay
  const [activeTab, setActiveTab] = useState<"card" | "uae" | "gpay">("card");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardError, setCardError] = useState("");

  // UAE wallet selection
  const [selectedUaeWallet, setSelectedUaeWallet] = useState<"e& money" | "payit" | "botim" | "careem">("e& money");

  const usdToInr = 83.5; 
  const usdToAed = 3.67; // UAE Exchange Rate
  
  const taxRate = 0.08; // 8% Tax
  const tax = subtotal * taxRate;
  
  // Free shipping above $100
  const shippingThreshold = 100;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 15;
  
  const total = subtotal + tax + shippingCost;
  const totalInInr = total * usdToInr;
  const totalInAed = total * usdToAed;

  // UAE Wallet Intent Pay Link
  const uaePayLink = `payit://pay?pa=8870947891@okaxis&pn=PREMIUM%20SHOP&tn=UAE%20Purchase&am=${totalInAed.toFixed(2)}&cu=AED&wallet=${encodeURIComponent(selectedUaeWallet)}`;
  const uaeQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(uaePayLink)}`;

  // Google Pay India link
  const upiLink = `upi://pay?pa=8870947891@okaxis&pn=PREMIUM%20SHOP&tn=Order%20Purchase&am=${totalInInr.toFixed(2)}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setCardExpiry(formatted.substring(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCardCvv(value.substring(0, 3));
  };

  const handleCardPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError("");

    const digitsOnly = cardNumber.replace(/\s/g, "");
    if (digitsOnly.length !== 16) {
      setCardError("Card number must be 16 digits.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setCardError("Expiry date must be in MM/YY format.");
      return;
    }
    if (cardCvv.length !== 3) {
      setCardError("CVV must be 3 digits.");
      return;
    }
    if (!cardName.trim()) {
      setCardError("Cardholder name is required.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
      clearCart();
    }, 2000);
  };

  const handleGooglePayClick = () => {
    if (subtotal === 0) return;
    
    // Open checkout modal, defaulting tab to card
    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
      clearCart(); // Clear cart state on successful purchase
    }, 1800);
  };

  const receiptMethod = () => {
    if (activeTab === "card") return "Credit/Debit Card";
    if (activeTab === "uae") return `UAE Wallet (${selectedUaeWallet.charAt(0).toUpperCase() + selectedUaeWallet.slice(1)})`;
    return "Google Pay (India)";
  };

  const receiptPaidAmount = () => {
    if (activeTab === "card" || activeTab === "uae") {
      return `AED ${totalInAed.toLocaleString('en-AE', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
    }
    return `₹${totalInInr.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800/80 rounded-md p-6 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-gray-955 dark:text-white tracking-tight">
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
        <div className="flex items-center justify-between text-sm font-bold text-gray-955 dark:text-white border-t border-gray-250/50 dark:border-zinc-800/50 pt-4">
          <span>Total</span>
          <span className="text-base">
            {onFormatPrice(total)}
          </span>
        </div>
      </div>

      {/* Prominent Checkout Trigger Button */}
      <div className="space-y-3">
        <button
          onClick={handleGooglePayClick}
          disabled={subtotal === 0}
          className="w-full h-12 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed select-none font-bold text-sm"
          title="Proceed to Secure Payment"
        >
          <div className="flex items-center justify-center gap-2">
            <span>🔒</span>
            <span className="font-bold text-sm tracking-tight font-sans">Secure Checkout</span>
          </div>
        </button>
      </div>

      {/* Safety Badge */}
      <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-gray-400 dark:text-zinc-500">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Verified multi-channel secure checkout</span>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <>
          {/* Full-screen backdrop (covers entire screen including navbar) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutModal(false)}
              className="fixed inset-0 z-54 bg-gray-950/60 backdrop-blur-sm"
            />

            {/* Content positioner: starts below navbar with breathing room */}
            <div className="fixed top-[76px] left-0 right-0 bottom-0 z-55 flex items-start justify-center px-3 pt-3 pb-4 overflow-y-auto pointer-events-none">
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative pointer-events-auto w-full max-w-lg rounded-2xl border border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xl space-y-4 mb-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                    🔒 Premium Secure Payment
                  </h3>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Segmented Tab Controllers */}
              <div className="flex border-b border-gray-100 dark:border-zinc-800 pb-2 gap-1 text-[11px] font-semibold text-gray-400 dark:text-zinc-500">
                <button
                  onClick={() => setActiveTab("card")}
                  className={`flex-1 pb-1.5 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "card"
                      ? "border-black dark:border-white text-black dark:text-white"
                      : "border-transparent hover:text-gray-600 dark:hover:text-zinc-200"
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setActiveTab("uae")}
                  className={`flex-1 pb-1.5 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "uae"
                      ? "border-black dark:border-white text-black dark:text-white"
                      : "border-transparent hover:text-gray-600 dark:hover:text-zinc-200"
                  }`}
                >
                  <Wallet className="h-3.5 w-3.5" />
                  <span>🇦🇪 UAE Apps</span>
                </button>
                <button
                  onClick={() => setActiveTab("gpay")}
                  className={`flex-1 pb-1.5 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "gpay"
                      ? "border-black dark:border-white text-black dark:text-white"
                      : "border-transparent hover:text-gray-600 dark:hover:text-zinc-200"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>🇮🇳 GPay / UPI</span>
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="py-2">
                
                {/* 1. Credit Card Tab */}
                {activeTab === "card" && (
                  <form onSubmit={handleCardPaymentSubmit} className="space-y-4">
                    {/* Mock Card graphic */}
                    <div className="relative h-28 w-full bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-zinc-900 dark:to-black rounded-md p-4 text-white shadow-md flex flex-col justify-between overflow-hidden">
                      <div className="absolute top-0 right-0 h-28 w-28 bg-white/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] tracking-wider uppercase opacity-50 font-mono">Premium checkout card</span>
                        <CreditCard className="h-4.5 w-4.5 opacity-60" />
                      </div>
                      <div className="text-sm font-mono tracking-widest text-center py-1">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="flex justify-between items-end text-[8px] font-mono">
                        <div>
                          <span className="block opacity-30 uppercase text-[6px]">Holder</span>
                          <span className="truncate max-w-[150px] block font-bold">{cardName.toUpperCase() || "YOUR NAME"}</span>
                        </div>
                        <div>
                          <span className="block opacity-30 uppercase text-[6px]">Expiry</span>
                          <span className="font-bold">{cardExpiry || "MM/YY"}</span>
                        </div>
                      </div>
                    </div>

                    {cardError && (
                      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 rounded p-2.5 text-[10px] text-red-650 dark:text-red-400 font-medium">
                        {cardError}
                      </div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-3">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-550 font-mono">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Smith"
                          className="block w-full rounded border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30 py-2 px-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none"
                          required
                        />
                      </div>
                      {/* Number */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-550 font-mono">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4111 2222 3333 4444"
                          className="block w-full rounded border border-gray-200 dark:border-zinc-800 bg-gray-5/50 dark:bg-zinc-950/30 py-2 px-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none font-mono"
                          required
                        />
                      </div>
                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-550 font-mono">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="block w-full rounded border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30 py-2 px-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none font-mono"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-550 font-mono">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            placeholder="•••"
                            className="block w-full rounded border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30 py-2 px-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span>Pay AED {totalInAed.toFixed(2)}</span>
                      )}
                    </button>
                  </form>
                )}

                {/* 2. UAE Wallets Tab */}
                {activeTab === "uae" && (
                  <div className="space-y-4">
                    <div className="text-center bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-850 p-3 rounded-md">
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium block">Total Payable in AED</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white font-sans tracking-tight">
                        AED {totalInAed.toLocaleString('en-AE', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* UAE wallets chooser */}
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { id: "e& money", emoji: "📱" },
                        { id: "payit", emoji: "💳" },
                        { id: "botim", emoji: "💬" },
                        { id: "careem", emoji: "🚗" },
                      ] as const).map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => setSelectedUaeWallet(wallet.id)}
                          className={`h-12 rounded-xl border-2 px-3 text-xs font-bold transition-all flex items-center gap-2 ${
                            selectedUaeWallet === wallet.id
                              ? "bg-slate-800 border-slate-800 text-white dark:bg-zinc-200 dark:border-zinc-200 dark:text-zinc-900 shadow-md"
                              : "border-slate-200 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                          }`}
                        >
                          <span className="text-base">{wallet.emoji}</span>
                          <span className="capitalize">{wallet.id}</span>
                        </button>
                      ))}
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center space-y-3 border-t border-gray-100 dark:border-zinc-850 pt-4">
                      <div className="p-3 bg-white rounded-md border border-gray-250 shadow-sm relative">
                        <img
                          src={uaeQrCodeUrl}
                          alt="UAE Wallet QR Code"
                          className="w-40 h-40 select-none"
                          draggable={false}
                        />
                      </div>
                      <p className="text-[10px] text-center text-gray-450 dark:text-zinc-400 max-w-xs leading-normal">
                        Scan this QR code inside your <span className="font-semibold capitalize text-gray-700 dark:text-zinc-200">{selectedUaeWallet}</span> app to pay AED {totalInAed.toFixed(2)}.
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 border-t border-gray-100 dark:border-zinc-850 pt-3">
                      <button
                        onClick={() => {
                          window.location.href = uaePayLink;
                        }}
                        className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-800 dark:text-zinc-200 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors border border-gray-200/80 dark:border-zinc-700"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>Open Wallet App</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </button>

                      <button
                        onClick={handleConfirmPayment}
                        disabled={isLoading}
                        className="flex-1 h-11 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-white text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        <span>I have Paid</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Indian GPay / UPI Tab */}
                {activeTab === "gpay" && (
                  <div className="space-y-4">
                    {/* Amount Info */}
                    <div className="text-center bg-gray-55 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-850 p-3 rounded-md">
                      <span className="text-[10px] text-gray-450 dark:text-zinc-500 font-medium block">Total Payable in INR</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white font-sans tracking-tight">
                        ₹{totalInInr.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* QR Code section */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-white rounded-md border border-gray-250 shadow-sm relative">
                        <img
                          src={qrCodeUrl}
                          alt="UPI QR Code"
                          className="w-40 h-40 select-none"
                          draggable={false}
                        />
                      </div>
                      <p className="text-[10px] text-center text-gray-450 dark:text-zinc-400 max-w-xs leading-normal">
                        Scan QR with Google Pay or any Indian UPI app.
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 border-t border-gray-100 dark:border-zinc-850 pt-3">
                      <button
                        onClick={() => {
                          window.location.href = upiLink;
                        }}
                        className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-800 dark:text-zinc-200 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors border border-gray-200/80 dark:border-zinc-700"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>Open in GPay app</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </button>

                      <button
                        onClick={handleConfirmPayment}
                        disabled={isLoading}
                        className="flex-1 h-11 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-white text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        <span>I have Paid</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
              
              {/* Trust Badge */}
              <div className="text-[9px] text-center text-gray-400 dark:text-zinc-550 border-t border-gray-100 dark:border-zinc-850 pt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>100% Secure SSL encrypted checkout connection</span>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Successful — Thank You Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
          {/* Full-screen backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="fixed inset-0 z-54 bg-gray-950/70 backdrop-blur-md"
            />

            {/* Content positioner: starts below navbar */}
            {/* Content positioner: starts below navbar with breathing room */}
            <div className="fixed top-[76px] left-0 right-0 bottom-0 z-55 flex items-start justify-center px-3 pt-3 pb-4 overflow-y-auto pointer-events-none">
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative pointer-events-auto w-full max-w-md rounded-3xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl my-4 overflow-hidden"
            >
              {/* Top decorative banner */}
              <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 px-6 pt-7 pb-8 text-center overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                {/* Floating celebration row */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-2 mb-3"
                >
                  {["🎉", "🛍️", "✨", "🎊", "💳"].map((emoji, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 400 }}
                      className="text-lg"
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Purchase confirmed badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 350 }}
                  className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider"
                >
                  <CheckCircle className="h-3 w-3" />
                  Purchase Confirmed!
                </motion.div>

                {/* Big checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 350, damping: 20 }}
                  className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40"
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </motion.div>

                {/* Thank you heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-xl font-black text-white tracking-tight"
                >
                  Thanks for Your Purchase! 🙏
                </motion.h2>

                {/* Warm greeting message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-2 space-y-1"
                >
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your order is on its way — we promise <span className="text-emerald-400 font-semibold">premium quality</span> delivered with care.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    We truly appreciate your trust & support. 💙
                  </p>
                </motion.div>
              </div>

              {/* Body content */}
              <div className="px-6 py-5 space-y-4">

                {/* Order receipt card */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50 p-4 space-y-2.5"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">Order Receipt</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Merchant</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">PREMIUM SHOP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Payment Method</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{receiptMethod()}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-zinc-700 pt-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">Amount Paid</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{receiptPaidAmount()}</span>
                  </div>
                </motion.div>

                {/* Star rating prompt */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center gap-2 py-2"
                >
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">How was your experience?</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.55 + s * 0.06, type: "spring" }}
                      >
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400 cursor-pointer hover:scale-125 transition-transform" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3 pt-1"
                >
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      window.location.href = "/";
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white py-3 text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Continue Shopping</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </motion.div>

                {/* Footer note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center text-[10px] text-slate-400 dark:text-zinc-500 pb-1"
                >
                  A confirmation receipt has been sent to your account. 💌
                </motion.p>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
