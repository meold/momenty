import 'dotenv/config';
import path from 'path';
import Fastify from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import FastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import { sequelize } from './models/index.mjs';

const isProduction = process.env.NODE_ENV === 'production';

let logger = false;

if (!isProduction) {
  logger = {
    transport: {
      target: 'pino-pretty'
    }
  };
}

const fastify = Fastify({
  logger
});

fastify.register(FastifyCors);
fastify.register(fastifyMultipart, {
  addToBody: true
});

fastify.decorate('sequelize', sequelize);

fastify.get('/', async () => {
  return {
    stone: 'Stone',
    bayraktar: 'Bayraktar',
    himars: 'Himars',
    harpoon: 'Harpoon'
  };
});

fastify.get('/api', async () => {
  return {
    api: 'Called'
  };
});

fastify.register(fastifyAutoload, {
  dir: path.resolve('.', 'routes'),
  dirNameRoutePrefix: true,
  autoHooks: true,
  cascadeHooks: true
});

fastify.setErrorHandler(async (error, _request, reply) => {
  console.error("Caught error:");
  console.error(error);
  // FIXME: catch sequelize errors here ???
  if (error.validation) {
    reply.status(422).send(new Error('validation failed'));
    return;
  }
  throw new Error();
});

fastify.listen(
  {
    port: process.env.LISTEN_PORT,
    host: process.env.LISTEN_HOST
  },
  (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(`server listening on ${address}`);

    if (process.send) {
      process.send('ready');
    }
  }
);