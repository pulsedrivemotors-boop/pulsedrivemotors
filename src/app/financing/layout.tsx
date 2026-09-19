import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/financing" },
};

export default function FinancingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
