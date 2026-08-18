# Deployment Guide

LeadPilot is designed for easy deployment. You can deploy it completely via Docker, or use a split architecture with Vercel for the frontend and Railway for the backend services.

## Docker Deployment (Recommended for self-hosting)

The repository includes a `Dockerfile` and a `docker-compose.production.yml`.

1. **Build and Run:**
   ```bash
   docker-compose -f docker-compose.production.yml up -d --build
   ```
2. **Environment Variables:** Ensure a `.env` file is present alongside the compose file with all production keys.

## Vercel + Railway Deployment (Recommended for scalability)

### 1. Database & Redis (Railway)
- Provision a **PostgreSQL** database on Railway.
- Provision a **Redis** instance on Railway.
- Copy their internal or external connection strings to use as `DATABASE_URL` and `REDIS_URL`.

### 2. Frontend (Vercel)
- Connect your GitHub repository to Vercel.
- Set the framework preset to Next.js.
- Add all required environment variables in the Vercel dashboard.
- Set the Build Command to `npx prisma generate && next build`.

### 3. Worker Processes
LeadPilot relies on background jobs (sending emails, researching leads).
- If deploying to Vercel, use Vercel Cron Jobs to trigger API routes that process queues.
- Alternatively, run a separate Node.js worker instance on Railway that pulls from Redis and executes tasks.

## Environment Variable Setup

Ensure the following are set in production:
- `NODE_ENV=production`
- `NEXTAUTH_URL=https://yourdomain.com`
- `DATABASE_URL` and `REDIS_URL`

## Database Migrations

Run database migrations before starting the application:
```bash
npx prisma migrate deploy
```
*Note: In Vercel, this is usually handled via a custom build step or run manually.*

## Monitoring & Health Checks

- Implement uptime monitoring (e.g., UptimeRobot) pointing to `/api/health`.
- Recommend integrating Sentry for error tracking.

## Cost Estimates

- **Vercel:** Free tier for hobby, Pro ($20/mo) for higher limits.
- **Railway:** ~$5-$20/mo depending on database usage.
- **Resend:** Free up to 3k emails/mo, Pro ($20/mo) for 50k emails.
