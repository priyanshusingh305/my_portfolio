'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tag.tag', ({ strapi }) => ({
  // Custom method to find by slug with paginated posts
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const sanitizedQuery = await this.sanitizeQuery(ctx);

    try {
      const tag = await strapi.entityService.findMany('api::tag.tag', {
        filters: { slug },
        fields: ['id', 'name', 'slug'],
        limit: 1
      });

      if (!tag || tag.length === 0) {
        return ctx.notFound('Tag not found');
      }

      const tagData = tag[0];

      const { results, pagination } = await strapi.entityService.findPage('api::blog-post.blog-post', {
        ...sanitizedQuery,
        filters: {
          tags: {
            id: tagData.id
          }
        },
        populate: ['featured_image', 'category', 'author'],
        fields: ['title', 'slug', 'excerpt', 'createdAt', 'reading_time', 'views']
      });

      return {
        data: {
          ...tagData,
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

  // Minimal tag list with pagination
  async findAllMinimal(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx);

    try {
      const { results, pagination } = await strapi.entityService.findPage('api::tag.tag', {
        ...sanitizedQuery,
        fields: ['id', 'name', 'slug'],
        sort: { name: 'ASC' }
      });

      const sanitizedResults = await this.sanitizeOutput(results, ctx);
      return this.transformResponse(sanitizedResults, { pagination });
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // All tags with count of posts
  async findAllWithCount(ctx) {
    const sanitizedQuery = await this.sanitizeQuery(ctx);

    try {
      const { results, pagination } = await strapi.entityService.findPage('api::tag.tag', {
        ...sanitizedQuery,
        fields: ['id', 'name', 'slug'],
        populate: {
          blog_posts: {
            fields: ['id']
          }
        }
      });

      const tagsWithCount = results.map(tag => ({
        ...tag,
        postCount: tag.blog_posts?.length || 0
      }));

      const sanitizedEntities = await this.sanitizeOutput(tagsWithCount, ctx);
      return this.transformResponse(sanitizedEntities, { pagination });
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Override findOne to support slug
  async findOne(ctx) {
    const { id } = ctx.params;

    if (!/^\d+$/.test(id) && id.includes('-')) {
      ctx.params.slug = id;
      return this.findBySlug(ctx);
    }

    return super.findOne(ctx);
  },
}));
