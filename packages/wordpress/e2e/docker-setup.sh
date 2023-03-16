#!/bin/sh
set -eu
cd -- "$(dirname -- "$0")/.."
docker compose exec wordpress \
  chown $(id -u):www-data /tmp/profile-test-snapshots
docker compose exec wordpress \
  chmod 775 /tmp/profile-test-snapshots
docker compose exec --user www-data --env WORDPRESS_ADMIN_USER --env WORDPRESS_ADMIN_PASSWORD wordpress \
  /workspaces/profile/packages/wordpress/e2e/setup.sh
docker compose cp \
  wordpress:/var/www/html/wp-content/credentials/profile.key.pem \
  tmp/profile-test-snapshots/profile.key.pem
