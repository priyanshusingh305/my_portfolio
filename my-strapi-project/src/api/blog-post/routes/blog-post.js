// src/api/blog-post/routes/blog-post.js
module.exports = {
  routes: [
    // Default routes
    {
      method: 'GET',
      path: '/blog-posts',
      handler: 'blog-post.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/blog-posts/:id',
      handler: 'blog-post.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/blog-posts',
      handler: 'blog-post.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/blog-posts/:id',
      handler: 'blog-post.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/blog-posts/:id',
      handler: 'blog-post.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Custom route for getting by slug
    {
      method: 'GET',
      path: '/blog-posts/slug/:slug',
      handler: 'blog-post.findBySlug',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};