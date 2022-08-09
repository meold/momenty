export default async function routes(instance) {

  instance.post(
    '/',

    {
      onRequest: instance.authenticate,
      schema: {
        body: {
          properties: {
            nftId: {
              type: 'number',
              default: null
            }
          },
          required: ['nftId']
        }
      }
    },

    async (request) => {
      const { nftId } = request.body;
      const userId = request.user.id;

      const destroyed = await instance.sequelize.models.Like.destroy({
        where: {
          userId,
          nftId
        }
      });

      if (destroyed) {
        return { success: true, isLiked: false };
      }

      await instance.sequelize.models.Like.create({ userId, nftId });
      return { success: true, isLiked: true };
    }
  );

}
