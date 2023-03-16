#!/bin/sh
set -eu
cd /var/www/html
wp user delete "${WORDPRESS_ADMIN_USER}" --yes
wp plugin deactivate profile
