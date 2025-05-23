import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::carrinho.carrinho', ({ strapi }) => ({
  async me(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Você precisa estar autenticado');

    const carrinho = await strapi.service('api::carrinho.carrinho').me(user.id);
    return { data: carrinho };
  },

  async finalizar(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Você precisa estar autenticado');

    const pedido = await strapi.service('api::carrinho.carrinho').finalizar(user.id);
    return { data: pedido };
  },
}));
