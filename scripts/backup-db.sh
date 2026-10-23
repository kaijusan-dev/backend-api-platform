#!/bin/sh
set -eu

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/db-$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

if ! docker compose -f docker-compose-prod.yaml exec -T postgres 
  pg_dump -U postgres -d backend_api_platform > "$BACKUP_FILE"; then
  rm -f "$BACKUP_FILE"
  echo "Backup failed" >&2
  exit 1
fi

if [ ! -s "$BACKUP_FILE" ]; then
  rm -f "$BACKUP_FILE"
  echo "Backup failed: output file is empty" >&2
  exit 1
fi

echo "Backup created: $BACKUP_FILE"