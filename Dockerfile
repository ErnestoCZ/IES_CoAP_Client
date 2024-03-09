FROM node:20.11.0 as BUILD

COPY src .
COPY package.json .
COPY tsconfig.json .

RUN npm install && npx tsc -p ./tsconfig.json


FROM node:20.11.0

WORKDIR /app

COPY --from=BUILD dist dist
COPY package.json .
RUN npm install --save

EXPOSE 5683

CMD [ "node","./dist/app.js" ]