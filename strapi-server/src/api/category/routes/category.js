// src/api/category/routes/category.js
module.exports = {
  routes: [
    // Default routes
    {
      method: 'GET',
      path: '/categories',
      handler: 'category.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/category/:id',
      handler: 'category.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/category',
      handler: 'category.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/category/:id',
      handler: 'category.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/category/:id',
      handler: 'category.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Custom routes
    {
      method: 'GET',
      path: '/category/slug/:slug',
      handler: 'category.findBySlug',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/categories/minimal/all',
      handler: 'category.findAllMinimal',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/categories/with-count/all',
      handler: 'category.findAllWithCount',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};