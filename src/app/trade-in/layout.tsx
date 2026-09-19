import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade In Your Car in Calgary — Free Valuation | Pulse Drive Motors",
  description:
    "Get a fair, no-obligation trade-in value for your vehicle in Calgary, Alberta. Apply your trade toward any used car, SUV or truck at Pulse Drive Motors.",
  alternates: { canonical: "/trade-in" },
};

export default function TradeInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
