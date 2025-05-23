import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cart-item.cart-item', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Você precisa estar autenticado.');

    const items = await strapi.service('api::cart-item.cart-item').findByUser(user.id);
    return { data: items };
  },
}));
