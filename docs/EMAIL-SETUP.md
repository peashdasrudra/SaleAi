# Email Setup & Deliverability Guide

To ensure your cold outreach lands in the primary inbox, follow these critical setup steps.

## 1. Domain Setup
- **Do not use your primary domain.** Use a secondary domain or subdomain (e.g., `hello.yourdomain.com` or `yourdomainhq.com`).
- This protects your main domain's reputation in case of spam complaints.

## 2. Authentication Records (DNS)

You must configure these records at your domain registrar:

### SPF (Sender Policy Framework)
Authorizes your email provider (e.g., Resend, Google Workspace) to send on your behalf.
- **Type:** TXT
- **Name:** `@` (or subdomain)
- **Value:** `v=spf1 include:_spf.google.com include:sendgrid.net ~all` *(example)*

### DKIM (DomainKeys Identified Mail)
Signs your emails cryptographically. Your provider will give you a specific record to add.
- **Type:** CNAME or TXT (varies)

### DMARC (Domain-based Message Authentication)
Tells receiving servers what to do if SPF or DKIM fails.
- **Type:** TXT
- **Name:** `_dmarc`
- **Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com;`

## 3. Warmup Schedule

Never send high volumes immediately from a new domain.
- **Week 1:** 5-10 emails / day
- **Week 2:** 15-20 emails / day
- **Week 3:** 30-40 emails / day
- **Week 4:** 50+ emails / day (cap at ~200/day per inbox for safety).

## 4. Monitoring & Bounces
- Keep bounce rates under 2%.
- Keep spam complaint rates under 0.1%.
- LeadPilot will automatically pause campaigns if bounce limits are exceeded.

## Best Practices
- Avoid spam trigger words ("Free", "Buy now", excessive capitalization).
- Always include a clear opt-out mechanism.
- Personalize emails (use LeadPilot's AI features).
