import TronWeb from 'tronweb';

export default async function routes(instance) {

  instance.get(
    '/:address/',

    async (request) => {

      const address = request.params.address;

      const result = await instance.sequelize.models.User.findOne({
        where: {
          address
        },
      }, { raw: true });

      return { success: true, isExist: Boolean(result) };
    }
  );

  instance.get(
    '/:address/nonce/',

    async (request) => {

      const address = request.params.address;

      const user = await instance.sequelize.models.User.findOne({
        where: {
          address
        },
      });

      if (!user) {
        return { success: false };
      }

      return { success: true, nonce: user.nonce };
    }
  );

  instance.post(
    '/:address/',

    {
      schema: {
        body: {
          properties: {
            signedMessage: {
              type: 'string'
            }
          },
          required: ['signedMessage']
        }
      }
    },

    async (request) => {

      const address = request.params.address;

      const user = await instance.sequelize.models.User.findOne({
        where: {
          address
        },
      });

      if (!user) {
        return { success: false };
      }

      const messsage = `Nonce:${user.nonce}`;

      const isValid = TronWeb.Trx.verifySignature(TronWeb.toHex(messsage), TronWeb.address.toHex(address), request.body.signedMessage);

      if (!isValid) {
        return { success: false };
      }

      // Change user nonce
      await user.updateNonce();

      const token = instance.jwt.sign({
        id: user.id,
        address: user.address
      });

      return { success: true, token };
    }
  );
}
