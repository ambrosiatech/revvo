"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm border-b border-gray-100"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group" aria-label="Revvo home">
          <span className="text-3xl font-extrabold tracking-tight" style={{ color: "#1a3a5c" }}>
            Revvo
          </span>
          <span className="text-3xl" aria-hidden="true">⭐</span>
        </a>

        {/* Nav actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://review-pilot-app.vercel.app/login"
            className="text-sm font-medium text-gray-600 hover:text-[#1a3a5c] transition-colors"
          >
            Log in
          </a>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm"
            style={{ backgroundColor: "#f97316" }}
          >
            Start Free Trial
          </a>
        </div>
      </div>
    </header>
  );
}
