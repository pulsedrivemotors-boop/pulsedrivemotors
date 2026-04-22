import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import TaxCalculator from "@/components/TaxCalculator";
import FinancingCalculator from "@/components/FinancingCalculator";
import VehicleCard from "@/components/VehicleCard";
import VehicleGallery from "@/components/VehicleGallery";
import {
  Phone,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Gauge,
  Fuel,
  Settings,
  Car,
  Palette,
  Users,
  ChevronLeft,
  Shield,
  Award,
  Check,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const raw = await prisma.vehicle.findFirst({ where: { id, deletedAt: null } });
  if (!raw) return { title: "Vehicle Not Found" };
  const title = `${raw.year} ${raw.make} ${raw.model} ${raw.trim ?? ""}`.trim();
  const photos = JSON.parse(raw.photos || "[]") as string[];
  return {
    title: `${title} | Pulse Drive Motors`,
    description: raw.description || `${title} — $${raw.price.toLocaleString()} CAD. Certified pre-owned at Pulse Drive Motors, Calgary AB.`,
    openGraph: {
      title: `${title} — $${raw.price.toLocaleString()} CAD`,
      description: raw.description || `Certified pre-owned ${title} available at Pulse Drive Motors in Calgary, Alberta.`,
      images: photos[0] ? [{ url: photos[0] }] : [],
    },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params;

  const raw = await prisma.vehicle.findFirst({ where: { id, deletedAt: null } });
  if (!raw) notFound();

  const vehicle = {
    ...raw,
    photos: JSON.parse(raw.photos || '[]') as string[],
    features: JSON.parse(raw.features || '[]') as string[],
    discountPrice: raw.discountPrice ?? null,
    carfaxUrl: raw.carfaxUrl ?? '',
  };

  const similarRaw = await prisma.vehicle.findMany({
    where: {
      id: { not: id },
      deletedAt: null,
      status: 'available',
      OR: [{ make: vehicle.make }, { bodyType: vehicle.bodyType }],
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const similar = similarRaw.map(v => ({
    ...v,
    photos: JSON.parse(v.photos || '[]') as string[],
    features: JSON.parse(v.features || '[]') as string[],
  }));

  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`.trim(),
    "brand": { "@type": "Brand", "name": vehicle.make },
    "model": vehicle.model,
    "vehicleModelDate": String(vehicle.year),
    "bodyType": vehicle.bodyType,
    "driveWheelConfiguration": vehicle.drivetrain,
    "fuelType": vehicle.fuelType,
    "vehicleTransmission": vehicle.transmission,
    "color": vehicle.color,
    "numberOfDoors": vehicle.doors,
    "seatingCapacity": vehicle.seats,
    "vehicleIdentificationNumber": vehicle.vin,
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": vehicle.odometer,
      "unitCode": "KMT",
    },
    "description": vehicle.description,
    "image": vehicle.photos[0] ?? undefined,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "CAD",
      "price": vehicle.discountPrice ?? vehicle.price,
      "availability": vehicle.status === "available"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      "seller": {
        "@type": "AutoDealer",
        "name": "Pulse Drive Motors",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "831 48 Ave SE",
          "addressLocality": "Calgary",
          "addressRegion": "AB",
          "addressCountry": "CA",
        },
      },
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
    />
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-gray-950 border-b border-white/5 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-lime-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/inventory" className="hover:text-lime-400 transition-colors">Inventory</Link>
          <span>/</span>
          <span className="text-gray-300">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <Link href="/inventory" className="inline-flex items-center gap-2 text-gray-400 hover:text-lime-400 transition-colors text-sm mb-6">
          <ChevronLeft size={16} /> Back to Inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <VehicleGallery
              photos={vehicle.photos}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              status={vehicle.status}
            />

            {/* Title + Price (mobile) */}
            <div className="lg:hidden">
              <h1 className="text-2xl font-bold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
              <p className="text-gray-400">{vehicle.trim}</p>
              {vehicle.discountPrice ? (
                <div className="flex items-baseline gap-3 mt-2">
                  <p className="text-3xl font-bold text-red-400">${vehicle.discountPrice.toLocaleString()}</p>
                  <p className="text-xl text-gray-500 line-through">${vehicle.price.toLocaleString()}</p>
                  <span className="text-sm font-bold bg-red-500 text-white px-2 py-0.5 rounded">
                    -{Math.round((1 - vehicle.discountPrice / vehicle.price) * 100)}%
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-lime-400 mt-2">${vehicle.price.toLocaleString()}</p>
              )}
            </div>

            {/* Key Specs Grid */}
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-4">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Gauge size={18} className="text-lime-500" />, label: "Mileage", value: `${vehicle.odometer.toLocaleString()} km` },
                  { icon: <Fuel size={18} className="text-lime-500" />, label: "Fuel Type", value: vehicle.fuelType },
                  { icon: <Settings size={18} className="text-lime-500" />, label: "Drivetrain", value: vehicle.drivetrain },
                  { icon: <Car size={18} className="text-lime-500" />, label: "Transmission", value: vehicle.transmission },
                  { icon: <Palette size={18} className="text-lime-500" />, label: "Exterior Color", value: vehicle.color },
                  { icon: <Users size={18} className="text-lime-500" />, label: "Seating", value: `${vehicle.seats} passengers` },
                ].map((spec) => (
                  <div key={spec.label} className="bg-black/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">{spec.icon}<span className="text-gray-400 text-xs">{spec.label}</span></div>
                    <p className="text-white text-sm font-medium">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Engine */}
              <div className="mt-4 p-3 bg-lime-500/5 border border-lime-500/20 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Engine</p>
                <p className="text-white font-medium">{vehicle.engine}</p>
              </div>

              {/* VIN */}
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="text-gray-400">VIN:</span>
                <code className="text-lime-400 font-mono">{vehicle.vin}</code>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-4">Features & Options</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {vehicle.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-lime-500 flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">About This Vehicle</h2>
              <p className="text-gray-400 leading-relaxed">{vehicle.description}</p>

              {/* Trust Badges */}
              <div className="mt-4 flex flex-wrap gap-3">
                {vehicle.carfaxUrl ? (
                  <a
                    href={vehicle.carfaxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/50 rounded-lg px-3 py-2 transition-colors group"
                  >
                    <Shield size={16} className="text-blue-400" />
                    <span className="text-blue-300 text-xs font-medium group-hover:text-blue-200">View CARFAX Report</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" className="text-blue-400 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 9L9 1M9 1H3M9 1V7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
                    <Shield size={16} className="text-blue-400" />
                    <span className="text-blue-300 text-xs font-medium">CARFAX Report Available</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-lime-500/10 border border-lime-500/20 rounded-lg px-3 py-2">
                  <Award size={16} className="text-lime-400" />
                  <span className="text-lime-300 text-xs font-medium">Certified Pre-Owned</span>
                </div>
              </div>
            </div>

            {/* Financing Calculator */}
            <FinancingCalculator vehiclePrice={vehicle.discountPrice ?? vehicle.price} />

            {/* Tax Calculator */}
            <TaxCalculator basePrice={vehicle.discountPrice ?? vehicle.price} />
          </div>

          {/* Right: CTAs Sidebar */}
          <div className="space-y-4">
            {/* Price Box */}
            <div className="hidden lg:block bg-gray-900 border border-lime-500/20 rounded-xl p-6">
              <h1 className="text-xl font-bold text-white mb-1">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
              <p className="text-gray-400 text-sm mb-4">{vehicle.trim}</p>
              <div className="border-t border-white/10 pt-4">
                <p className="text-gray-400 text-sm">Starting from</p>
                {vehicle.discountPrice ? (
                  <>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-bold text-red-400">${vehicle.discountPrice.toLocaleString()}</p>
                      <span className="text-sm font-bold bg-red-500 text-white px-2 py-0.5 rounded">
                        -{Math.round((1 - vehicle.discountPrice / vehicle.price) * 100)}%
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-through mt-0.5">${vehicle.price.toLocaleString()}</p>
                  </>
                ) : (
                  <p className="text-4xl font-bold text-lime-400">${vehicle.price.toLocaleString()}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">+ applicable provincial taxes</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="bg-gray-900 border border-white/10 rounded-xl p-5 space-y-3 sticky top-20">
              <a
                href="tel:8257477137"
                className="w-full flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3.5 rounded-xl transition-colors"
              >
                <Phone size={18} /> Call Now
              </a>
              <Link
                href={`/contact?type=testdrive&vehicle=${encodeURIComponent(`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`.trim())}`}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium py-3 rounded-xl transition-colors border border-white/20"
              >
                <CalendarCheck size={18} /> Book Test Drive
              </Link>
              <Link
                href="/financing"
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium py-3 rounded-xl transition-colors border border-white/20"
              >
                <CreditCard size={18} /> Apply for Financing
              </Link>
              <Link
                href={`/contact?type=message&vehicle=${encodeURIComponent(`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`.trim())}`}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium py-3 rounded-xl transition-colors border border-white/20"
              >
                <MessageSquare size={18} /> Send a Message
              </Link>

              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Shield size={14} className="text-lime-500" />
                  <span>AMVIC Licensed Dealer</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gray-900 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3">Contact Dealer</h3>
              <div className="space-y-2 text-sm">
                <a href="tel:8257477137" className="flex items-center gap-2 text-gray-300 hover:text-lime-400 transition-colors">
                  <Phone size={14} className="text-lime-500" /> 403-477-3345
                </a>
                <a href="tel:8259625333" className="flex items-center gap-2 text-gray-300 hover:text-lime-400 transition-colors">
                  <Phone size={14} className="text-lime-500" /> 403-466-1136
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Vehicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
