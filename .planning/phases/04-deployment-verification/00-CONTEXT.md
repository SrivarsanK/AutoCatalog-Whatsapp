# Phase 4: Deployment & Verification Context

## 1. Goal
Make the AutoCatalog WhatsApp Bot ready for production deployment on Render, and ensure end-to-end testing coverage using a verification script.

## 2. Requirements Addressed
- DEPL-01: Support `PORT` env var binding and general env config
- DEPL-02: Add health check endpoint (`/health`) returning 200 OK
- DEPL-03: Add `start` and `test` scripts in `package.json`
- DEPL-04: Configure `pino` logger to redact sensitive data (WA_TOKEN, PHONE_ID)
- UAT-01: End-to-end testing script representing actual usage flows

## 3. Decisions & Gray Areas Handled
### 3.1. Health Endpoint
Render requires a simple health check to determine if the web service is live. We will expose `GET /health` that simply returns `{ status: 'ok', uptime: process.uptime() }`.

### 3.2. Data Redaction (Pino)
Sensitive tokens like `WA_TOKEN` should never be logged during production. We'll use `pino` redact capabilities on fields named `req.headers.authorization`, `token`, and any WhatsApp payload containing API keys.

### 3.3. Test Script
We already have `verify.js` from Phase 2/3. We will evolve it into a proper E2E script accessible via `npm test`.

### 3.4. Render Environment
Ensure `index.js` listens on `process.env.PORT || 3000` and configures ESM correctly in `package.json`.

## Code context to read during planning
- `index.js` for adding the health check and standardizing PORT.
- Server instantiation file where pino logger is configured.
- `package.json` to insert NPM scripts.
