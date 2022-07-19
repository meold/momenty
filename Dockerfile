FROM node:16

WORKDIR /usr/src/app

COPY backend ./

RUN npm install

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY frontend-dist /usr/src/frontend-dist

CMD ["node", "index.mjs"]