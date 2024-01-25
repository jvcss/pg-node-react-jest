# base stage
FROM node:14 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# build stage
FROM base AS build
WORKDIR /app
RUN npm run build

# target stage for React.js app
FROM nginx:stable-alpine as reactjs-app
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
