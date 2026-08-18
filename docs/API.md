# LeadPilot API Documentation

All endpoints are relative to `/api`.

## Authentication
Currently, all endpoints use session-based authentication via NextAuth. You must be authenticated in the browser or provide a valid session cookie.

## Response Format
**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```
**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Prospects
- `GET /api/prospects` - List prospects (supports pagination, filtering)
- `POST /api/prospects` - Create a prospect
- `POST /api/prospects/import` - Bulk import prospects (CSV/JSON)
- `POST /api/prospects/:id/research` - Trigger AI research
- `POST /api/prospects/:id/score` - Calculate lead score
- `POST /api/prospects/:id/generate-email` - Generate draft email
- `POST /api/prospects/:id/approve-email` - Approve a generated email

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create a campaign
- `POST /api/campaigns/:id/launch` - Start campaign
- `POST /api/campaigns/:id/pause` - Pause campaign
- `POST /api/campaigns/:id/resume` - Resume campaign

### Webhooks (Public)
- `POST /api/webhooks/resend` - Receive delivery events (opens, clicks, bounces)
- `POST /api/webhooks/inbound` - Receive inbound replies

### Analytics
- `GET /api/analytics` - Get high-level stats (sent, opened, replied rates)

### Suppression
- `GET /api/suppression` - List suppressed emails/domains
- `POST /api/suppression` - Add to suppression list

### Audit Log
- `GET /api/audit` - List system actions and events
