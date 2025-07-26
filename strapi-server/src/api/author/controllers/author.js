// src/api/author/controllers/author.js
'use strict';

/**
 * author controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::author.author', ({ strapi }) => ({
  // Custom method to find by email
  async findByEmail(ctx) {
    const { email } = ctx.params;
    
    try {
      const entity = await strapi.entityService.findMany('api::author.author', {
        filters: { email: email.toLowerCase() },
        populate: {
          avatar: true,
          blog_posts: {
            fields: ['id', 'title', 'slug'],
            populate: {
              featured_image: true,
              category: true
            }
          }
        }
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Author not found');
      }

      // Return the first match (email should be unique)
      const author = entity[0];
      
      // Transform the response
      const sanitizedEntity = await this.sanitizeOutput(author, ctx);
      
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Override the default findOne to also work with email
  async findOne(ctx) {
    const { id } = ctx.params;
    
    // Check if the id is actually an email (contains '@')
    if (id.includes('@')) {
      ctx.params.email = id;
      return this.findByEmail(ctx);
    }
    
    // Default behavior for numeric IDs
    return super.findOne(ctx);
  },

  // Additional custom method to get author with minimal data
  async findMinimal(ctx) {
    try {
      const entities = await strapi.entityService.findMany('api::author.author', {
        fields: ['id', 'name', 'email', 'avatar'],
        populate: { avatar: true }
      });

      const sanitizedEntities = await this.sanitizeOutput(entities, ctx);
      return this.transformResponse(sanitizedEntities);
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));