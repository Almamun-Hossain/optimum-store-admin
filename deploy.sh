#!/bin/bash

# Set error handling
set -e

# Check for an argument (dev or prod)
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh [dev|prod]"
    exit 1
fi

# Set environment based on argument
if [ "$1" == "dev" ]; then
    BRANCH="dev"
    ENV_FILE=".env.dev"
elif [ "$1" == "prod" ]; then
    BRANCH="main"
    ENV_FILE=".env.prod"
else
    echo "Invalid argument! Use 'dev' or 'prod'."
    exit 1
fi

# Load environment variables from the correct .env file
if [ -f "$ENV_FILE" ]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    echo "✅ Loaded environment variables from $ENV_FILE"
else
    echo "❌ Environment file $ENV_FILE not found!"
    exit 1
fi
    
# Build the project with the correct env file
echo "🏗️ Building project with $ENV_FILE..."
cp $ENV_FILE .env
npm run build
rm .env

# Deploy using Wrangler
echo "🚀 Deploying to Cloudflare Pages ($BRANCH)..."
if [ "$1" == "dev" ]; then
    wrangler pages deploy ./dist --project-name diy-admin-dev --branch $BRANCH
else
    wrangler pages deploy ./dist --project-name diy-admin-production --branch $BRANCH
fi

echo "✅ Deployment to $BRANCH successful!"
