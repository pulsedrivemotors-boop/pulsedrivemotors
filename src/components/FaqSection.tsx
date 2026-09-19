"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqSection({
  title = "Frequently Asked Questions",
  items,
}: {
  title?: string;
  items: FaqItem[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="bg-gray-950 border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60"
              >
                <span className="text-white font-medium">{it.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-none text-lime-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {/* Kept in the DOM (hidden, not unmounted) so the full answer is in the HTML for search engines */}
              <div className={`px-5 pb-4 text-gray-400 text-sm leading-relaxed ${isOpen ? "" : "hidden"}`}>
                {it.a}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
