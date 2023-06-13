# Dockerfile

# base image
FROM node:alpine

# create and set working directory
WORKDIR /app

COPY server/package.json .
COPY server/package-lock.json .

# install dependencies
RUN npm ci

# copy source files
COPY . .

# start application
EXPOSE 5200
CMD npx ts-node server/src/server.ts