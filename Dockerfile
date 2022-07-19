FROM node:16 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY backend/package*.json ./

RUN npm install

COPY backend ./

COPY frontend/dist /usr/src/frontend/dist
COPY frontend/public /usr/src/frontend/public

CMD ["node", "index.mjs"]