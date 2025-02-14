FROM node:20.9.0-alpine as dev

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 80

CMD [ "yarn", "run", "dev", "--", "--port", "80" ]
