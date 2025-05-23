export default {
  routes: [
    {
      method: 'GET',
      path: '/carrinhos',
      handler: 'carrinho.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/carrinhos/:id',
      handler: 'carrinho.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/carrinhos',
      handler: 'carrinho.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/carrinhos/:id',
      handler: 'carrinho.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/carrinhos/:id',
      handler: 'carrinho.delete',
      config: {
        policies: [],
      },
    },
	
	{
		method: 'GET',
		path: '/meucarrinho',
		handler: 'api::carrinho.carrinho.me',
		config: {
			policies: [],
		}
	},
	{
		method: 'POST',
		path: '/finalizarpedido',
		handler: 'carrinho.finalizar',
		config: {
			policies: [],
		},
	}
  ],
};
