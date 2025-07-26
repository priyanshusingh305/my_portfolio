'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({ strapi }) => ({
  // Custom method to find by slug with paginated posts
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const sanitizedQuery = await this.sanitizeQuery(ctx);
    
    try {
      // Find the category by slug
      const category = await strapi.entityService.findMany('api::category.category', {
        filters: { slug },
        fields: ['id', 'name', 'slug', 'description', 'color'],
        limit: 1
      });

      if (!category || category.length === 0) {
        return ctx.notFound('Category not found');
      }

      const categoryData = category[0];
      
      // Get paginated blog posts for this category
      const { results, pagination } = await strapi.entityService.findPage('api::blog-post.blog-post', {
        ...sanitizedQuery,
        filters: { category: categoryData.id },
        populate: ['featured_image', 'tags', 'author'],
        fields: ['title', 'slug', 'excerpt', 'createdAt', 'reading_time', 'views']
      });

      return {
        data: {
          ...categoryData,
          blog_posts: results
        },
        meta: {
          pagination
        }
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Custom method to get all categories with pagination
  async findAllMinimal(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx);
    
    try {
      const { results, pagination } = await strapi.entityService.findPage('api::category.category', {
        ...sanitizedQuery,
        fields: ['id', 'name', 'slug', 'color', 'description'],
        sort: { name: 'ASC' }
      });

      const sanitizedResults = await this.sanitizeOutput(results, ctx);
      return this.transformResponse(sanitizedResults, { pagination });
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Custom method to get categories with post count and pagination
  async findAllWithCount(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx);
    
    try {
      const { results, pagination } = await strapi.entityService.findPage('api::category.category', {
        ...sanitizedQuery,
        fields: ['id', 'name', 'slug', 'color'],
        populate: {
          blog_posts: {
            fields: ['id']
          }
        }
      });

      // Add postCount to each category
      const categoriesWithCount = results.map(category => ({
        ...category,
        postCount: category.blog_posts?.length || 0
      }));

      const sanitizedEntities = await this.sanitizeOutput(categoriesWithCount, ctx);
      return this.transformResponse(sanitizedEntities, { pagination });
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Override the default findOne to also work with slugs
  async findOne(ctx) {
    const { id } = ctx.params;
    
    if (!/^\d+$/.test(id) && id.includes('-')) {
      ctx.params.slug = id;
      return this.findBySlug(ctx);
    }
    
    return super.findOne(ctx);
  },
}));