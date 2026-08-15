# Build stage
FROM node:20-alpine AS build

WORKDIR /app

ARG REACT_APP_AUTH_API_URL
ARG REACT_APP_TUTORING_API_URL
ENV REACT_APP_AUTH_API_URL=$REACT_APP_AUTH_API_URL
ENV REACT_APP_TUTORING_API_URL=$REACT_APP_TUTORING_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve stage
FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
