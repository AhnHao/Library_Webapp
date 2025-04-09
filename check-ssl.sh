#!/bin/bash
# Script kiểm tra trạng thái SSL

# Kiểm tra chứng chỉ
echo "Checking SSL certificates..."
docker-compose exec frontend certbot certificates

# Kiểm tra logs
echo -e "\nChecking SSL renewal logs..."
docker-compose exec frontend cat /var/log/ssl-renewal.log

# Kiểm tra Nginx config
echo -e "\nChecking Nginx configuration..."
docker-compose exec frontend nginx -t