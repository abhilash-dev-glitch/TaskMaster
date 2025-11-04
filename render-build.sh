#!/usr/bin/env bash
# exit on error
set -o errexit

# Install server dependencies
cd server
npm install

# Install client dependencies and build
cd ../client
npm install
npm run build