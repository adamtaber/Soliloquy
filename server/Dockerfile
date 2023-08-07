FROM node:18.15.0-bullseye-slim

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

CMD ["npm", "start"]