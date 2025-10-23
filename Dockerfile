FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i 

COPY src/ ./src/

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "src/index.js"]