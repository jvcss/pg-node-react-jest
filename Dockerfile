# base stage
FROM node:14 as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# development stage
FROM base as development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# production stage
FROM base as production
ENV NODE_ENV=production
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]

# target stage for Node.js server
FROM node:14-alpine as nodejs-server
WORKDIR /app
COPY --from=production /app .
CMD ["npm", "start"]
