import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, Eye, User, Tag, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Types for Strapi v5 format
interface StrapiImage {
  id: number
  name: string
  alternativeText?: string
  caption?: string
  width: number
  height: number
  formats?: {
    thumbnail?: { url: string; width: number; height: number }
    small?: { url: string; width: number; height: number }
    medium?: { url: string; width: number; height: number }
    large?: { url: string; width: number; height: number }
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
async function getBlogPosts(page = 1, pageSize = 9, category?: string, tag?: string): Promise<BlogListResponse> {
  const params = new URLSearchParams({
    "pagination[page]": page.toString(),
    "pagination[pageSize]": pageSize.toString(),
    "populate[featured_image]": "true",
    "populate[tags]": "true",
    "populate[category]": "true",
    "populate[author][populate]": "avatar",
    sort: "publishedAt:desc",
  })

  if (category && category !== "all") {
    params.append("filters[category][slug][$eq]", category)
  }

  if (tag && tag !== "all") {
    params.append("filters[tags][slug][$eq]", tag)
  }

  const url = `${process.env.STRAPI_URL}/api/blog-posts?${params}`

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch blog posts: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Fetch error:", error)
    return {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: pageSize,
          pageCount: 0,
          total: 0,
        },
      },
    }
  }
}

// Get categories for filter
async function getCategories() {
  try {
    const res = await fetch(`${process.env.STRAPI_URL}/api/categories?pagination[pageSize]=100`, {
      next: { revalidate: 300 },
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) {
      return []
    }
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error("Categories fetch error:", error)
    return []
  }
}

// Get tags for filter
async function getTags() {
  try {
    const res = await fetch(`${process.env.STRAPI_URL}/api/tags?pagination[pageSize]=100`, {
      next: { revalidate: 300 },
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) {
      return []
    }
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error("Tags fetch error:", error)
    return []
  }
}

// Format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Blog post card component
function BlogPostCard({ post }: { post: BlogPost }) {
  const featuredImage = post.featured_image
  const category = post.category
  const author = post.author
  const tags = post.tags || []

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
      <div className="relative overflow-hidden">
        {featuredImage ? (
          <Image
            src={featuredImage.url || "/placeholder.svg"}
            alt={featuredImage.alternativeText || post.title}
            width={featuredImage.width}
            height={featuredImage.height}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        {post.featured && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
            Featured
          </Badge>
        )}
        {category && (
          <Badge
            variant="secondary"
            className="absolute top-4 right-4 shadow-md"
            style={{
              backgroundColor: category.color ? `${category.color}20` : undefined,
              borderColor: category.color || undefined,
            }}
          >
            {category.name}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors text-xl leading-tight">
          <Link
            href={`/blog/category/${category?.slug || "uncategorized"}/tags/${tags.length > 0 ? tags.map((tag) => tag.slug).join(",") : "none"}/slug/${post.slug}`}
          >
            {post.title}
          </Link>
        </CardTitle>
        {post.excerpt && (
          <CardDescription className="line-clamp-3 text-sm leading-relaxed text-gray-600">
            {post.excerpt}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </div>
          {post.reading_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.reading_time} min
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </div>
        </div>

        {author && (
          <div className="flex items-center gap-2">
            {author.avatar ? (
              <Image
                src={author.avatar.url || "/placeholder.svg"}
                alt={author.name}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground font-medium">{author.name}</span>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <Button
          asChild
          variant="ghost"
          className="w-full mt-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
        >
          <Link
            href={`/blog/category/${category?.slug || "uncategorized"}/tags/${tags.length > 0 ? tags.map((tag) => tag.slug).join(",") : "none"}/slug/${post.slug}`}
          >
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
  category,
  tag,
}: {
  currentPage: number
  totalPages: number
  category?: string
  tag?: string
}) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (page > 1) params.set("page", page.toString())
    if (category && category !== "all") params.set("category", category)
    if (tag && tag !== "all") params.set("tag", tag)
    return `/blog${params.toString() ? `?${params.toString()}` : ""}`
  }

  const pages = []
  const showPages = 5
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
  const endPage = Math.min(totalPages, startPage + showPages - 1)

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <Button asChild variant="outline" size="sm" className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}>
        <Link href={createPageUrl(currentPage - 1)}>Previous</Link>
      </Button>

      {startPage > 1 && (
        <>
          <Button asChild variant={1 === currentPage ? "default" : "outline"} size="sm">
            <Link href={createPageUrl(1)}>1</Link>
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button key={page} asChild variant={page === currentPage ? "default" : "outline"} size="sm">
          <Link href={createPageUrl(page)}>{page}</Link>
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button asChild variant={totalPages === currentPage ? "default" : "outline"} size="sm">
            <Link href={createPageUrl(totalPages)}>{totalPages}</Link>
          </Button>
        </>
      )}

      <Button
        asChild
        variant="outline"
        size="sm"
        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
      >
        <Link href={createPageUrl(currentPage + 1)}>Next</Link>
      </Button>
    </div>
  )
}

// Loading component
function BlogLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="w-full h-56 bg-gray-200 rounded-t-lg" />
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-1" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Filter buttons component
function FilterButtons({
  categories,
  tags,
  currentCategory,
  currentTag,
}: {
  categories: any[]
  tags: any[]
  currentCategory?: string
  currentTag?: string
}) {
  const createFilterUrl = (newCategory?: string, newTag?: string) => {
    const params = new URLSearchParams()
    if (newCategory && newCategory !== "all") params.set("category", newCategory)
    if (newTag && newTag !== "all") params.set("tag", newTag)
    return `/blog${params.toString() ? `?${params.toString()}` : ""}`
  }

  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4" />
          <h3 className="font-semibold">Categories</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant={!currentCategory || currentCategory === "all" ? "default" : "outline"} size="sm">
            <Link href={createFilterUrl("all", currentTag)}>All Categories</Link>
          </Button>
          {categories.map((category: any) => (
            <Button
              key={category.id}
              asChild
              variant={currentCategory === category.slug ? "default" : "outline"}
              size="sm"
            >
              <Link href={createFilterUrl(category.slug, currentTag)}>{category.name}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Tag filters */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4" />
          <h3 className="font-semibold">Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant={!currentTag || currentTag === "all" ? "default" : "outline"} size="sm">
            <Link href={createFilterUrl(currentCategory, "all")}>All Tags</Link>
          </Button>
          {tags.map((tag: any) => (
            <Button key={tag.id} asChild variant={currentTag === tag.slug ? "default" : "outline"} size="sm">
              <Link href={createFilterUrl(currentCategory, tag.slug)}>{tag.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main component
export default async function BlogPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    category?: string
    tag?: string
  }
}) {
  const currentPage = Number.parseInt(searchParams?.page || "1")
  const category = searchParams?.category
  const tag = searchParams?.tag

  // Fetch data with error handling
  let blogData, categories, tags
  try {
    ;[blogData, categories, tags] = await Promise.all([
      getBlogPosts(currentPage, 9, category, tag),
      getCategories(),
      getTags(),
    ])
  } catch (error) {
    console.error("Error fetching blog data:", error)
    blogData = {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 9,
          pageCount: 0,
          total: 0,
        },
      },
    }
    categories = []
    tags = []
  }

  const { data: posts, meta } = blogData
  const { pagination } = meta

  

  // Show error message if no data and likely an API issue
  if (posts.length === 0 && pagination.total === 0 && !category && !tag) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Blog</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-red-800 font-semibold mb-2">Connection Error</h2>
            <p className="text-red-600 text-sm mb-4">
              Unable to connect to the blog API. Please check your configuration.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const featuredPosts = posts.filter((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Blogs</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Welcome to my blog! Here you&apos;ll find articles on web development, design, and technology. Explore the latest
            posts, filter by categories or tags, and discover featured content.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <FilterButtons categories={categories} tags={tags} currentCategory={category} currentTag={tag} />
        </div>

        {/* Featured Posts */}
        {currentPage === 1 && !category && !tag && featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Posts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {featuredPosts.slice(0, 2).map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {category && category !== "all"
                ? `${categories.find((c: any) => c.slug === category)?.name || "Category"} Posts`
                : tag && tag !== "all"
                  ? `Posts tagged "${tags.find((t: any) => t.slug === tag)?.name || tag}"`
                  : "Latest Posts"}
            </h2>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {pagination.total} article{pagination.total !== 1 ? "s" : ""}
            </span>
          </div>

          <Suspense fallback={<BlogLoading />}>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <p className="text-lg text-muted-foreground mb-2">No articles found.</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try selecting different filters or browse all categories.
                  </p>
                  <Button asChild>
                    <Link href="/blog">View All Posts</Link>
                  </Button>
                </div>
              </div>
            )}
          </Suspense>
        </div>

        {/* Pagination */}
        {pagination.pageCount > 1 && (
          <Pagination currentPage={pagination.page} totalPages={pagination.pageCount} category={category} tag={tag} />
        )}
      </div>
    </div>
  )
}
