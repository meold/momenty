import 'dotenv/config';
import { Sequelize } from 'sequelize';

const { User } = await import('./User.model.mjs');

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

await sequelize.sync();