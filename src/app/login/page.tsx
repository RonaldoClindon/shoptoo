"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const { user, login } = useApp();
  const router = useRouter();

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleLoginSuccess = (email: string) => {
    login(email);
    router.push("/");
  };

  return (
    <div className="relative min-h-screen bg-transparent text-gray-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-zinc-900/80 bg-gray-50/50 dark:bg-zinc-950/40 py-8 text-center">
        <p className="text-xs text-gray-500 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} PREMIUM SHOP. Created as a technical evaluation.
        </p>
      </footer>
    </div>
  );
}
