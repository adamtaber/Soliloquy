FROM node:18.15.0-bullseye-slim

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

CMD ["npm", "run", "dev"]