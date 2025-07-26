// app/blog/page.tsx
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Clock, Eye, User, Tag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Types for Strapi v5 format
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

interface BlogListResponse {
  data: BlogPost[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Fetch blog posts
async function getBlogPosts(
  page: number = 1,
  pageSize: number = 9,
  search?: string,
  category?: string,
  tag?: string
): Promise<BlogListResponse> {
  const params = new URLSearchParams({
    'pagination[page]': page.toString(),
    'pagination[pageSize]': pageSize.toString(),
    'populate[featured_image]': 'true',
    'populate[tags]': 'true',
    'populate[category]': 'true',
    'populate[author][populate]': 'avatar',
    'sort': 'publishedAt:desc'
  })

  if (search) {
    params.append('filters[$or][0][title][$containsi]', search)
    params.append('filters[$or][1][excerpt][$containsi]', search)
  }

  if (category && category !== 'all') {
    params.append('filters[category][slug][$eq]', category)
  }

  if (tag && tag !== 'all') {
    params.append('filters[tags][slug][$eq]', tag)
  }

  const url = `${process.env.STRAPI_URL}/api/blog-posts?${params}`
  console.log('Fetching from URL:', url)

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every minute
      headers: {
        'Content-Type': 'application/json',
      }
    })

    console.log('Response status:', res.status)

    if (!res.ok) {
      const errorText = await res.text()
      console.error('API Error Response:', errorText)
      throw new Error(`Failed to fetch blog posts: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    console.log('Fetched data structure:', {
      dataLength: data.data?.length || 0,
      hasData: !!data.data,
      hasMeta: !!data.meta,
      samplePost: data.data?.[0] ? Object.keys(data.data[0]) : []
    })

    return data
  } catch (error) {
    console.error('Fetch error:', error)
    
    // Return empty data structure to prevent complete failure
    return {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: pageSize,
          pageCount: 0,
          total: 0
        }
      }
    }
  }
}

// Get categories for filter
async function getCategories() {
  try {
    const res = await fetch(`${process.env.STRAPI_URL}/api/categories?pagination[pageSize]=100`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      console.error('Failed to fetch categories:', res.status, res.statusText)
      return []
    }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Categories fetch error:', error)
    return []
  }
}

// Get tags for filter
async function getTags() {
  try {
    const res = await fetch(`${process.env.STRAPI_URL}/api/tags?pagination[pageSize]=100`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      console.error('Failed to fetch tags:', res.status, res.statusText)
      return []
    }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Tags fetch error:', error)
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

// Blog post card component
function BlogPostCard({ post }: { post: BlogPost }) {
  const featuredImage = post.featured_image
  const category = post.category
  const author = post.author
  const tags = post.tags || []

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <div className="relative overflow-hidden rounded-t-lg">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.alternativeText || post.title}
            width={featuredImage.width}
            height={featuredImage.height}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        {post.featured && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600">
            Featured
          </Badge>
        )}
        {category && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3"
            style={{ backgroundColor: category.color ? `${category.color}20` : undefined }}
          >
            {category.name}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/blog/category/${category?.slug || 'uncategorized'}/tags/${tags.length > 0 ? tags[0].slug : 'none'}/slug/${post.slug}`}>
            {post.title}
          </Link>
        </CardTitle>
        {post.excerpt && (
          <CardDescription className="line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </div>
          {post.reading_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.reading_time} min read
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </div>
        </div>

        {author && (
          <div className="flex items-center gap-2 mb-3">
            {author.avatar ? (
              <Image
                src={author.avatar.url}
                alt={author.name}
                width={16}
                height={16}
                className="w-4 h-4 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">{author.name}</span>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <Button asChild variant="ghost" className="w-full mt-2 group-hover:bg-blue-50 group-hover:text-blue-600">
          <Link href={`/blog/category/${category?.slug || 'uncategorized'}/tags/${tags.length > 0 ? tags[0].slug : 'none'}/slug/${post.slug}`}>
            Read More →
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

// Pagination component
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void 
}) {
  const pages = []
  const showPages = 5
  
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
  let endPage = Math.min(totalPages, startPage + showPages - 1)
  
  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      
      {startPage > 1 && (
        <>
          <Button
            variant={1 === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button
            variant={totalPages === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  )
}

// Loading component
function BlogLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Main component
export default async function BlogPage({
  searchParams
}: {
  searchParams: { 
    page?: string
    search?: string
    category?: string
    tag?: string
  }
}) {
  const currentPage = parseInt(searchParams?.page || '1')
  const search = searchParams?.search
  const category = searchParams?.category
  const tag = searchParams?.tag

  // Debug environment variables
  console.log('Environment check:', {
    STRAPI_URL: process.env.STRAPI_URL ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV
  })

  // Fetch data with error handling
  let blogData, categories, tags

  try {
    [blogData, categories, tags] = await Promise.all([
      getBlogPosts(currentPage, 9, search, category, tag),
      getCategories(),
      getTags()
    ])
  } catch (error) {
    console.error('Error fetching blog data:', error)
    
    // Provide fallback data
    blogData = {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 9,
          pageCount: 0,
          total: 0
        }
      }
    }
    categories = []
    tags = []
  }

  const { data: posts, meta } = blogData
  const { pagination } = meta

  // Show error message if no data and likely an API issue
  if (posts.length === 0 && pagination.total === 0 && !search && !category && !tag) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-red-800 font-semibold mb-2">Connection Error</h2>
            <p className="text-red-600 text-sm mb-4">
              Unable to connect to the blog API. Please check your configuration.
            </p>
            <details className="text-left">
              <summary className="cursor-pointer text-red-700 font-medium">Debug Info</summary>
              <div className="mt-2 text-xs text-red-600">
                <p>STRAPI_URL: {process.env.STRAPI_URL || 'Not set'}</p>
                <p>Check your environment variables and Strapi server.</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
          Our Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover insights, tutorials, and stories from our team
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search articles..."
            defaultValue={search}
            className="w-full"
            name="search"
          />
        </div>
        <Select defaultValue={category || ''}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.slug || `cat-${cat.id}`}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue={tag || ''}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tags.map((t: any) => (
              <SelectItem key={t.id} value={t.slug || `tag-${t.id}`}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Featured Posts */}
      {currentPage === 1 && !search && !category && !tag && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Posts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts
              .filter(post => post.featured)
              .slice(0, 2)
              .map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {search ? `Search Results for "${search}"` : 'Latest Posts'}
          </h2>
          <span className="text-sm text-muted-foreground">
            {pagination.total} article{pagination.total !== 1 ? 's' : ''} found
          </span>
        </div>

        <Suspense fallback={<BlogLoading />}>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No articles found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search criteria or browse all categories.
              </p>
            </div>
          )}
        </Suspense>
      </div>

      {/* Pagination */}
      {pagination.pageCount > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pageCount}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams)
            params.set('page', page.toString())
            window.location.href = `?${params.toString()}`
          }}
        />
      )}
    </div>
  )
}