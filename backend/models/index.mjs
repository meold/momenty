import path from 'path';
import Sequelize from 'sequelize';
import fs from 'fs';

export async function init(sequelize) {
  const u = new URL(import.meta.url);
  const dirname = path.dirname(u.pathname);

  const files = fs.readdirSync(dirname);

  const jsModules = files.filter(filename => filename.endsWith('.model.mjs'));
  for (const jsModule of jsModules) {
    const { default: model } = await import('./' + jsModule);
    model.init(model.modelAttributes(), model.modelOptions(sequelize));
  }

  const models = sequelize.models;

  for (const name of Object.keys(models)) {
    if ('associate' in models[name]) {
      models[name].associate(sequelize);
    }
  }

  sequelize.query('SET CHARACTER SET utf8mb4');
  sequelize.query('SET NAMES UTF8mb4');
}

/**
 * Create sequelize instance.
 *
 * @param {String} connectionString - sequelize connection string, like 'mysql://root:root@localhost/decembre'
 * @returns {Sequelize} sequelize instance
 */
 export async function connect(connectionString) {
  const options = {
    logging: false,
    define: {
      freezeTableName: true
    },
    dialectOptions: {
      decimalNumbers: true
    }
  };

  // You might need that in rare cases (macOS I'm looking at you)
  // options.dialectOptions = {
  //   socketPath: app.get('mysqlSocketPath')
  // };

  const sequelize = new Sequelize(connectionString, options);

  // Actually try to connect. Do not catch, let it throw.
  await sequelize.authenticate();

  return sequelize;
}