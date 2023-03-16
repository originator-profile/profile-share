#!/bin/sh
exec docker compose exec --user www-data  --env WORDPRESS_ADMIN_USER wordpress \
  /workspaces/profile/packages/wordpress/e2e/teardown.sh
