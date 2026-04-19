# Roadmap: AutoCatalog WhatsApp Bot

**Created:** 2026-04-19
**Granularity:** Coarse
**Phases:** 4
**Requirements:** 37

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Webhook & Core Messaging | Working webhook + text replies | SRVR-01..06, MSG-01, MSG-05, HNDL-01, HNDL-02 | 4 |
| 2 | Catalog Engine | Fetch, cache, search Google Sheets + product messages | CATL-01..08, MSG-02..04, HNDL-03..06 | 5 |
| 3 | Multi-Language & Admin | i18n support (EN/HI/TA) + admin error notifications | LANG-01..04, ADMN-01..04 | 4 |
| 4 | Deploy & Documentation | Render deployment + docs + .env setup | DEPL-01..04 | 3 |

---

## Phase 1: Webhook & Core Messaging

**Goal:** Express server handles Meta webhook verification and sends text replies to incoming messages.

**Requirements:**
- SRVR-01: Express server on configurable PORT
- SRVR-02: GET /webhook Meta verification
- SRVR-03: POST /webhook extract sender + text
- SRVR-04: Always return 200
- SRVR-05: Pino structured logging
- SRVR-06: Error catching — no crashes
- MSG-01: sendText function
- MSG-05: Bearer token auth header
- HNDL-01: Empty message → welcome text
- HNDL-02: Greeting → usage instructions

**Success Criteria:**
1. ngrok-exposed webhook passes Meta verification handshake
2. Bot replies "Welcome" when user sends empty or greeting message
3. Server logs all requests as structured JSON
4. Malformed webhook payloads don't crash server

**Files created:** `index.js`, `whatsapp.js` (sendText only), `handler.js` (greetings only), `package.json`, `.env.example`

---

## Phase 2: Catalog Engine

**Goal:** Fetch product catalog from Google Sheets, search by keyword, send native product cards/lists.

**Requirements:**
- CATL-01: Fetch CSV from Google Sheets URL
- CATL-02: Parse CSV with csv-parse
- CATL-03: Normalize headers (trim + lowercase)
- CATL-04: 5-min in-memory cache
- CATL-05: Serve stale cache on fetch failure
- CATL-06: Keyword search across name/category/description/keywords
- CATL-07: "all" returns full catalog
- CATL-08: Log first row on startup
- MSG-02: sendSingleProduct
- MSG-03: sendProductList
- MSG-04: Cap at 10 items
- HNDL-03: "all" → full product list
- HNDL-04: 0 results → no-results text
- HNDL-05: 1 result → single product card
- HNDL-06: 2+ results → product list

**Success Criteria:**
1. User sends "shirt" → gets product card/list of matching items from Google Sheet
2. User sends "all" → gets product list of full catalog (max 10)
3. User sends "xyznonexistent" → gets friendly no-results message
4. Cache serves stale data when Google Sheets temporarily unavailable
5. SKU in product messages matches retailer_id in Meta Commerce catalog

**Files created:** `sheets.js`, updated `handler.js`, updated `whatsapp.js`

---

## Phase 3: Multi-Language & Admin

**Goal:** Support English, Hindi, Tamil message templates + admin error notifications.

**Requirements:**
- LANG-01: All messages in EN/HI/TA
- LANG-02: Language selection via keyword
- LANG-03: Default English
- LANG-04: Remember language per session
- ADMN-01: Admin notification on API errors
- ADMN-02: ADMIN_PHONE env var
- ADMN-03: Error details in notification
- ADMN-04: Rate limit notifications (1/min/type)

**Success Criteria:**
1. User sends "hindi" → all subsequent messages in Hindi
2. User sends "tamil" → all subsequent messages in Tamil
3. New user gets English by default
4. WhatsApp API failure → admin receives error notification within 60s

**Files created:** `i18n.js` (language strings), updated `handler.js`, updated `whatsapp.js`

---

## Phase 4: Deploy & Documentation

**Goal:** Production deployment on Render + comprehensive setup docs.

**Requirements:**
- DEPL-01: package.json with all deps + start script
- DEPL-02: .env.example with documented vars
- DEPL-03: README with Meta/Sheet/Render setup
- DEPL-04: Deploy to Render

**Success Criteria:**
1. README enables someone to set up from scratch (Meta app, Sheet, Render)
2. Render deployment runs successfully with env vars
3. End-to-end test: WhatsApp message → bot reply on production URL

**Files created:** Updated `package.json`, `.env.example`, `README.md`

---

## Requirement Coverage

All 37 v1 requirements mapped. 0 unmapped. ✓

---
*Roadmap created: 2026-04-19*
