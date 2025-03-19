# Story Customization Platform - Deployment Configuration

This directory contains the necessary configuration files for deploying the Story Customization Platform as a permanent interactive website.

## Deployment Strategy

We'll use the following approach:
1. Deploy the frontend as a static website
2. Deploy the backend as a Node.js application
3. Set up a PostgreSQL database for production
4. Configure environment variables for production
5. Set up proper routing and CORS settings

## Files Included

- `next.config.js`: Configuration for Next.js frontend
- `vercel.json`: Configuration for Vercel deployment
- `.env.production`: Production environment variables (template)
- `docker-compose.yml`: Docker configuration for local testing
- `nginx.conf`: Nginx configuration for production
