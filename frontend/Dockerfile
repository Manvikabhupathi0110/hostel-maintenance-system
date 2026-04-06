FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Make npm installs more resilient to slow/flaky networks
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-timeout 300000

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
