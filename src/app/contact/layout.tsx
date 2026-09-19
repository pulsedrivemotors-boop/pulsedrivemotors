import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Used Car Dealer in Calgary, AB | Pulse Drive Motors",
  description:
    "Visit or contact Pulse Drive Motors at 831 48 Ave SE, Calgary, AB. Call, message or book a test drive with your local certified pre-owned vehicle dealer.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
