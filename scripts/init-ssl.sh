#!/bin/sh
set -eu

DOMAIN="${1:?Usage: ./scripts/init-ssl.sh <domain> <email>}"
EMAIL="${2:?Usage: ./scripts/init-ssl.sh <domain> <email>}"

docker compose -f docker-compose-prod.yaml run --rm --entrypoint certbot certbot \
  certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"
