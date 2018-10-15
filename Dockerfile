FROM node:8-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --production

COPY src src

EXPOSE 3000
CMD npm start
