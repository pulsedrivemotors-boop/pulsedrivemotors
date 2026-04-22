#!/bin/sh
set -e

echo "Running database migrations..."
prisma migrate deploy

echo "Starting server..."
exec node server.js
