#!/bin/sh
set -e

echo "Running database migrations..."
node /app/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma

echo "Starting server..."
exec node server.js
