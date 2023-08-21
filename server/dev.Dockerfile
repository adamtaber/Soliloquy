FROM node:18.15.0-bullseye-slim

WORKDIR /usr/src/app

# COPY --chown=node:node . .

COPY . .

RUN npm install

RUN npm run compile

# CMD ["npm", "run", "dev"]
CMD ["npm", "start"]
