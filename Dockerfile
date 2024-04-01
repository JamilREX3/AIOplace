FROM node:18

ENV NODE_ENV=production

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . /

ENV PORT 8080

EXPOSE 8080

CMD [ "npm", "run" , "start:prod" ]