#!/bin/sh
set -e

npm install --no-audit --no-fund

npm run generate || true
npm run push || true

export HOST=0.0.0.0

npm start