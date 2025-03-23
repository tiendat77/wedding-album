#################################################
# STAGE 1: Build
#################################################
ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /workspace

COPY package*.json .

RUN npm pkg delete scripts.prepare
RUN yarn

ENV NODE_ENV=production

COPY . .
RUN yarn build

#################################################
# STAGE 2: Run
#################################################
FROM nginx:alpine

COPY .ci/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /workspace/dist/ /usr/share/nginx/html

EXPOSE 80