# networking-bot2

A minimal Next.js app that exposes a Rolodex UI and proxies API requests to an n8n webhook.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:

   - `N8N_WEBHOOK_URL` – URL of the n8n webhook that handles Rolodex actions.
   - `N8N_BASIC_AUTH` – *(optional)* value for the `Authorization` header.

## Development

Start the dev server:

```bash
npm run dev
```

## Production

Create a production build and start it:

```bash
npm run build
npm start
```
