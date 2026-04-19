---
status: completed
phase: 04-deployment-verification
requirements_addressed: [DEPL-01, DEPL-02, DEPL-03, DEPL-04]
dependencies: []
---

# Plan 01: Deployment Readiness

## Objective
Implement health checks, log redaction, standard environment variables binding, and npm package scripts to make the app ready for Render deployment.

## Implementation Steps

1. **Express & Health Endpoint**
   - In `index.js`, add `app.get('/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));`.
   - Ensure the `app.listen()` call binds to `process.env.PORT || 3000`. It currently does, but let's confirm it gracefully starts on `0.0.0.0` or defaults correctly for Render.

2. **Pino Verification & Redaction**
   - In `index.js`, update `pino-http` configuration.
   - Add `redact: ['req.headers.authorization', 'req.headers["x-hub-signature-256"]']`. This hides token data from standard HTTP logging.

3. **npm Scripts**
   - In `package.json`, inside the `"scripts"` block, ensure it has:
     - `"start": "node index.js"`
     - `"test": "node verify.js"`

## Verification
- Run `npm test` to see if tests pass.
- Hit `GET /health` on the local server to verify uptime structure.
- Verify logs do not leak auth tokens in headers.
