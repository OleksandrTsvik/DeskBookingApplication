FROM node:22-alpine
WORKDIR /app
EXPOSE 4200

COPY package*.json .

RUN npm install -g @angular/cli
RUN npm ci

COPY . .

CMD ["ng", "serve", "--host", "0.0.0.0"]