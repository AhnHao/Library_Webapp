FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
# Install certbot
RUN apk add --no-cache certbot certbot-nginx

# Copy build files
COPY --from=build-stage /app/dist /usr/share/nginx/html/

# Create directory for certbot
RUN mkdir -p /var/www/certbot

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80 443

# Add script to handle SSL renewal
COPY ssl-renew.sh /etc/periodic/daily/ssl-renew
RUN chmod +x /etc/periodic/daily/ssl-renew

# Start Nginx and crond
CMD ["sh", "-c", "crond && nginx -g 'daemon off;'"]
