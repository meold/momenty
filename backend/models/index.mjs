import 'dotenv/config';
import { Sequelize } from 'sequelize';

const { User } = await import('./User.model.mjs');
const { Nft } = await import('./Nft.model.mjs');

const options = {
  logging: false,
  define: {
    freezeTableName: true
  },
  dialectOptions: {
    decimalNumbers: true
  }
};

export const sequelize = new Sequelize(process.env.SQL, options);

// actually try to connect
await sequelize.authenticate();

sequelize.query('SET CHARACTER SET utf8mb4');
sequelize.query('SET NAMES UTF8mb4');

User.init(User.structure, { ...User.options, sequelize });
Nft.init(Nft.structure, { ...Nft.options, sequelize });

await sequelize.sync();