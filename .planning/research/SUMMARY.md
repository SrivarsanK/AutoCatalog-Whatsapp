# Research Summary: WhatsApp Catalog Auto-Reply Bot

## Stack Recommendation

**Node.js 20 LTS + Express.js 4.x** — lightweight webhook server.
- **axios** for HTTP (WhatsApp API + Google Sheets fetch)
- **csv-parse** for CSV → objects (streaming, handles edge cases)
- **Pino 9.x** for structured JSON logging (5x faster than Winston)
- **dotenv** for env vars
- **In-memory Map + TTL** for catalog cache (no Redis at this scale)
- **ESM modules** throughout (`"type": "module"`)

## Table Stakes Features (v1 Must-Haves)

1. Webhook verification (Meta handshake)
2. Message reception + extraction
3. Text replies (greetings, errors, no-results)
4. Single product card (1 search result)
5. Product list (2-10 search results)
6. Keyword search across name/category/description/keywords
7. Google Sheets CSV fetch with 5-min cache
8. Error handling (never crash, always return 200)

## Differentiators (v1 Nice-to-Haves → INCLUDED)

1. Multi-language (EN/HI/TA)
2. Admin error notifications via WhatsApp
3. "all" keyword for full catalog browse
4. Structured Pino logging

## Watch Out For

### BLOCKERS
- **SKU mismatch** — retailer_id in Meta catalog must EXACTLY match sku in Google Sheet (trim whitespace!)
- **Catalog not connected to WABA** — must link in Commerce Manager before product messages work

### HIGH RISK
- **Webhook not returning 200** — wrap handler in try/catch, return 200 first
- **WABA subscription missing** — POST to /{WABA_ID}/subscribed_apps or messages silently drop

### MEDIUM RISK
- **24-hour window** — interactive messages only within 24h of user's last message (not an issue for reactive bot)
- **CSV URL instability** — validate response, serve stale cache if fetch fails

## Architecture

4-file flat structure:
```
index.js    → Express webhook server (GET verify + POST receive)
handler.js  → Message routing logic
sheets.js   → Google Sheets CSV fetch + cache + search
whatsapp.js → WhatsApp Cloud API client (text + product + product_list)
```

Build order: index.js → whatsapp.js → sheets.js → handler.js → i18n → admin notify → deploy

## Key Insights from Research

1. **Product message payloads** are well-documented — `type: "product"` for single, `type: "product_list"` for multi with sections
2. **csv-parse with `columns: true`** auto-maps headers — but normalize headers (trim + lowercase) to avoid silent failures
3. **Cache stampede prevention** not needed at 1500 msgs/day — simple TTL cache sufficient
4. **Render deployment** straightforward — set env vars in dashboard, no Dockerfile needed
5. **No template messages needed** — bot is fully reactive (user messages first), always within 24h window

---
*Research completed: 2026-04-19*
