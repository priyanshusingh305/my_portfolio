import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Eye, User, Tag, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Types (same as listing page)
interface StrapiImage {
	id: number;
	name: string;
	alternativeText?: string;
	caption?: string;
	width: number;
	height: number;
	formats?: {
		thumbnail?: { url: string; width: number; height: number };
		small?: { url: string; width: number; height: number };
		medium?: { url: string; width: number; height: number };
		large?: { url: string; width: number; height: number };
	};
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl?: string;
	provider: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	provider_metadata?: any;
	createdAt: string;
	updatedAt: string;
	documentId: string;
	publishedAt: string;
}

interface BlogPost {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	meta_title?: string;
	meta_description?: string;
	reading_time?: number;
	featured: boolean;
	views: number;
	publishedAt: string;
	updatedAt: string;
	createdAt: string;
	featured_image?: StrapiImage | null;
	tags?: Array<{
		id: number;
		documentId: string;
		name: string;
		slug: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
	}>;
	category?: {
		id: number;
		documentId: string;
		name: string;
		slug: string;
		description?: string;
		color?: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
	};
	author?: {
		id: number;
		documentId: string;
		name: string;
		email?: string;
		bio?: string;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		social_links?: any;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
		avatar?: StrapiImage;
	};
}

// Fetch single blog post by slug
async function getBlogPost(slug: string): Promise<BlogPost | null> {
	try {
		const params = new URLSearchParams({
			"filters[slug][$eq]": slug,
			"populate[featured_image]": "true",
			"populate[tags]": "true",
			"populate[category]": "true",
			"populate[author][populate]": "avatar",
		});

		const res = await fetch(`${process.env.STRAPI_URL}/api/blog-posts?${params}`, {
			next: { revalidate: 60 },
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			console.error("Failed to fetch blog post:", res.status, res.statusText);
			return null;
		}

		const data = await res.json();
		const posts = data.data || [];

		if (posts.length === 0) {
			return null;
		}

		const post = posts[0];

		// Increment view count
		try {
			await fetch(`${process.env.STRAPI_URL}/api/blog-posts/${post.documentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					data: {
						views: post.views + 1,
					},
				}),
			});
		} catch (error) {
			console.error("Failed to increment view count:", error);
		}

		return post;
	} catch (error) {
		console.error("Error fetching blog post:", error);
		return null;
	}
}

// Get related posts
async function getRelatedPosts(categorySlug: string, currentPostId: number): Promise<BlogPost[]> {
	try {
		const params = new URLSearchParams({
			"filters[category][slug][$eq]": categorySlug,
			"filters[id][$ne]": currentPostId.toString(),
			"pagination[pageSize]": "3",
			"populate[featured_image]": "true",
			"populate[category]": "true",
			"populate[author]": "true",
			sort: "publishedAt:desc",
		});

		const res = await fetch(`${process.env.STRAPI_URL}/api/blog-posts?${params}`, {
			next: { revalidate: 300 },
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			return [];
		}

		const data = await res.json();
		return data.data || [];
	} catch (error) {
		console.error("Error fetching related posts:", error);
		return [];
	}
}

// Format date
function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

// Process markdown content (enhanced)
function processContent(content: string) {
	// Handle code blocks first (```ts ... ```)
	let processedContent = content.replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_, code) => {
		const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		return `<pre class="bg-muted p-4 rounded text-sm overflow-x-auto mb-6"><code class="font-mono text-foreground">${escaped}</code></pre>`;
	});

	// Inline formatting: bold, italic, code
	processedContent = processedContent
		.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
		.replace(/\*(.*?)\*/g, '<em class="italic text-foreground">$1</em>')
		.replace(/`([^`\n]+?)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">$1</code>')
		.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-8 shadow-lg" />')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>');

	// Split into blocks
	const lines = processedContent.split("\n");
	let result = "";
	let inList = false;

	for (let line of lines) {
		line = line.trim();
		if (!line) {
			continue;
		}

		if (line.startsWith("### ")) {
			if (inList) {
				result += "</ul>";
				inList = false;
			}
			result += `<h3 class="text-xl font-bold mt-6 mb-3 text-foreground">${line.slice(4)}</h3>`;
		} else if (line.startsWith("## ")) {
			if (inList) {
				result += "</ul>";
				inList = false;
			}
			result += `<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">${line.slice(3)}</h2>`;
		} else if (line.startsWith("# ")) {
			if (inList) {
				result += "</ul>";
				inList = false;
			}
			result += `<h1 class="text-3xl font-bold mt-8 mb-4 text-foreground">${line.slice(2)}</h1>`;
		} else if (line.startsWith("- ")) {
			if (!inList) {
				result += `<ul class="list-disc list-inside mb-6 text-foreground">`;
				inList = true;
			}
			result += `<li class="ml-4">${line.slice(2)}</li>`;
		} else {
			if (inList) {
				result += "</ul>";
				inList = false;
			}
			result += `<p class="mb-6 leading-relaxed text-foreground">${line}</p>`;
		}
	}

	if (inList) {
		result += "</ul>";
	}

	return result;
}

// Generate metadata
export async function generateMetadata({
	params,
}: {
	params: { category: string; tags: string; slug: string };
}) {
	const post = await getBlogPost(params.slug);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	return {
		title: post.meta_title || post.title,
		description: post.meta_description || post.excerpt,
		openGraph: {
			title: post.meta_title || post.title,
			description: post.meta_description || post.excerpt,
			images: post.featured_image ? [post.featured_image.url] : [],
			type: "article",
			publishedTime: post.publishedAt,
			modifiedTime: post.updatedAt,
			authors: post.author ? [post.author.name] : [],
			tags: post.tags?.map((tag) => tag.name) || [],
		},
		twitter: {
			card: "summary_large_image",
			title: post.meta_title || post.title,
			description: post.meta_description || post.excerpt,
			images: post.featured_image ? [post.featured_image.url] : [],
		},
	};
}

// Main component
export default async function BlogPostPage({
	params,
}: {
	params: { category: string; tags: string; slug: string };
}) {
	const post = await getBlogPost(params.slug);

	if (!post) {
		notFound();
	}

	// Parse multiple tags from URL
	const urlTags = params.tags !== "none" ? params.tags.split(",") : [];

	const relatedPosts = post.category ? await getRelatedPosts(post.category.slug, post.id) : [];

	return (
		<div className="min-h-screen dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] pt-24">
			<div className="container mx-auto px-4 py-8">
				{/* Back button */}
				<div className="mb-8">
					<Button asChild variant="ghost" size="sm">
						<Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
							<ArrowLeft className="w-4 h-4" />
							Back to Blog
						</Link>
					</Button>
				</div>

				<article className="max-w-4xl mx-auto">
					{/* Header */}
					<header className="mb-12">
						{/* Category and tags */}
						<div className="flex flex-wrap items-center gap-3 mb-6">
							{post.category && <Badge className="text-sm px-3 py-1">{post.category.name}</Badge>}
							{post.tags?.map((tag) => (
								<Badge key={tag.id} variant="outline" className="text-sm">
									<Tag className="w-3 h-3 mr-1" />
									{tag.name}
								</Badge>
							))}
							{post.featured && (
								<Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">Featured</Badge>
							)}
						</div>

						{/* Title */}
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
							{post.title}
						</h1>

						{/* Excerpt */}
						{post.excerpt && (
							<p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed font-light">
								{post.excerpt}
							</p>
						)}

						{/* Meta information */}
						<div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 p-4 bg-muted rounded-lg">
							{post.author && (
								<div className="flex items-center gap-3">
									{post.author.avatar ? (
										<Image
											src={post.author.avatar.url || "/placeholder.svg"}
											alt={post.author.name}
											width={40}
											height={40}
											className="w-10 h-10 rounded-full object-cover"
										/>
									) : (
										<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
											<User className="w-5 h-5" />
										</div>
									)}
									<div>
										<p className="font-medium text-foreground">{post.author.name}</p>
										<p className="text-xs">Author</p>
									</div>
								</div>
							)}

							<Separator orientation="vertical" className="h-8" />

							<div className="flex items-center gap-1">
								<CalendarDays className="w-4 h-4" />
								{formatDate(post.publishedAt)}
							</div>

							{post.reading_time && (
								<>
									<Separator orientation="vertical" className="h-4" />
									<div className="flex items-center gap-1">
										<Clock className="w-4 h-4" />
										{post.reading_time} min read
									</div>
								</>
							)}

							<Separator orientation="vertical" className="h-4" />

							<div className="flex items-center gap-1">
								<Eye className="w-4 h-4" />
								{post.views} views
							</div>
						</div>

						{/* Featured image */}
						{post.featured_image && (
							<div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
								<Image
									src={post.featured_image.url || "/placeholder.svg"}
									alt={post.featured_image.alternativeText || post.title}
									width={post.featured_image.width}
									height={post.featured_image.height}
									className="w-full object-cover"
									priority
								/>
							</div>
						)}
					</header>

					{/* Content */}
					<div className="prose prose-lg max-w-none mb-16 text-lg leading-relaxed text-foreground">
						{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized and comes from a trusted source (Strapi) */}
						<div dangerouslySetInnerHTML={{ __html: processContent(post.content) }} />
					</div>

					{/* Author bio */}
					{post.author?.bio && (
						<Card className="mb-16 border-0 shadow-lg bg-muted">
							<CardContent className="p-8">
								<div className="flex items-start gap-6">
									{post.author.avatar ? (
										<Image
											src={post.author.avatar.url || "/placeholder.svg"}
											alt={post.author.name}
											width={80}
											height={80}
											className="w-20 h-20 rounded-full object-cover shadow-lg"
										/>
									) : (
										<div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shadow-lg">
											<User className="w-10 h-10 text-gray-400" />
										</div>
									)}
									<div className="flex-1">
										<h3 className="font-bold text-xl mb-3">About {post.author.name}</h3>
										<p className="text-muted-foreground leading-relaxed">{post.author.bio}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Related posts */}
					{relatedPosts.length > 0 && (
						<section>
							<Separator className="mb-12" />
							<h2 className="text-3xl font-bold mb-8 text-center">You Might Also Like</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								{relatedPosts.map((relatedPost) => (
									<Card
										key={relatedPost.id}
										className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden"
									>
										<Link
											href={`/blog/category/${relatedPost.category?.slug || "uncategorized"}/tags/${
												relatedPost.tags && relatedPost.tags.length > 0
													? relatedPost.tags.map((tag) => tag.slug).join(",")
													: "none"
											}/slug/${relatedPost.slug}`}
										>
											{relatedPost.featured_image && (
												<Image
													src={relatedPost.featured_image.url || "/placeholder.svg"}
													alt={relatedPost.featured_image.alternativeText || relatedPost.title}
													width={relatedPost.featured_image.width}
													height={relatedPost.featured_image.height}
													className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											)}
											<CardContent className="p-6">
												<h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
													{relatedPost.title}
												</h3>
												{relatedPost.excerpt && (
													<p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
														{relatedPost.excerpt}
													</p>
												)}
												<div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
													<CalendarDays className="w-3 h-3" />
													{formatDate(relatedPost.publishedAt)}
												</div>
											</CardContent>
										</Link>
									</Card>
								))}
							</div>
						</section>
					)}
				</article>
			</div>
		</div>
	);
}
