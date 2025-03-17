FROM node:16.15.0-alpine As development

ARG SERVICE_NAME
ARG DB_NAME

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./
RUN npm install
EXPOSE 3000

CMD ["sh", "./service.entrypoint.sh"]
