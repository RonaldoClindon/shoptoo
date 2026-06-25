"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, X } from "lucide-react";

interface LoginFormProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const googleInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate brief API delay
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setError("");
    // If email already filled and valid, use it directly
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess(email);
      }, 1000);
      return;
    }
    // Otherwise open our custom dialog
    setGoogleEmail("");
    setShowGoogleDialog(true);
    setTimeout(() => googleInputRef.current?.focus(), 100);
  };

  const handleGoogleConfirm = () => {
    const trimmed = googleEmail.trim();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) {
      setError("Please enter a valid Google email address.");
      setShowGoogleDialog(false);
      return;
    }
    setShowGoogleDialog(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(trimmed);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/40 dark:border-zinc-800/60 rounded-md p-8 shadow-xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-sans text-gray-900 dark:text-zinc-50 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
          Enter your credentials to access your premium account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 rounded-md p-3 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-500 font-mono">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border border-gray-250 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 py-2.5 pl-10 pr-4 text-xs text-gray-900 dark:text-zinc-100 placeholder-gray-400 outline-none transition-all focus:border-gray-900/40 dark:focus:border-zinc-100/40"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-500 font-mono">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-250 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 py-2.5 pl-10 pr-4 text-xs text-gray-900 dark:text-zinc-100 placeholder-gray-400 outline-none transition-all focus:border-gray-900/40 dark:focus:border-zinc-100/40"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 py-3 text-xs font-semibold text-white transition-colors duration-250 shadow-sm"
        >
          {loading ? (
            <span className="h-4 w-4 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </>
          )}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white/80 dark:bg-zinc-900/80 px-2 text-gray-500 dark:text-zinc-400">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google OAuth Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/60 bg-white dark:bg-zinc-900/40 py-2.5 text-xs font-medium text-gray-700 dark:text-zinc-300 transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
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
        <span>Google Account</span>
      </button>

      {/* Custom Google Email Dialog — replaces browser prompt() */}
      <AnimatePresence>
        {showGoogleDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm"
              onClick={() => setShowGoogleDialog(false)}
            />
            {/* Dialog Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)] ring-1 ring-black/10 dark:ring-white/5 p-6"
            >
              {/* Close */}
              <button
                onClick={() => setShowGoogleDialog(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Google G logo */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-100">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Sign in with Google</p>
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500">Enter your Gmail address</p>
                </div>
              </div>

              {/* Email Input */}
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={googleInputRef}
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGoogleConfirm()}
                  placeholder="yourname@gmail.com"
                  className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 pl-9 pr-4 py-2.5 text-sm text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGoogleDialog(false)}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-zinc-700 py-2.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGoogleConfirm}
                  className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-400/30 hover:shadow-blue-500/40 transition-all"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
