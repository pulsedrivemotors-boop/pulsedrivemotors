"use client";

import Link from "next/link";
import { Phone, CreditCard, CalendarCheck } from "lucide-react";

export default function StickyCTA() {
  return (
    <div className="sticky-cta bg-black/95 backdrop-blur-sm border-t border-lime-500/30 py-3 px-4 md:hidden">
      <div className="flex gap-2 max-w-sm mx-auto">
        <a
          href="tel:8257477137"
          className="flex-1 flex items-center justify-center gap-1.5 bg-lime-500 text-black font-bold text-sm py-2.5 rounded-lg"
        >
          <Phone size={16} /> Call Now
        </a>
        <Link
          href="/financing"
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 text-white text-sm py-2.5 rounded-lg border border-white/20"
        >
          <CreditCard size={16} /> Finance
        </Link>
        <Link
          href="/contact"
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 text-white text-sm py-2.5 rounded-lg border border-white/20"
        >
          <CalendarCheck size={16} /> Test Drive
        </Link>
      </div>
    </div>
  );
}
