"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X, ChevronDown } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-lime-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <svg width="160" height="44" viewBox="0 0 320 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* ECG line left */}
                <polyline
                  points="0,44 18,44 26,20 34,68 40,12 46,72 52,44 80,44"
                  fill="none" stroke="#84cc16" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
                {/* ECG line right */}
                <polyline
                  points="240,44 268,44 276,20 284,68 290,12 296,72 302,44 320,44"
                  fill="none" stroke="#84cc16" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
                {/* PULSE text */}
                <text
                  x="160" y="52"
                  textAnchor="middle"
                  fill="#84cc16"
                  fontSize="42"
                  fontWeight="900"
                  fontFamily="Arial, sans-serif"
                  letterSpacing="6"
                >PULSE</text>
                {/* drive motors text */}
                <text
                  x="160" y="72"
                  textAnchor="middle"
                  fill="#84cc16"
                  fontSize="13"
                  fontWeight="400"
                  fontFamily="Arial, sans-serif"
                  letterSpacing="5"
                  opacity="0.85"
                >drive motors</text>
              </svg>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-300 hover:text-lime-400 transition-colors text-sm font-medium">
                  Inventory <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 pt-2 hidden group-hover:block">
                  <div className="w-48 bg-gray-900 border border-lime-500/20 rounded-lg shadow-xl py-2">
                    <Link href="/inventory" className="block px-4 py-2 text-sm text-gray-300 hover:text-lime-400 hover:bg-white/5">All Vehicles</Link>
                    <Link href="/inventory?type=SUV" className="block px-4 py-2 text-sm text-gray-300 hover:text-lime-400 hover:bg-white/5">SUVs & Trucks</Link>
                    <Link href="/inventory?type=Sedan" className="block px-4 py-2 text-sm text-gray-300 hover:text-lime-400 hover:bg-white/5">Sedans</Link>
                    <Link href="/inventory?fuel=Electric" className="block px-4 py-2 text-sm text-gray-300 hover:text-lime-400 hover:bg-white/5">Electric & Hybrid</Link>
                    <Link href="/inventory?price=under30k" className="block px-4 py-2 text-sm text-gray-300 hover:text-lime-400 hover:bg-white/5">Under $30,000</Link>
                    <div className="border-t border-white/10 my-1" />
                    <Link href="/inventory?status=sold" className="block px-4 py-2 text-sm text-gray-400 hover:text-lime-400 hover:bg-white/5">Sold Vehicles</Link>
                  </div>
                </div>
              </div>
              <Link href="/financing" className="text-gray-300 hover:text-lime-400 transition-colors text-sm font-medium">Financing</Link>
              <Link href="/trade-in" className="text-gray-300 hover:text-lime-400 transition-colors text-sm font-medium">Trade-In</Link>
              <Link href="/blog" className="text-gray-300 hover:text-lime-400 transition-colors text-sm font-medium">Blog</Link>
              <Link href="/contact" className="text-gray-300 hover:text-lime-400 transition-colors text-sm font-medium">Contact</Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a href="tel:8257477137" className="flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium">
                <Phone size={16} />
                <span>403-477-3345</span>
              </a>
              <Link
                href="/financing"
                className="bg-lime-500 hover:bg-lime-400 text-black text-sm font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Get Pre-Approved
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-lime-400"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-gray-950 border-t border-lime-500/20">
            <nav className="px-4 py-4 space-y-3">
              <Link href="/inventory" className="block text-gray-300 hover:text-lime-400 py-2 border-b border-white/5" onClick={() => setMobileOpen(false)}>All Inventory</Link>
              <Link href="/financing" className="block text-gray-300 hover:text-lime-400 py-2 border-b border-white/5" onClick={() => setMobileOpen(false)}>Financing</Link>
              <Link href="/trade-in" className="block text-gray-300 hover:text-lime-400 py-2 border-b border-white/5" onClick={() => setMobileOpen(false)}>Trade-In</Link>
              <Link href="/blog" className="block text-gray-300 hover:text-lime-400 py-2 border-b border-white/5" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link href="/contact" className="block text-gray-300 hover:text-lime-400 py-2 border-b border-white/5" onClick={() => setMobileOpen(false)}>Contact</Link>
              <div className="pt-2 space-y-3">
                <a href="tel:8257477137" className="flex items-center gap-2 text-lime-400 font-medium">
                  <Phone size={18} /> 403-477-3345
                </a>
                <Link href="/financing" className="block w-full text-center bg-lime-500 text-black font-bold px-4 py-3 rounded-lg" onClick={() => setMobileOpen(false)}>
                  Get Pre-Approved
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-[60px]" />
    </>
  );
}
