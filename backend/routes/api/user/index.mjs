export default async function routes(instance) {

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

      const user = await instance.sequelize.models.User.findByPk(id);
      if (!user) {
        return { success: false };
      }

      return { success: true, user };
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
                address: {
                  type: 'string',
                },
                name: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                },
                bio: {
                  type: 'string'
                },
                twitter: {
                  type: 'string'
                },
                site: {
                  type: 'string'
                }
              },
              required: ['name', 'email', 'address']
            },
          },
          required: ['user']
        }
      }
    },

    async (request) => {

      const user = request.body.user
      user.nonce = instance.sequelize.models.User.generateNonce();

      let result;
      try {
        result = await instance.sequelize.models.User.create(user);
      } catch (error) {
        // FIXME:
        console.log(error);
      }

      if (!result) {
        return { success: false };
      }

      const token = instance.jwt.sign({
        id: result.id,
        address: result.address
      });

      return { success: true, token };
    }
  );

  instance.put(
    '/:id(^\\d+)/',

    {
      onRequest: instance.authenticate,
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
                bio: {
                  type: 'string'
                },
                twitter: {
                  type: 'string'
                },
                site: {
                  type: 'string'
                }
              },
              required: ['name', 'email']
            },
          },
          required: ['user']
        }
      },
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
    },

    async (request) => {

      const { id } = request.params;

      if (id != request.user.id) {
        return { success: false };
      }

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
