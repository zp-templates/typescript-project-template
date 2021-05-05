FROM node:12.22.0-alpine

WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn run build

FROM node:12.22.0-alpine

WORKDIR /usr/src/app
COPY --from=0 /usr/src/app/node_modules ./node_modules
COPY --from=0 /usr/src/app/yarn.lock ./
RUN yarn install --production=true
COPY --from=0 /usr/src/app/build ./build
CMD yarn run start