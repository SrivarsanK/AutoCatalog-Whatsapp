# Research: Deployment & Verification

## Health Checking on Render
- Render relies on web services binding to `0.0.0.0:$PORT`.
- A simple Express `app.get('/health', ...)` returning 200 OK satisfies Render's deploy check.
- Returning `{ status: 'ok', uptime: process.uptime() }` adds observability.

## Log Redaction (Pino)
- `pino` accepts a `redact` array parameter: `['req.headers.authorization', 'req.headers.wa_token']`.
- If we want to hide WA_TOKEN or API keys in bodies, we can also redact `body.interactive.action.catalog_id` or similar if they are considered sensitive, but Meta specifically requires `Authorization: Bearer <TOKEN>` to be redacted.

## package.json Scripts
- `npm start` -> `node index.js`
- `npm test` -> `node verify.js`
