#!/bin/sh
set -eu
docker compose exec --user www-data -w /var/www/html wordpress \
  wp core install \
  --url=http://localhost:9000/ \
  --title="Demo" \
  --admin_user=admin \
  --admin_email=admin@example.com
docker compose exec --user www-data -w /var/www/html wordpress \
  wp user update \
  admin \
  --user_pass="${WORDPRESS_ADMIN_PASSWORD}"
docker compose exec --user www-data -w /var/www/html wordpress \
  wp plugin activate \
  profile
docker compose exec wordpress \
  chgrp www-data \
  /var/www/html/wp-content/plugins/profile/tmp \
  /var/www/html/wp-content/plugins/profile/credentials
docker compose exec wordpress \
  chmod g+w \
  /var/www/html/wp-content/plugins/profile/tmp \
  /var/www/html/wp-content/plugins/profile/credentials
