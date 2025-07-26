// src/api/blog-post/controllers/blog-post.js
'use strict';

/**
 * blog-post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog-post.blog-post', ({ strapi }) => ({
  // Custom method to find by slug
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::blog-post.blog-post', {
        filters: { slug: slug },
        populate: {
          featured_image: true,
          tags: true,
          category: true,
          author: true,
        },
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Blog post not found');
      }

      // Return the first match (should be unique due to slug uniqueness)
      const blogPost = entity[0];
      
      // Optionally increment view count
      await strapi.entityService.update('api::blog-post.blog-post', blogPost.id, {
        data: { views: blogPost.views + 1 }
      });

      // Transform the response to match Strapi's standard format
      const sanitizedEntity = await this.sanitizeOutput(blogPost, ctx);
      
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Override the default findOne to also work with slugs
  async findOne(ctx) {
    const { id } = ctx.params;
    
    // Check if the id is actually a slug (contains non-numeric characters)
    if (isNaN(id) && id.length > 10) {
      // Redirect to findBySlug
      ctx.params.slug = id;
      return this.findBySlug(ctx);
    }
    
    // Default behavior for numeric IDs
    return super.findOne(ctx);
  },
}));