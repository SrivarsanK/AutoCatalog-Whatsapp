# Architecture Research: WhatsApp Catalog Auto-Reply Bot

## System Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  WhatsApp    │────▶│  Express.js  │────▶│  handler.js      │
│  Cloud API   │◀────│  index.js    │     │  (routing logic) │
│  (Meta)      │     │  (webhook)   │     └────────┬─────────┘
└──────────────┘     └──────────────┘              │
                                            ┌──────┴──────┐
                                            │             │
                                     ┌──────▼──┐    ┌─────▼──────┐
                                     │sheets.js│    │whatsapp.js │
                                     │(catalog)│    │(send msgs) │
                                     └────┬────┘    └────────────┘
                                          │
                                   ┌──────▼──────┐
                                   │Google Sheets │
                                   │(published   │
                                   │ CSV)        │
                                   └─────────────┘
```

## Component Boundaries

### index.js — Webhook Server
- Express app, two routes (GET /webhook, POST /webhook)
- GET: Meta verification handshake
- POST: Extract sender phone + message text, delegate to handler
- Always return 200 to Meta (even on errors)
- No business logic here

### handler.js — Message Router
- Pure routing logic: message → action
- Greeting detection, "all" keyword, search, fallback
- Calls sheets.js for data, whatsapp.js for sending
- Language detection/selection lives here

### sheets.js — Catalog Data Layer
- Fetch CSV from Google Sheets URL
- Parse with csv-parse (columns: true)
- In-memory cache with 5-min TTL
- searchCatalog: case-insensitive filter across name/category/description/keywords
- No write operations (read-only)

### whatsapp.js — WhatsApp API Client
- sendText(to, text) — simple text message
- sendSingleProduct(to, sku) — interactive type=product
- sendProductList(to, items, headerText) — interactive type=product_list
- All calls: POST to graph.facebook.com/v19.0/{PHONE_ID}/messages
- Auth: Bearer token header

## Data Flow

```
1. User sends WhatsApp message
2. Meta POST → /webhook
3. index.js extracts: { from, text }
4. handler.js decides action:
   - greeting? → sendText(welcome)
   - "all"?    → getCatalog() → sendProductList(all)
   - query?    → searchCatalog(query) →
                   0 results → sendText(not found)
                   1 result  → sendSingleProduct(sku)
                   2+ results → sendProductList(matches)
5. whatsapp.js sends via Cloud API
6. Always return 200 to Meta
```

## Build Order (Suggested)

1. **index.js** — webhook verification + message extraction (can test with ngrok immediately)
2. **whatsapp.js** — sendText first (simplest, verify API works)
3. **sheets.js** — fetch + parse + cache (test independently with console.log)
4. **handler.js** — wire everything together
5. **Multi-language** — add i18n layer after core works
6. **Admin notifications** — add error reporting after happy path works
7. **Deploy** — Render setup last

## Key Architecture Decisions

- **No middleware framework** — 4 files, no need for DI/middleware chains
- **No database** — Google Sheets CSV eliminates infra overhead
- **Flat file structure** — all files in root, no src/ directory needed for 4 files
- **ESM modules** — modern Node.js, use import/export
- **Single process** — no workers, no queues, no clustering at this scale
