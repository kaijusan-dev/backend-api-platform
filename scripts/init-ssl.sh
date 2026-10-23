#!/bin/sh
set -eu

DOMAIN="kaijusan.tech"
EMAIL="kaijusan.dev@gmail.com"

docker compose -f docker-compose-prod.yaml run --rm --entrypoint certbot certbot \
  certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"
