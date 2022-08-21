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
            page: {
              type: 'number'
            },
            perPage: {
              type: 'number'
            }
          },
          required: ['page', 'perPage']
        }
      }
    },

    async (request) => {
      const { authorId, page, perPage } = request.query;

      const include = [
        {
          model: instance.sequelize.models.User,
          as: 'author',
          attributes: ['id', 'name', 'avatarUrl']
        }
      ];

      const where = {};

      if (authorId) {
        where.authorId = authorId;
      }

      if (request.query.userId) {
        where.userId = request.query.userId;
      }

      const userId = request.user?.id || null;
      if (userId) {
        include.push({
          model: instance.sequelize.models.Like,
          as: 'likes',
          attributes: ['userId'],
          where: {
            userId
          },
          required: false
        });
      }

      const limit = perPage;
      const offset = page * limit;

      const nfts = await instance.sequelize.models.Nft.findAll({
        where,
        include,
        limit,
        offset
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
              enum: [...sections, 'new', 'trending', 'favorite', 'created']
            }
          },
          required: [ 'section' ]
        },
        query: {
          type: 'object',
          properties: {
            page: {
              type: 'number'
            },
            perPage: {
              type: 'number'
            }
          },
          required: ['page', 'perPage']
        }
      }
    },

    async (request) => {
      const { section } = request.params;

      const limit = request.query.perPage;
      const offset = request.query.page * limit;

      const userId = request.user?.id || null;

      const include = [
        {
          model: instance.sequelize.models.User,
          as: 'author',
          attributes: ['id', 'name', 'avatarUrl']
        }
      ];

      if (userId) {
        include.push({
          model: instance.sequelize.models.Like,
          as: 'likes',
          attributes: ['userId'],
          where: {
            userId
          },
          required: false
        })
      }

      const query = { include, limit, offset };

      if (section == 'new') {
        query.order = [['createdAt', 'DESC']];
      } else if(section == 'trending') {
        // FIXME: do tranding
        query.order = [['createdAt', 'ASC']];
      } else if(section == 'created') {
        if (!userId) {
          return { success: false }
        }
        query.where = { authorId: userId };
      } else if (section == 'favorite' && userId) {
        include[1].required = true;
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
      nft.authorId = request.user.id;

      let nftInstance;
      try {
        nftInstance = await instance.sequelize.models.Nft.create(nft);
      } catch (error) {
        // FIXME:
        console.log(error);
        return { success: false }
      }

      nftInstance.uploadIpfs();

      return { success: true, id: nftInstance.id };
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

      const userId = request.user?.id || null;

      const include = [
        {
          model: instance.sequelize.models.User,
          as: 'author',
          attributes: ['id', 'name', 'avatarUrl']
        }
      ];

      if (userId) {
        include.push({
          model: instance.sequelize.models.Like,
          as: 'likes',
          attributes: ['userId'],
          where: {
            userId
          },
          required: false
        })
      }

      const nft = await instance.sequelize.models.Nft.findByPk(id, { include });

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
            },
            page: {
              type: 'number'
            },
            perPage: {
              type: 'number'
            }
          },
          required: ['search', 'page', 'perPage']
        }
      }
    },

    async (request) => {
      const { search, page, perPage } = request.query;
      const query = (search).toLowerCase();

      const limit = perPage;
      const offset = page * limit;

      const userId = request.user?.id || null;

      const include = [
        {
          model: instance.sequelize.models.User,
          as: 'author',
          attributes: ['id', 'name', 'avatarUrl'],
          required: true
        }
      ];

      if (userId) {
        include.push({
          model: instance.sequelize.models.Like,
          as: 'likes',
          attributes: ['userId'],
          where: {
            userId
          },
          required: false
        })
      }

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
              instance.sequelize.fn('LOWER', instance.sequelize.col('author.name')), {[Sequelize.Op.like]: `%${query}%`}
            )
          ]
        };
      }

      const nfts = await instance.sequelize.models.Nft.findAll({
        where,
        include,
        limit,
        offset
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

  instance.put(
    '/:id(^\\d+)/',

    {
      onRequest: instance.authenticate,
      schema: {
        body: {
          properties: {
            tokenId: {
              type: 'number',
              default: null
            },
            price: {
              type: 'string',
              default: null
            },
            userId: {
              type: 'number',
              default: null
            }
          }
        }
      }
    },

    async (request) => {
      if (!request.user.id) {
        return { success: false };
      }

      const { id } = request.params;
      const where = { id, userId: request.user.id };

      const data = {};
      if (request.body.tokenId) {
        data.tokenId = request.body.tokenId;
      }
      if (request.body.price) {
        data.price = request.body.price;
      }
      if (request.body.userId == request.user.id) {
        // FIXME: do onchain check for request.user.address
        data.userId = request.body.userId;
        data.price = null; // we must remove from sale
        delete where.userId;
      }

      if (!Object.keys(data).length) {
        return { success: false };
      }

      let result;
      try {
        result = await instance.sequelize.models.Nft.update(
          data,
          {
            where
          }
        );
      } catch (error) {
        // FIXME:
        console.log(error);
      }

      return { success: Boolean(result) };
    }
  );
}
