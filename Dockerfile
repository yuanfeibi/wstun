FROM node:carbon-alpine

RUN npm install -g --unsafe @mdslab/wstun \
 && npm cache --force clean

ENV NODE_PATH=/usr/local/lib/node_modules

WORKDIR /usr/bin/

ENTRYPOINT ["wstun"]

