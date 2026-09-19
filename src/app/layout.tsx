import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/ConditionalLayout";

const GA_MEASUREMENT_ID = "G-JG63M4PTN3";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pulsedrivemotors.ca"),
  title: "Used Cars for Sale in Calgary, AB | Pulse Drive Motors",
  description:
    "Calgary's trusted certified pre-owned vehicle dealer, serving all of Alberta. Browse used cars, SUVs and trucks with transparent pricing, CARFAX reports, and flexible financing. AMVIC licensed.",
  keywords: "used cars Calgary, used cars for sale Calgary, certified pre-owned Calgary, car dealer Calgary, used SUV Calgary, used trucks Alberta, auto financing Calgary, trade-in Calgary",
  verification: {
    google: "-4LGrnyigp-p1nfMgi3CCNEqItfFa4QUqdGNiHhEn0s",
  },
  openGraph: {
    title: "Used Cars for Sale in Calgary, AB | Pulse Drive Motors",
    description: "Calgary's certified pre-owned vehicle dealer. Used cars, SUVs and trucks with transparent pricing, CARFAX reports, and flexible financing.",
    type: "website",
    url: "https://pulsedrivemotors.ca",
    siteName: "Pulse Drive Motors",
    locale: "en_CA",
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
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
