#!/bin/sh
# Script tự động gia hạn SSL và reload Nginx

# Gia hạn chứng chỉ
certbot renew --quiet

# Reload Nginx để áp dụng chứng chỉ mới
nginx -s reload

# Log kết quả
echo "SSL renewal attempted at $(date)" >> /var/log/ssl-renewal.log