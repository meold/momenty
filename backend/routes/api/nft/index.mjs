import sections from '../../../../common/sections.mjs';

export default async function routes(instance) {

  instance.post(
    '/',

    {
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
          required: ['title', 'image', 'video']
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

};