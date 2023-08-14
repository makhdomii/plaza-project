/**
 * participant controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::participant.participant',
  ({ strapi }) => ({
    findOneByCategory: async (ctx) => {
      const data = await strapi.db
        .query('api::participant.participant')
        .findMany({
          where: {
            num: ctx.params.num,
          },
        });
      ctx.body = data;
      console.log('this is find one by category', ctx.params);
    },
    findOneByRegion: async () => {},
  })
);
