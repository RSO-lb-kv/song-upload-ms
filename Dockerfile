FROM node:10.16.3

RUN mkdir /app

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

EXPOSE 3002

CMD ["node", "dist/main.js"]
