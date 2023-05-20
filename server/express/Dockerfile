FROM node:18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY server.js ./
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes

EXPOSE 3000
CMD ["npm", "run", "start"]
