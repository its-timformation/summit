#!/usr/bin/env bash
# Deploy Summit to Cloudflare Pages.
# First time:  npm i -g wrangler && wrangler login
# Then:        ./deploy.sh
set -e
PROJECT="summit"
echo "Deploying Summit to Cloudflare Pages (project: $PROJECT)…"
wrangler pages deploy . --project-name "$PROJECT"
echo "Done. Your live URL is printed above (https://$PROJECT.pages.dev)."
