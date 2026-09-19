import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/trade-in" },
};

export default function TradeInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
