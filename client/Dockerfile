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

# Copy and set up SSL renewal script
COPY ssl-renew.sh /etc/periodic/daily/ssl-renew
RUN chmod +x /etc/periodic/daily/ssl-renew

# Create log file
RUN touch /var/log/ssl-renewal.log && \
    chmod 644 /var/log/ssl-renewal.log

# Set up cron
RUN echo "0 0 * * * /etc/periodic/daily/ssl-renew" >> /etc/crontabs/root

# Expose ports
EXPOSE 80 443

# Start Nginx and crond
CMD ["sh", "-c", "crond && nginx -g 'daemon off;'"]
