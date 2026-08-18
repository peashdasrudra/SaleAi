# Free Deployment & Local Setup Guide

Since we are bypassing Docker, we will use **free cloud databases** for both local development and production deployment. This setup is 100% free and requires no credit card.

## 1. Create Your Cloud Databases

### PostgreSQL (Neon)
1. Go to [Neon.tech](https://neon.tech/) and sign up for a free account.
2. Create a new project (e.g., `SaleAi`).
3. Once created, copy the **Connection String** from your dashboard. It should look like this:
   `postgresql://username:password@ep-cold-sun-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. This will be your `DATABASE_URL` and `DIRECT_URL`.

### Redis (Upstash)
1. Go to [Upstash.com](https://upstash.com/) and sign up for free.
2. Create a new **Redis Database**.
3. In your database dashboard, scroll down to the **Node.js / ioredis** section and copy the connection URL. It will look like this:
   `redis://default:password@eu2-helmsman-12345.upstash.io:32456`
4. This will be your `REDIS_URL`.

---

## 2. Run the App Locally (No Docker Required)

Open the `.env.local` file in your code editor and update the following variables with the URLs you just copied:

```env
# Database (PostgreSQL from Neon)
DATABASE_URL="your-neon-connection-string-here"
DIRECT_URL="your-neon-connection-string-here"

# Redis (from Upstash)
REDIS_URL="your-upstash-connection-string-here"

# Don't forget to add these!
AI_API_KEY="your-openai-api-key"
EMAIL_API_KEY="your-resend-api-key"
```
## 2. Deploy for Free on Render

To host the app permanently on the internet for free—without needing to install or run anything on your own computer—we've added a `start:all` script to your `package.json` that runs both the Next.js server and your background workers in a single instance. 

1. **Push your code to GitHub** (if you haven't already).
2. Go to [Render.com](https://render.com/) and create a free account.
3. Click **New +** and select **Web Service**.
4. Connect your GitHub account and select your repository.
5. Configure the Web Service:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:all`
   - **Instance Type:** `Free`
6. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL` and `DIRECT_URL` (from Neon)
   - `REDIS_URL` (from Upstash)
   - `AI_API_KEY` (from OpenAI)
   - `EMAIL_API_KEY` (from Resend)
   - `AUTH_SECRET` (generate a random string)
   - `AUTH_URL` and `APP_URL` (set these to the URL Render gives you, e.g., `https://saleai-app.onrender.com`).
7. Click **Create Web Service**. Wait for the build and deployment to finish.

---

## 3. Setup the Database (One-time only)

Since you are not running anything locally, you'll run the initial database setup directly inside the cloud server:

1. In your Render dashboard, click on your newly deployed Web Service.
2. Go to the **Shell** tab on the left menu.
3. Once the shell connects, type the following commands one by one and hit enter:

   ```bash
   # 1. Apply the database schema to Neon
   npx prisma migrate deploy

   # 2. Seed the database with the default admin account and test data
   npm run prisma:seed
   ```

Your app is now 100% cloud-hosted and ready to use! You can log in at your Render URL with `admin@aixpertlabs.com / admin123`.

> [!WARNING]
> Free instances on Render will "spin down" after 15 minutes of inactivity. This means your first request after a period of inactivity might take 30 seconds to load, and scheduled background campaigns will only process when the instance is awake. If you need it running 24/7 without delays, you'll need to upgrade to a paid tier.
