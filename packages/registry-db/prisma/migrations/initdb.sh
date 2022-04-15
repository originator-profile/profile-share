#!/bin/bash
set -eux
for f in /docker-entrypoint-initdb.d/*/migration.sql; do
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -f "$f"
done
