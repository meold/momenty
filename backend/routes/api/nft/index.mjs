export default async function routes(instance) {

  instance.post(
    '/',

    // {
    //   schema: {
    //     body: {
    //       type: 'object',
    //       properties: {
    //         user: {
    //           type: 'object',
    //           properties: {
    //             name: {
    //               type: 'string'
    //             },
    //             email: {
    //               type: 'string'
    //             },
    //             title: {
    //               type: 'string'
    //             }
    //           },
    //           required: ['name', 'email', 'title']
    //         },
    //       },
    //       required: ['user']
    //     }
    //   }
    // },

    async (request) => {
      // NOTE: see https://github.com/fastify/fastify-multipart/blob/master/examples/example.js

      console.log(request.body)

      const title = request.body.title;
      const description = request.body.description;
      const { data: imageData, mimetype: imageMimeType } = request.body['image.0'][0];
      const { data: videoData, mimetype: videoMimeType } = request.body['video.0'][0];

      let result;
      try {
        result = await instance.sequelize.models.Nft.create({ title, description, imageData, imageMimeType, videoData, videoMimeType });
      } catch (error) {
        // FIXME:
        console.log(error);
      }

      return { success: Boolean(result) };
    }
  );

};