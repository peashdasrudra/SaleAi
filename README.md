# LeadPilot

A production-ready B2B outreach management platform built for AiExpertLabs. Import prospects, research and score them, generate personalized cold emails with AI, manage compliant email sequences, detect replies, and track everything in one dashboard.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Redis](https://img.shields.io/badge/Redis-7-red)
![Prisma](https://img.shields.io/badge/Prisma-6-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)

## Features

1. **Prospect Management:** Import, deduplicate, and organize leads.
2. **AI Enrichment:** Automatically research and score prospects based on web data.
3. **Personalized Outreach:** Generate highly personalized cold emails using AI (OpenAI/Anthropic).
4. **Campaign Management:** Multi-step sequences with automated follow-ups.
5. **Reply Detection:** Automatically track and categorize incoming replies.
6. **Deliverability Protection:** Built-in volume controls, warm-up, and bounce handling.
7. **Compliance Tools:** Opt-out management, suppression lists, and required footer text.
8. **Multi-Channel Notifications:** Alerts via Email, Slack, Telegram, or in-app.
9. **Analytics:** Track opens, clicks, replies, and conversions.
10. **Multi-Tenancy:** Manage multiple workspaces and domains.

## Prerequisites

- Node.js 20+
- Docker Desktop
- pnpm or npm

## Quick Start

1. **Clone repo:**
   ```bash
   git clone <repository-url>
   cd SaleAi
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start databases:**
   ```bash
   docker-compose up -d
   ```
4. **Copy env:**
   ```bash
   cp .env.example .env.local
   ```
   *Then configure your environment variables in `.env.local`.*
5. **Generate Prisma:**
   ```bash
   npx prisma generate
   ```
6. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```
7. **Seed data:**
   ```bash
   npx prisma db seed
   ```
8. **Start dev:**
   ```bash
   npm run dev
   ```
9. **Open:** [http://localhost:3000](http://localhost:3000)
10. **Login:** admin@aixpertlabs.com / admin123

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js |
| `NEXTAUTH_URL` | Base URL for the app |
| `RESEND_API_KEY` | API key for Resend email provider |
| `OPENAI_API_KEY` | API key for OpenAI |
| `NOTIFICATION_EMAIL` | Email to receive system alerts |
| `TELEGRAM_BOT_TOKEN` | Token for Telegram bot alerts |
| `TELEGRAM_CHAT_ID` | Chat ID for Telegram alerts |
| `SLACK_WEBHOOK_URL` | Webhook URL for Slack alerts |

## Project Structure

- `/src/app`: Next.js 15 App Router pages and API routes
- `/src/components`: Reusable UI components (shadcn/ui)
- `/src/lib`: Core business logic, services, and utilities
- `/prisma`: Database schema and migrations
- `/docs`: Additional documentation

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build production application
- `npm run lint`: Run ESLint
- `npx prisma studio`: Open Prisma database GUI

## Email Setup

Ensure high deliverability by configuring:
- **SPF** (Sender Policy Framework)
- **DKIM** (DomainKeys Identified Mail)
- **DMARC** (Domain-based Message Authentication, Reporting, and Conformance)
*See [docs/EMAIL-SETUP.md](docs/EMAIL-SETUP.md) for a detailed checklist.*

## Deployment

LeadPilot can be deployed using Docker, or via a combination of Vercel (Frontend) and Railway (Backend/Databases).
*See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full instructions.*

## Compliance

Ensure you adhere to B2B email regulations (CAN-SPAM, GDPR, PECR).
*See [docs/COMPLIANCE.md](docs/COMPLIANCE.md) for our compliance guidelines.*

## License

MIT License
