#!/bin/sh
set -e

echo "--- Initializing Chat Service ---"

echo "Generating Prisma Client..."
npx prisma generate --schema=./database/chat.prisma

echo "Syncing Database..."
npx prisma db push --schema=./database/chat.prisma --accept-data-loss

export HOST=0.0.0.0

echo "🚀 Starting Server with ts-node..."
npm start