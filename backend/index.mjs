import 'dotenv/config';
import path from 'path';
import Fastify from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import fastifyStatic from '@fastify/static';
import FastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import FastifyHttpProxy from '@fastify/http-proxy';
import fastifyJwt from '@fastify/jwt';
import url from 'url';
import { v4 as uuidv4 } from 'uuid';
import pinoms from 'pino-multi-stream';
import sequelize from '../backend/plugins/sequelize.mjs';

const isProduction = process.env.NODE_ENV === 'production';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const fastify = Fastify({
  logger: pinoms(pinoms.multistream([
    {
      level: 'debug',
      stream: pinoms.prettyStream({
        prettyPrint: {
          colorize: true,
          translateTime: "SYS:standard"
        }
      })
    }
  ])),
  genReqId() {
    return uuidv4();
  }
});

fastify.register(FastifyCors, {});
fastify.register(fastifyMultipart, {
  addToBody: true
});

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET
})

fastify.decorate('sequelize', await sequelize({
  connection: process.env.SQL_CONNECTION
}));

fastify.register(fastifyAutoload, {
  dir: path.resolve(__dirname, 'routes'),
  dirNameRoutePrefix: true,
  autoHooks: true,
  cascadeHooks: true
});

// Check health
fastify.get(
  '/health/',

  { logLevel: 'warn' },

  async (request, reply) => {
    if (request.url == '/health') {
      reply.sendStatus(404);
      return;
    }

    let isDatabaseConnectionHealthy = false;

    try {
      const check = await fastify.sequelize.query('SELECT 1+1 AS result', { type: fastify.sequelize.QueryTypes.SELECT });
      isDatabaseConnectionHealthy = check && check.length == 1 && check[0].result == 2;
    } catch (e) {
      isDatabaseConnectionHealthy = false;
    }

    if (!isDatabaseConnectionHealthy) {
      reply.sendStatus(500);
    }

    reply.code(200).type('text').send('OK\n');
  }
);

if (isProduction) {
  // We're in production, so all frontend assets are built, just serve them static.
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'frontend-dist'), // must be the same as in vite.config.js
    prefix: '/'
  });

} else {
  fastify.register(FastifyHttpProxy, {
    upstream: process.env.VITE_URL
  });
}

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