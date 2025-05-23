import { factories } from '@strapi/strapi'


export default factories.createCoreService('api::cart-item.cart-item', ({ strapi }) => ({
  async findByUser(userId: number) {


    const carrinhoService = strapi.service('api::carrinho.carrinho')
  
      const carrinhos = await carrinhoService.find({
        filters: { user: userId },
        populate: ['user'],
      });
      const carrinho = carrinhos.results?.[0];
      if (!carrinho) throw new Error('Carrinho não encontrado');

    const cartItems = await strapi.entityService.findMany('api::cart-item.cart-item', {
      filters: {
        carrinho: {
          id: carrinho.id,
        },
      },
      populate: ['produto', 'produto.imagem'],
    });

    return cartItems;
  },
}));
