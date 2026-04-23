export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import HomeSearch from "@/components/HomeSearch";
import {
  Shield,
  CreditCard,
  Star,
  ChevronRight,
  Phone,
  Award,
  Zap,
  RefreshCcw,
  CarFront,
} from "lucide-react";
import { REVIEWS } from "@/data/vehicles";
import { prisma } from "@/lib/prisma";
import VehicleCard from "@/components/VehicleCard";

export default async function HomePage() {
  const rawVehicles = await prisma.vehicle.findMany({
    where: { deletedAt: null, status: 'available', NOT: { discountPrice: null } },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
  const featuredVehicles = rawVehicles.map(v => ({
    ...v,
    photos: JSON.parse(v.photos || '[]') as string[],
    features: JSON.parse(v.features || '[]') as string[],
  }));

  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { id: true, title: true, slug: true, excerpt: true, category: true, image: true, createdAt: true, content: true },
  });

  return (
    <div className="bg-black">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden hero-gradient">
        {/* Pulse ECG line decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lime-500 to-transparent opacity-60" />

        {/* Background grid */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(132,204,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(132,204,22,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* ECG pulse line */}
        <div className="absolute top-1/2 left-0 right-0 flex items-center opacity-20 pointer-events-none">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <polyline
              points="0,40 200,40 280,5 320,75 360,10 400,70 440,40 1440,40"
              fill="none"
              stroke="#84cc16"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center py-20">
          {/* Logo Mark */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 bg-lime-500/10 border border-lime-500/30 rounded-full px-6 py-2">
              <svg width="60" height="24" viewBox="0 0 200 60" fill="none">
                <polyline
                  points="0,30 30,30 50,5 65,55 80,10 95,50 110,30 200,30"
                  fill="none" stroke="#84cc16" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <span className="text-lime-400 text-sm font-medium tracking-widest">PULSE DRIVE MOTORS</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">Find Your</span>
            <br />
            <span className="text-lime-400">Perfect Drive</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Alberta&apos;s certified pre-owned vehicle dealer. Transparent pricing, CARFAX reports,
            flexible financing — all in one place.
          </p>

          {/* Search Form */}
          <HomeSearch />

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <CarFront size={18} className="text-lime-500" />
              <span><strong className="text-white">100+</strong> Vehicles In Stock</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield size={18} className="text-lime-500" />
              <span><strong className="text-white">AMVIC</strong> Registered Dealer</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Star size={18} className="text-lime-500" />
              <span><strong className="text-white">4.9★</strong> Customer Rating</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <CreditCard size={18} className="text-lime-500" />
              <span><strong className="text-white">Fast</strong> Financing Approval</span>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* FEATURED INVENTORY */}
      <section className="py-16 px-4 sm:px-6 bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Special Offers</h2>
              <p className="text-gray-400 text-sm">Limited-time deals — prices reduced on select vehicles</p>
            </div>
            <Link
              href="/inventory"
              className="hidden sm:flex items-center gap-1.5 text-lime-400 hover:text-lime-300 font-medium text-sm transition-colors"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 bg-lime-500 text-black font-bold px-6 py-3 rounded-xl"
            >
              View All Inventory <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITIONS */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Shield size={28} className="text-lime-400" />,
                title: "Certified Pre-Owned",
                desc: "Every vehicle passes our rigorous 150-point inspection.",
              },
              {
                icon: <Award size={28} className="text-lime-400" />,
                title: "CARFAX Reports",
                desc: "Full vehicle history on every listing. No surprises.",
              },
              {
                icon: <CreditCard size={28} className="text-lime-400" />,
                title: "Flexible Financing",
                desc: "Get pre-approved in minutes. Multiple lender options.",
              },
              {
                icon: <RefreshCcw size={28} className="text-lime-400" />,
                title: "Trade-In Appraisal",
                desc: "Get top dollar for your current vehicle instantly.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-white/10 rounded-xl p-6 neon-border card-hover text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-lime-500/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES BANNER */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financing CTA */}
            <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-lime-500/20 to-lime-500/5 border border-lime-500/30 rounded-2xl p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <Zap size={36} className="text-lime-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Get Pre-Approved in Minutes</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Our financing team works with multiple Canadian lenders to find you the best rate. Bad credit? No problem — we help everyone drive away.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/financing"
                  className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Apply for Financing
                </Link>
                <Link
                  href="/financing"
                  className="bg-white/10 hover:bg-white/15 text-white font-medium px-6 py-3 rounded-xl transition-colors border border-white/20"
                >
                  Calculate Payments
                </Link>
              </div>
            </div>

            {/* Trade-In CTA */}
            <div className="relative overflow-hidden bg-gray-900 border border-white/10 rounded-2xl p-6 neon-border">
              <RefreshCcw size={32} className="text-lime-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Trade In Your Vehicle</h3>
              <p className="text-gray-400 text-sm mb-5">
                Get an instant estimate for your current vehicle. Use it as a down payment on your next car.
              </p>
              <Link
                href="/trade-in"
                className="flex items-center gap-2 text-lime-400 hover:text-lime-300 font-medium text-sm transition-colors"
              >
                Get My Trade-In Value <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 px-4 sm:px-6 bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-lime-400 fill-lime-400" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">4.9/5 from 200+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-gray-900 border border-white/10 rounded-xl p-5 card-hover">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-lime-400 fill-lime-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">&quot;{review.text}&quot;</p>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-white text-sm font-medium">{review.name}</p>
                  <p className="text-gray-500 text-xs">{review.vehicle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      {blogPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Buying Guides & Tips</h2>
                <p className="text-gray-400 text-sm">Expert advice for Canadian car buyers</p>
              </div>
              <Link
                href="/blog"
                className="hidden sm:flex items-center gap-1.5 text-lime-400 hover:text-lime-300 font-medium text-sm transition-colors"
              >
                All Posts <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden card-hover neon-border">
                    <div className="relative h-48 overflow-hidden bg-gray-800">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 to-transparent" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                      <span className="absolute top-3 left-3 text-xs bg-lime-500/20 text-lime-400 border border-lime-500/30 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-white font-semibold mb-2 group-hover:text-lime-400 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(post.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span>{Math.max(1, Math.round(post.content.split(/\s+/).length / 200))} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 border border-lime-500/20 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(132,204,22,0.4) 0%, transparent 70%)`,
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Find Your Next Vehicle?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Book a test drive today or call us directly. Our team is ready to help you drive away in the perfect vehicle.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-8 py-4 rounded-xl transition-colors text-base glow-pulse"
                >
                  Book a Test Drive
                </Link>
                <a
                  href="tel:8257477137"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-4 rounded-xl transition-colors border border-white/20"
                >
                  <Phone size={20} /> 403-477-3345
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
