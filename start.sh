#!/bin/sh
set -e

echo "Running database migrations..."
prisma migrate deploy --schema=/app/prisma/schema.prisma --url="$DATABASE_URL"

echo "Starting server..."
exec node server.js
