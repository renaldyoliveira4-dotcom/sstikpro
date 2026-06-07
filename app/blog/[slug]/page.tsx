import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getRecentPosts, blogPosts } from '@/lib/blog-data'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import AdBanner from '@/components/ads/AdBanner'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://sstikpro.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      url: `https://sstikpro.com/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const relatedPosts = getRecentPosts(3).filter(p => p.slug !== post.slug).slice(0, 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.created_at,
    author: { '@type': 'Organization', name: 'SSTikPro' },
    publisher: { '@type': 'Organization', name: 'SSTikPro', url: 'https://sstikpro.com.br' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
        {/* Breadcrumb */}
        <div className="border-b" style={{ borderColor: '#E2E8F0', background: '#fff' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
              <Link href="/" className="hover:text-[#4F6D7A] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-[#4F6D7A] transition-colors">Blog</Link>
              <span>/</span>
              <span className="truncate max-w-xs" style={{ color: '#1E293B' }}>{post.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex gap-8">
            {/* Main content */}
            <article className="flex-1 min-w-0">
              {/* Ad top */}
              <AdBanner placement="Article Top Banner" size="sm" className="mb-8" />

              <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-10" style={{ borderColor: '#E2E8F0' }}>
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: '#4F6D7A15', color: '#4F6D7A' }}
                  >
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
                    <Calendar className="w-3 h-3" />
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
                    <Clock className="w-3 h-3" />
                    {post.read_time} min read
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 leading-tight" style={{ color: '#1E293B' }}>
                  {post.title}
                </h1>

                <p className="text-lg mb-8 pb-8 border-b" style={{ color: '#64748B', borderColor: '#E2E8F0' }}>
                  {post.excerpt}
                </p>

                {/* Content */}
                <div
                  className="prose-custom"
                  dangerouslySetInnerHTML={{ __html: post.content
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n/g, '<br/>')
                    .replace(/## (.*)/g, '<h2>$1</h2>')
                    .replace(/### (.*)/g, '<h3>$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- (.*)/g, '<li>$1</li>') }}
                />

                {/* Nav */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
                  <Link
                    href="/blog"
                    className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
                    style={{ color: '#4F6D7A' }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                  </Link>
                </div>
              </div>

              {/* Ad mid */}
              <AdBanner placement="Article Mid Banner" size="md" className="my-8" />

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#1E293B' }}>Related Articles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedPosts.map(related => (
                      <Link
                        key={related.id}
                        href={`/blog/${related.slug}`}
                        className="bg-white rounded-xl p-4 border hover:shadow-md transition-all group"
                        style={{ borderColor: '#E2E8F0' }}
                      >
                        <span className="text-xs font-semibold" style={{ color: '#4F6D7A' }}>{related.category}</span>
                        <h3 className="text-sm font-bold mt-1 group-hover:text-[#4F6D7A] transition-colors line-clamp-2" style={{ color: '#1E293B' }}>
                          {related.title}
                        </h3>
                        <span className="flex items-center gap-1 text-xs mt-2 font-medium" style={{ color: '#4F6D7A' }}>
                          Read more <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <AdBanner placement="Sidebar Right — 300×250" size="lg" />
                <AdBanner placement="Sidebar Right — 300×600" size="lg" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
