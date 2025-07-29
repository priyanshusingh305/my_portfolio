// src/api/blog-post/controllers/blog-post.js
'use strict';
/**
 * blog-post controller
 */
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog-post.blog-post', ({ strapi }) => ({
  // Override the default find method to handle view increment when filtering by slug
  async find(ctx) {
    const { query } = ctx;
    
    // Check if this is a single blog post request filtered by slug
    const isSlugFilter = query?.filters?.slug?.$eq || query?.filters?.slug;
    
    if (isSlugFilter) {
      try {
        // Get the original result first
        const { data, meta } = await super.find(ctx);
        
        // If we found exactly one result, increment its view count
        if (data && data.length === 1) {
          const blogPost = data[0];
          
          // Increment view count
          await strapi.entityService.update('api::blog-post.blog-post', blogPost.id, {
            data: { views: blogPost.attributes.views + 1 }
          });
          
          // Update the response data to reflect the new view count
          blogPost.attributes.views = blogPost.attributes.views + 1;
        }
        
        return { data, meta };
      } catch (error) {
        ctx.throw(500, error);
      }
    }
    
    // Default behavior for other queries
    return super.find(ctx);
  },

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
     
      // Increment view count
      await strapi.entityService.update('api::blog-post.blog-post', blogPost.id, {
        data: { views: blogPost.views + 1 }
      });
      
      // Update the local object to reflect the new view count
      blogPost.views = blogPost.views + 1;
      
      // Transform the response to match Strapi's standard format
      const sanitizedEntity = await this.sanitizeOutput(blogPost, ctx);
     
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Override the default findOne to also work with slugs and increment views
  async findOne(ctx) {
    const { id } = ctx.params;
   
    // Check if the id is actually a slug (contains non-numeric characters)
    if (isNaN(id) && id.length > 10) {
      // Redirect to findBySlug
      ctx.params.slug = id;
      return this.findBySlug(ctx);
    }
   
    try {
      // Default behavior for numeric IDs with view increment
      const entity = await strapi.entityService.findOne('api::blog-post.blog-post', id, {
        populate: {
          featured_image: true,
          tags: true,
          category: true,
          author: true,
        },
      });

      if (!entity) {
        return ctx.notFound('Blog post not found');
      }

      // Increment view count
      await strapi.entityService.update('api::blog-post.blog-post', id, {
        data: { views: entity.views + 1 }
      });

      // Update the local object to reflect the new view count
      entity.views = entity.views + 1;

      // Transform the response to match Strapi's standard format
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
     
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));