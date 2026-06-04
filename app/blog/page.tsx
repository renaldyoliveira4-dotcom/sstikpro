import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts, CATEGORIES } from '@/lib/blog-data'
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react'
import AdBanner from '@/components/ads/AdBanner'

export const metadata: Metadata = {
  title: 'Blog - TikTok Tips, Tutorials & Social Media Guides',
  description: 'Read the latest articles about TikTok, Instagram, YouTube Shorts, and social media strategies. Expert tips, tutorials, and guides.',
  alternates: { canonical: 'https://sstikpro.com/blog' },
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const categoryFilter = undefined // Will be dynamic in full implementation
  const posts = blogPosts

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Hero */}
      <div className="py-12 md:py-16" style={{ background: 'linear-gradient(135deg, #4F6D7A 0%, #89A5B1 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            SSTikPro Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Tips, Tutorials & Guides
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Expert articles on TikTok, Instagram, YouTube Shorts and social media strategies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Ad top */}
        <AdBanner placement="Blog Top Banner" size="sm" className="mb-8" />

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors text-white"
            style={{ background: '#4F6D7A' }}
          >
            All Posts
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-slate-200"
              style={{ background: '#E2E8F0', color: '#64748B' }}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition-all group"
              style={{ borderColor: '#E2E8F0' }}
            >
              {/* Cover */}
              <div className="h-44 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F6D7A20, #89A5B120)' }}>
                <span className="text-5xl">
                  {post.category === 'TikTok' ? '🎵' :
                   post.category === 'Instagram' ? '📸' :
                   post.category === 'YouTube Shorts' ? '▶️' :
                   post.category === 'Tutorials' ? '📖' : '📱'}
                </span>
              </div>

              <div className="p-5">
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{ background: '#4F6D7A15', color: '#4F6D7A' }}
                >
                  {post.category}
                </span>
                <h2 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-[#4F6D7A] transition-colors" style={{ color: '#1E293B' }}>
                  {post.title}
                </h2>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: '#64748B' }}>
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#94A3B8' }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.read_time} min read
                    </span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
                    style={{ color: '#4F6D7A' }}
                  >
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Ad bottom */}
        <AdBanner placement="Blog Bottom Banner" size="md" className="mt-10" />
      </div>
    </div>
  )
}
