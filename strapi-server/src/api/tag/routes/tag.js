module.exports = {
  routes: [
    // Default CRUD
    {
      method: 'GET',
      path: '/tags',
      handler: 'tag.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/tag/:id',
      handler: 'tag.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/tag',
      handler: 'tag.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/tag/:id',
      handler: 'tag.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/tag/:id',
      handler: 'tag.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },

    // Custom routes
    {
      method: 'GET',
      path: '/tag/slug/:slug',
      handler: 'tag.findBySlug',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/tags/minimal/all',
      handler: 'tag.findAllMinimal',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/tags/with-count/all',
      handler: 'tag.findAllWithCount',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};
