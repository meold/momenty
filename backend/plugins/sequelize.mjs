// Note: this is NOT a plugin but rather a simple decorator.

// I.e. fastify-plugin is NOT used here because we absolutely
// need sequelize to be available immediately on index.mjs launch.
// fastify-plugin delays the instantiation leading to impossibility
// of using sequelize in a predictable mannerin the server
// initialization code.

import { init, connect } from '../models/index.mjs';

export default async function sequelize(opts) {
  // This will throw if connection fails.
  const sequelize = await connect(opts.connection);

  await init(sequelize);

  // Possibly sync db structure and code models.
  await sequelize.sync();

  return sequelize;
}
