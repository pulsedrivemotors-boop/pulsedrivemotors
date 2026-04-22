import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookOpen, Clock, ChevronRight, PenSquare } from "lucide-react";

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

function readTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category))).sort()];
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-950 to-black border-b border-white/5 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-lime-500/10 border border-lime-500/30 rounded-full px-4 py-1.5 mb-6">
            <BookOpen size={16} className="text-lime-400" />
            <span className="text-lime-400 text-sm font-medium">Expert Advice for Canadian Car Buyers</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Buying Guides & <span className="text-lime-400">Auto Tips</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Stay informed with our expert articles on financing, trade-ins, vehicle comparisons, and Canadian auto market news.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-lime-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenSquare size={28} className="text-lime-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No posts yet</h2>
            <p className="text-gray-400 text-sm">Articles will appear here once published from the admin panel.</p>
          </div>
        )}

        {/* Categories */}
        {posts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`text-sm px-4 py-1.5 rounded-full border ${
                  cat === "All"
                    ? "bg-lime-500 border-lime-500 text-black font-bold"
                    : "border-white/20 text-gray-400"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Featured Post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-10">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-900">
              {featured.image ? (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 to-transparent" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-xs bg-lime-500/20 text-lime-400 border border-lime-500/30 px-3 py-1 rounded-full mb-3 inline-block">
                  {featured.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-lime-400 transition-colors">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-gray-300 text-sm max-w-2xl mb-3">{featured.excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {readTime(featured.content)}
                  </span>
                  <span>{timeAgo(new Date(featured.createdAt))}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden card-hover neon-border h-full flex flex-col">
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
                      <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 to-transparent flex items-center justify-center">
                        <BookOpen size={40} className="text-lime-500/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <span className="absolute top-3 left-3 text-xs bg-lime-500/20 text-lime-400 border border-lime-500/30 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-white font-semibold mb-2 group-hover:text-lime-400 transition-colors leading-snug flex-1">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/10 pt-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {readTime(post.content)}
                      </span>
                      <span className="flex items-center gap-1 text-lime-400">
                        Read more <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
