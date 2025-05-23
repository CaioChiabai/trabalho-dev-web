import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::carrinho.carrinho', ({ strapi }) => ({


    async me(userId: number) {
      const carrinhoService = strapi.service('api::carrinho.carrinho')
  
      const carrinhos = await carrinhoService.find({
        filters: { user: userId },
        populate: ['user'],
      });
      
      let carrinho = carrinhos.results?.[0];
      

      if (!carrinho) {
        carrinho = await carrinhoService.create({
          data: { user: userId },
        });
      }
  
      return carrinho;
    },
  
    async finalizar(userId: number) {
      return await strapi.db.transaction(async ({ trx }) => {
        const carrinhoService = strapi.service('api::carrinho.carrinho');
        const cartItemService = strapi.service('api::cart-item.cart-item');
        const pedidoService = strapi.service('api::pedido.pedido');
        const pedidoItemService = strapi.service('api::pedido-item.pedido-item');
  
        const carrinhos = await carrinhoService.find({
          filters: { user: userId },
          populate: ['user'],
        });
  
        const carrinho = carrinhos.results?.[0];
        if (!carrinho) throw new Error('Carrinho não encontrado');
  
        const cartItems = await cartItemService.find({
          filters: { carrinho: { id: carrinho.id } },
          populate: ['produto'],
        });
  
        if (!cartItems.results?.length) throw new Error('Carrinho vazio');
  
        const pedido = await pedidoService.create({
          data: {
            cliente: userId,
            status: 'PENDENTE',
            data: new Date().toISOString(),
          },
        }, { transacting: trx });
  
        for (const item of cartItems.results) {
          const produtoId = Array.isArray(item['produto'])
            ? item['produto'][0]?.id
            : item['produto']?.id;
  
          if (!produtoId) continue;
  
          await pedidoItemService.create({
            data: {
              pedido: pedido.id,
              produto: produtoId,
              quantidade: item.quantidade,
              preco_unit: item.preco_unit,
            },
          }, { transacting: trx });
        }
        for (const item of cartItems.results) {
          await cartItemService.delete( item.id , { transacting: trx });
        }

  
        return pedido;
      });
    }
}));
  