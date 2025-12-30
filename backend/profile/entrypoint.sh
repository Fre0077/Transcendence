#!/bin/sh
set -e

echo "--- Initializing Profile Service ---"

echo "Generating Prisma Client..."
npx prisma generate --schema=./database/profile.prisma

echo "Syncing Database..."
npx prisma db push --schema=./database/profile.prisma --accept-data-loss

export HOST=0.0.0.0

echo "🚀 Starting Server with ts-node..."
npm start