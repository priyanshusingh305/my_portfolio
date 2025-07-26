// app/blog/category/[category]/tags/[tags]/slug/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Clock, Eye, User, Tag, ArrowLeft, Share } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Types (same as listing page)
interface StrapiImage {
  id: number
  name: string
  alternativeText?: string
  caption?: string
  width: number
  height: number
  formats?: {
    thumbnail?: { url: string, width: number, height: number }
    small?: { url: string, width: number, height: number }
    medium?: { url: string, width: number, height: number }
    large?: { url: string, width: number, height: number }
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl?: string
  provider: string
  provider_metadata?: any
  createdAt: string
  updatedAt: string
  documentId: string
  publishedAt: string
}

interface BlogPost {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string
  content: string
  meta_title?: string
  meta_description?: string
  reading_time?: number
  featured: boolean
  views: number
  publishedAt: string
  updatedAt: string
  createdAt: string
  featured_image?: StrapiImage | null
  tags?: Array<{
    id: number
    documentId: string
    name: string
    slug: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }>
  category?: {
    id: number
    documentId: string
    name: string
    slug: string
    description?: string
    color?: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
  author?: {
    id: number
    documentId: string
    name: string
    email?: string
    bio?: string
    social_links?: any
    createdAt: string
    updatedAt: string
    publishedAt: string
    avatar?: StrapiImage
  }
}

// Fetch single blog post by slug
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate[featured_image]': 'true',
      'populate[tags]': 'true',
      'populate[category]': 'true',
      'populate[author][populate]': 'avatar',
    })

    const res = await fetch(`${process.env.STRAPI_URL}/api/blog-posts?${params}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      console.error('Failed to fetch blog post:', res.status, res.statusText)
      return null
    }

    const data = await res.json()
    const posts = data.data || []
    
    if (posts.length === 0) {
      return null
    }

    // Increment view count
    const post = posts[0]
    try {
      await fetch(`${process.env.STRAPI_URL}/api/blog-posts/${post.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            views: post.views + 1
          }
        })
      })
    } catch (error) {
      console.error('Failed to increment view count:', error)
    }

    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Get related posts
async function getRelatedPosts(categorySlug: string, currentPostId: number): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams({
      'filters[category][slug][$eq]': categorySlug,
      'filters[id][$ne]': currentPostId.toString(),
      'pagination[pageSize]': '3',
      'populate[featured_image]': 'true',
      'populate[category]': 'true',
      'populate[author]': 'true',
      'sort': 'publishedAt:desc'
    })

    const res = await fetch(`${process.env.STRAPI_URL}/api/blog-posts?${params}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// Format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Process markdown content (basic implementation for bold text and images)
function processContent(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg my-4" />')
    .split('\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => `<p class="mb-4">${paragraph}</p>`)
    .join('')
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: { category: string; tags: string; slug: string }
}) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image ? [post.featured_image.url] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : [],
      tags: post.tags?.map(tag => tag.name) || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image ? [post.featured_image.url] : [],
    },
    alternates: {
      canonical: `/blog/category/${post.category?.slug || 'uncategorized'}/tags/${post.tags?.[0]?.slug || 'none'}/slug/${post.slug}`,
    },
  }
}

// Main component
export default async function BlogPostPage({
  params,
}: {
  params: { category: string; tags: string; slug: string }
}) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = post.category ? await getRelatedPosts(post.category.slug, post.id) : []

  return (
    <div className="container mx-auto px-4 py-8 ">
      {/* Back button */}
      <div className="  mt-[5rem]">
        <Button asChild variant="ghost" className="">
          <Link href="/blogs" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>

      {/* Main content */}
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          {/* Category and tags */}
          <div className="flex items-center gap-2 mb-4">
            {post.category && (
              <Badge 
                variant="secondary"
                style={{ backgroundColor: post.category.color ? `${post.category.color}20` : undefined }}
              >
                {post.category.name}
              </Badge>
            )}
            {post.tags?.map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar.url}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </div>
            {post.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.reading_time} min read
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views} views
            </div>
          </div>

          {/* Featured image */}
          {post.featured_image && (
            <div className="mb-8">
              <Image
                src={post.featured_image.url}
                alt={post.featured_image.alternativeText || post.title}
                width={post.featured_image.width}
                height={post.featured_image.height}
                className="w-full rounded-lg object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-gray max-w-none mb-12">
          post.content
          <div 
            dangerouslySetInnerHTML={{ 
              __html: processContent(post.content) 
            }} 
            className="text-lg leading-relaxed"
          />
        </div>
        

        {/* Author bio */}
        {post.author && post.author.bio && (
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar.url}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg mb-2">About {post.author.name}</h3>
                  <p className="text-muted-foreground">{post.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section>
            <Separator className="mb-8" />
            <h2 className="text-2xl font-semibold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="group hover:shadow-lg transition-all duration-300">
                  <Link href={`/blog/category/${relatedPost.category?.slug || 'uncategorized'}/tags/${relatedPost.tags?.[0]?.slug || 'none'}/slug/${relatedPost.slug}`}>
                    {relatedPost.featured_image && (
                      <Image
                        src={relatedPost.featured_image.url}
                        alt={relatedPost.featured_image.alternativeText || relatedPost.title}
                        width={relatedPost.featured_image.width}
                        height={relatedPost.featured_image.height}
                        className="w-full h-32 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {relatedPost.excerpt}
                        </p>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}