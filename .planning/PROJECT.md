# AutoCatalog WhatsApp Bot

## What This Is

A WhatsApp auto-reply bot that connects a Google Sheets product catalog to WhatsApp's native product messaging (single product cards, product lists). Small businesses add products to a Google Sheet, and customers browse/search the catalog directly in WhatsApp by sending keywords. Supports English, Hindi, and Tamil.

## Core Value

When a customer sends a product query on WhatsApp, they get a native catalog product card or list back instantly — no manual reply needed.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Webhook verification (Meta handshake)
- [ ] Receive and parse incoming WhatsApp messages
- [ ] Fetch product catalog from Google Sheets CSV (cached 5 min)
- [ ] Search catalog by keyword (name, category, description, keywords — case-insensitive)
- [ ] Send text messages via WhatsApp Cloud API
- [ ] Send single product card (1 result)
- [ ] Send product list (2-10 results)
- [ ] Greeting/menu detection (hi, hello, hey, start, menu, catalog)
- [ ] "all" keyword returns full catalog
- [ ] No-results fallback message
- [ ] Multi-language support (English, Hindi, Tamil)
- [ ] Structured logging (Pino)
- [ ] Admin error notifications
- [ ] Deploy to Render

### Out of Scope

- Database/ORM — Google Sheets is the data source, no DB needed
- Authentication/user accounts — bot is open to any WhatsApp sender
- Payment processing — catalog display only, no transactions
- Admin dashboard/UI — manage products via Google Sheets directly
- Media/image handling — rely on Meta Commerce catalog images
- Analytics/reporting — v1 focuses on core reply functionality
- Rate limiting — 1000-1500 msgs/day well within WhatsApp API limits

## Context

- **WhatsApp Cloud API v19.0** — interactive messages (product, product_list) require a Meta Commerce Manager catalog with retailer_id matching Google Sheet SKUs
- **Google Sheets as CMS** — published as CSV, no auth needed, simple for non-technical shop owners
- **Meta setup** — app creation, phone number ID, permanent access token, catalog ID, webhook registration all manual in Meta Developer dashboard
- **Scale** — 1000-1500 messages/day expected
- **Local dev** — ngrok to expose webhook for Meta verification

## Constraints

- **Stack**: Node.js ESM + Express.js — lightweight, well-supported for webhook servers
- **Data source**: Google Sheets published CSV — no API keys, no OAuth, 5-min cache
- **API**: WhatsApp Cloud API v19.0 — must use interactive message types for catalog products
- **SKU match**: retailer_id in Meta Commerce Manager must exactly match sku column in Sheet
- **Message limit**: product_list supports max 10 items per message
- **Deploy**: Render (free tier viable for this scale)
- **Logging**: Pino — fast, lightweight, structured JSON logs
- **Languages**: English, Hindi, Tamil — message templates for all three

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Google Sheets over DB | Non-technical shop owners can edit, no infra cost, CSV publish = no auth | — Pending |
| Pino over Winston | Faster, lower overhead, JSON-native, better for structured logging | — Pending |
| Express over Fastify | Simpler, more examples for WhatsApp webhook tutorials, sufficient for scale | — Pending |
| Render over Railway | User preference | — Pending |
| 5-min cache TTL | Balance freshness vs API calls at 1000-1500 msgs/day | — Pending |
| Admin notify on errors | WhatsApp text to admin phone on API failures vs silent fail | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-19 after initialization*
