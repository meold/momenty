export default async function routes(instance) {
  instance.get(
    '/',

    {
      schema: {
        query: {
          type: 'object',
          properties: {
            limit: {
              type: 'number'
            },
            offset: {
              type: 'number'
            },
            sort: {
              type: 'string'
            },
            direction: {
              type: 'string'
            }
          },
          required: ['limit', 'offset']
        }
      }
    },

    async (request) => {
      const options = {
        limit: request.query.limit,
        offset: request.query.offset
      };

      if (request.query.sort) {
        options.order = [[ request.query.sort, request.query.direction == 'DESC' ? 'DESC' : 'ASC' ]];
      }

      const result = await instance.sequelize.models.User.findAndCountAll(options);

      return { success: true, ...result };
    }
  );

  instance.post(
    '/',

    {
      schema: {
        body: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              required: ['name', 'email', 'title']
            },
          },
          required: ['user']
        }
      }
    },

    async (request) => {
      let result;
      try {
        result = await instance.sequelize.models.User.create(request.body.user);
      } catch (error) {
        // FIXME:
        console.log(error);
      }

      return { success: Boolean(result) };
    }
  );

  instance.put(
    '/:id(^\\d+)/',

    {
      schema: {
        body: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              required: ['name', 'email', 'title']
            },
          },
          required: ['user']
        }
      }
    },

    async (request) => {
      const { id } = request.params;
      let result;
      try {
        result = await instance.sequelize.models.User.update(
          request.body.user,
          {
            where: { id }
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
