import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Financing in Calgary — Get Pre-Approved | Pulse Drive Motors",
  description:
    "Fast, flexible auto financing for used cars in Calgary, Alberta. Get pre-approved in minutes — all credit situations welcome. Apply online at Pulse Drive Motors.",
  alternates: { canonical: "/financing" },
};

export default function FinancingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
