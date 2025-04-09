FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
# Install certbot
RUN apk add --no-cache certbot certbot-nginx

# Create necessary directories
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/certbot

# Set permissions
RUN chown -R nginx:nginx /var/log/nginx

# Copy build files
COPY --from=build-stage /app/dist /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
