FROM node:18-alpine

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install 

COPY . ./

EXPOSE 8000

CMD ["node", "server.js"]