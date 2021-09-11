### STAGE 1: Build ###
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/reservation-calendar /usr/share/nginx/html