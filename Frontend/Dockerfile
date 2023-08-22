FROM node:16

WORKDIR /app

COPY package.json .

RUN npm install

CMD ["npm", "run", "build"]

COPY . /app

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]