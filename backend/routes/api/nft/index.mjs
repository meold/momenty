import sections from '../../../../common/sections.mjs';
import Sequelize from 'sequelize';

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

      return { success: true, nfts };
    }
  );

  instance.get(
    '/section/:section/',

    {
      schema: {
        params: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              enum: [...sections, 'new', 'trending']
            }
          },
          required: [ 'section' ]
        }
      }
    },

    async (request) => {
      const { section } = request.params;

      const query = { limit: 30 };

      if (section == 'new') {
        query.order = [['createdAt', 'DESC']];
      } else if(section == 'trending') {
        // FIXME: do tranding
        query.order = [['createdAt', 'ASC']];
      } else {
        query.where = { section };
      }

      const nfts = await instance.sequelize.models.Nft.findAll(query, { raw: true });

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

    {
      schema: {
        params: {
          $id: 'id-parser',
          properties: {
            id: {
              type: 'number',
              default: null
            }
          },
          required: ['id']
        }
      }
    },

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

  instance.get(
    '/search/',

    {
      schema: {
        query: {
          type: 'object',
          properties: {
            search: {
              type: 'string'
            }
          },
          required: ['search']
        }
      }
    },

    async (request) => {
      const { search } = request.query;
      const query = (search).toLowerCase();

      let where;
      if (search) {
        where = {
          [Sequelize.Op.or]: [
            instance.sequelize.where(
              instance.sequelize.fn('LOWER', instance.sequelize.col('title')), {[Sequelize.Op.like]: `%${query}%`}
            ),
            instance.sequelize.where(
              instance.sequelize.fn('LOWER', instance.sequelize.col('description')), {[Sequelize.Op.like]: `%${query}%`}
            ),
            instance.sequelize.where(
              instance.sequelize.fn('LOWER', instance.sequelize.col('user.name')), {[Sequelize.Op.like]: `%${query}%`}
            )
          ]
        };
      }

      const nfts = await instance.sequelize.models.Nft.findAll({
        where,
        include: [{ model: instance.sequelize.models.User, as: 'user', attributes: [] }],
        limit: 30,
        raw: true
      });

      return { success: true, nfts };
    }
  );

  instance.get(
    '/image/',

    async () => {
      const { image } = await instance.sequelize.models.Nft.findOne({
        attributes: ['image' ],
        where: {
          image: {
            [Sequelize.Op.not]: null
          }
        },
        order: instance.sequelize.random()
      }, { raw: true });

      return { success: true, image };
    }
  );
};