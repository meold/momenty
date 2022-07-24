import sections from '../../../../common/sections.mjs';

export default async function routes(instance) {

  instance.get(
    '/',

    {
      schema: {
        query: {
          type: 'object',
          properties: {
            userId: {
              type: 'number'
            }
          },
          required: ['userId']
        }
      }
    },

    async (request) => {
      const { userId } = request.query;

      const nfts = await instance.sequelize.models.Nft.findAll({
        where: {
          userId
        }
      }, { raw: true });

      if (!nfts) {
        return { success: false };
      }

      return { success: true, nfts };
    }
  );

  instance.post(
    '/',

    {
      onRequest: instance.authenticate,
      schema: {
        body: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            section: {
              type: 'string',
              enum: sections
            },
            image: {
              type: 'string',
              format: 'uri'
            },
            video: {
              type: 'string',
              format: 'uri'
            }
          },
          required: ['title', 'section', 'image', 'video']
        }
      }
    },

    async (request) => {
      const nft = request.body;
      nft.userId = request.user.id;

      let result;
      try {
        result = await instance.sequelize.models.Nft.create(nft);
      } catch (error) {
        // FIXME:
        console.log(error);
      }

      return { success: Boolean(result), id: result.id };
    }
  );

  instance.get(
    '/:id(^\\d+)/',

    async (request) => {
      const { id } = request.params;

      const nft = await instance.sequelize.models.Nft.findByPk(id, {
        include: [{
          model: instance.sequelize.models.User,
          as: 'user'
        }]
      });

      if (!nft) {
        return { success: false };
      }

      return { success: true, nft };
    }
  );
};