#!/bin/sh
set -e

echo "--- Initializing Auth Service ---"

echo "Generating Prisma Client..."
npx prisma generate --schema=./database/auth.prisma

echo "Syncing Database..."
npx prisma db push --schema=./database/auth.prisma --accept-data-loss

export HOST=0.0.0.0

echo "🚀 Starting Server with ts-node..."
npm start