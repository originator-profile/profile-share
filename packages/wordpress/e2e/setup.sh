#!/bin/sh
set -eu
cd /var/www/html
wp core install \
  --url=http://localhost:9000/ \
  --title="Demo" \
  --admin_user=admin \
  --admin_email=admin@example.com
wp user create "${WORDPRESS_ADMIN_USER}" "${WORDPRESS_ADMIN_USER}@example.com" \
  --role=administrator \
  --user_pass="${WORDPRESS_ADMIN_PASSWORD}"
wp plugin activate profile
