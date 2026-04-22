import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Clock, ChevronLeft, BookOpen, Tag } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

function readTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Render plain-text content with basic paragraph support
function renderContent(content: string) {
  if (!content.trim()) return null;
  return content.split(/\n{2,}/).map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Heading: line starting with #
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">
          {trimmed.slice(2)}
        </h2>
      );
    }
    // Bullet list block
    if (trimmed.split("\n").every((l) => l.trim().startsWith("- "))) {
      return (
        <ul key={i} className="list-none space-y-2 my-4">
          {trimmed.split("\n").map((line, j) => (
            <li key={j} className="flex items-start gap-2 text-gray-300">
              <span className="w-1.5 h-1.5 bg-lime-500 rounded-full mt-2 flex-shrink-0" />
              {line.trim().slice(2)}
            </li>
          ))}
        </ul>
      );
    }
    // Regular paragraph
    return (
      <p key={i} className="text-gray-300 leading-relaxed">
        {trimmed}
      </p>
    );
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Pulse Drive Motors`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) notFound();

  const related = await prisma.blogPost.findMany({
    where: { published: true, category: post.category, slug: { not: slug } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-gray-950 border-b border-white/5 py-3 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-lime-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-lime-400 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-lime-400 transition-colors text-sm mb-8"
        >
          <ChevronLeft size={16} /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="flex items-center gap-1.5 text-xs bg-lime-500/10 text-lime-400 border border-lime-500/30 px-3 py-1 rounded-full">
              <Tag size={11} /> {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={11} /> {readTime(post.content)}
            </span>
            <span className="text-xs text-gray-500">{formatDate(new Date(post.createdAt))}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-gray-400 text-lg leading-relaxed">{post.excerpt}</p>
          )}
        </header>

        {/* Cover Image */}
        {post.image && (
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 bg-gray-900">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose-custom space-y-5">
          {post.content ? (
            renderContent(post.content)
          ) : (
            <p className="text-gray-500 italic">No content available.</p>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 bg-gradient-to-br from-lime-500/10 to-transparent border border-lime-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to find your next vehicle?</h3>
          <p className="text-gray-400 text-sm mb-5">Browse our certified pre-owned inventory or book a test drive today.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/inventory"
              className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Browse Inventory
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/15 text-white font-medium px-6 py-3 rounded-xl transition-colors border border-white/20 text-sm"
            >
              Book a Test Drive
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-lime-400" /> Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link key={rel.id} href={`/blog/${rel.slug}`} className="group block">
                  <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-lime-500/30 transition-colors">
                    {rel.image && (
                      <div className="relative h-36 bg-gray-800">
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 30vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-xs text-lime-400 mb-1">{rel.category}</p>
                      <h4 className="text-white text-sm font-semibold group-hover:text-lime-400 transition-colors leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
