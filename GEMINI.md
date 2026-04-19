<!-- GSD:project-start source:PROJECT.md -->
## Project

**AutoCatalog WhatsApp Bot**

A WhatsApp auto-reply bot that connects a Google Sheets product catalog to WhatsApp's native product messaging (single product cards, product lists). Small businesses add products to a Google Sheet, and customers browse/search the catalog directly in WhatsApp by sending keywords. Supports English, Hindi, and Tamil.

**Core Value:** When a customer sends a product query on WhatsApp, they get a native catalog product card or list back instantly — no manual reply needed.

### Constraints

- **Stack**: Node.js ESM + Express.js — lightweight, well-supported for webhook servers
- **Data source**: Google Sheets published CSV — no API keys, no OAuth, 5-min cache
- **API**: WhatsApp Cloud API v19.0 — must use interactive message types for catalog products
- **SKU match**: retailer_id in Meta Commerce Manager must exactly match sku column in Sheet
- **Message limit**: product_list supports max 10 items per message
- **Deploy**: Render (free tier viable for this scale)
- **Logging**: Pino — fast, lightweight, structured JSON logs
- **Languages**: English, Hindi, Tamil — message templates for all three
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack (2026)
### Runtime & Framework
| Component | Choice | Version | Rationale | Confidence |
|-----------|--------|---------|-----------|------------|
| Runtime | Node.js | 20 LTS | ESM native, stable, WhatsApp SDK examples all Node | High |
| Framework | Express.js | 4.x | Simplest webhook server, most tutorials/examples | High |
| HTTP Client | axios | 1.x | Clean API for WhatsApp Cloud API calls + Google Sheets fetch | High |
### Data & Parsing
| Component | Choice | Version | Rationale | Confidence |
|-----------|--------|---------|-----------|------------|
| CSV Parser | csv-parse | 5.x | Streaming, handles edge cases (quoted fields, newlines) | High |
| Cache | In-memory (Map + TTL) | — | Single instance, 1500 msgs/day = no need for Redis | High |
### Logging & Monitoring
| Component | Choice | Version | Rationale | Confidence |
|-----------|--------|---------|-----------|------------|
| Logger | Pino | 9.x | 5x faster than Winston, JSON-native, low overhead | High |
| Process Manager | — | — | Render handles restarts, no PM2 needed | Medium |
### Dev Tools
| Component | Choice | Version | Rationale | Confidence |
|-----------|--------|---------|-----------|------------|
| Env vars | dotenv | 16.x | Load .env in dev, Render injects in prod | High |
| Tunnel | ngrok | — | Expose local webhook for Meta verification | High |
| Linter | — | — | Optional, not critical for 4-file project | Low |
## What NOT to Use
| Technology | Why Not |
|-----------|---------|
| Fastify | Overkill — Express sufficient for single-endpoint webhook |
| Redis | Single instance, 1500 msgs/day, in-memory cache fine |
| MongoDB/PostgreSQL | Google Sheets IS the database — no persistence layer needed |
| Winston | Slower than Pino, more config, no advantage here |
| WhatsApp Web.js | Unofficial, violates ToS, use Cloud API |
| Google Sheets API v4 | Requires OAuth/service account — published CSV simpler |
## Dependencies (package.json)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
