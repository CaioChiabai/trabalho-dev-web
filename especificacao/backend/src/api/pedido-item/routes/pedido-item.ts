export default {
  routes: [
    {
      method: 'GET',
      path: '/pedido-items',
      handler: 'pedido-item.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/pedido-items/:id',
      handler: 'pedido-item.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/pedido-items',
      handler: 'pedido-item.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/pedido-items/:id',
      handler: 'pedido-item.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/pedido-items/:id',
      handler: 'pedido-item.delete',
      config: {
        policies: [],
      },
    },
  ],
};
