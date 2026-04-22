import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulse Drive Motors | Certified Pre-Owned Vehicles in Alberta",
  description:
    "Alberta's trusted certified pre-owned vehicle dealer. Browse our inventory of used cars, SUVs, and trucks. Financing, trade-ins, and car rentals available. AMVIC licensed.",
  keywords: "used cars Alberta, certified pre-owned vehicles, car dealer Alberta, auto financing Canada, trade-in, used SUV, used trucks",
  openGraph: {
    title: "Pulse Drive Motors | Certified Pre-Owned Vehicles in Alberta",
    description: "Browse certified pre-owned vehicles with transparent pricing, CARFAX reports, and flexible financing options.",
    type: "website",
  },
};

const dealerJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "name": "Pulse Drive Motors",
  "description": "Alberta's trusted certified pre-owned vehicle dealer. Financing, trade-ins, and car rentals available. AMVIC licensed.",
  "url": "https://pulsedrivemotors.ca",
  "telephone": "+14034773345",
  "email": "pulsedrivemotors@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "831 48 Ave SE",
    "addressLocality": "Calgary",
    "addressRegion": "AB",
    "postalCode": "T2G 4S4",
    "addressCountry": "CA",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.0102,
    "longitude": -114.0427,
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "19:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "11:00", "closes": "16:00" },
  ],
  "sameAs": [
    "https://www.facebook.com/share/17FE2b1bp4/?mibextid=wwXIfr",
    "https://www.instagram.com/pulsedrivemotors",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dealerJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
