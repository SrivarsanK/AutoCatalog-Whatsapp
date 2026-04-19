# Requirements: AutoCatalog WhatsApp Bot

**Defined:** 2026-04-19
**Core Value:** When a customer sends a product query on WhatsApp, they get a native catalog product card or list back instantly — no manual reply needed.

## v1 Requirements

### Webhook & Server

- [ ] **SRVR-01**: Express server starts on configurable PORT (default 3000)
- [ ] **SRVR-02**: GET /webhook verifies Meta subscription (hub.mode, hub.verify_token, hub.challenge)
- [ ] **SRVR-03**: POST /webhook extracts sender phone and message text from entry.changes[0].value.messages[0]
- [ ] **SRVR-04**: POST /webhook always returns 200 to Meta regardless of processing outcome
- [ ] **SRVR-05**: Structured JSON logging via Pino on all requests and errors
- [ ] **SRVR-06**: Unhandled errors caught — server never crashes on bad input

### Catalog Data

- [ ] **CATL-01**: Fetch product catalog from Google Sheets published CSV URL
- [ ] **CATL-02**: Parse CSV into array of objects using row 1 as headers (csv-parse, columns: true)
- [ ] **CATL-03**: Normalize column headers (trim + lowercase) to prevent silent mismatches
- [ ] **CATL-04**: Cache parsed catalog in-memory with 5-minute TTL
- [ ] **CATL-05**: Serve stale cache if CSV fetch fails (graceful degradation)
- [ ] **CATL-06**: Search catalog by query — case-insensitive match across name, category, description, keywords columns
- [ ] **CATL-07**: "all" keyword returns full catalog (up to 10 items)
- [ ] **CATL-08**: Log first parsed row on startup to verify CSV structure

### Product Messaging

- [ ] **MSG-01**: sendText(to, text) — send plain text message via WhatsApp Cloud API v19.0
- [ ] **MSG-02**: sendSingleProduct(to, sku) — send interactive type=product with catalog_id + product_retailer_id
- [ ] **MSG-03**: sendProductList(to, items, headerText) — send interactive type=product_list with sections and product_items
- [ ] **MSG-04**: Product list capped at 10 items — show "showing first 10 results" if more exist
- [ ] **MSG-05**: All API calls use Authorization: Bearer {WA_TOKEN} header

### Message Handling

- [ ] **HNDL-01**: Empty/null message → send welcome/instructions text
- [ ] **HNDL-02**: Greeting match (hi, hello, hey, start, menu, catalog) → send usage instructions
- [ ] **HNDL-03**: "all" → getCatalog and sendProductList with full catalog
- [ ] **HNDL-04**: Any other text → searchCatalog(text): 0 results → no-results message
- [ ] **HNDL-05**: Any other text → searchCatalog(text): 1 result → sendSingleProduct
- [ ] **HNDL-06**: Any other text → searchCatalog(text): 2+ results → sendProductList

### Multi-Language

- [ ] **LANG-01**: All user-facing messages available in English, Hindi, and Tamil
- [ ] **LANG-02**: Language selection via keyword (en/hi/ta or english/hindi/tamil)
- [ ] **LANG-03**: Default language is English for new users
- [ ] **LANG-04**: Remember user language preference (in-memory, per session)

### Admin & Monitoring

- [ ] **ADMN-01**: On WhatsApp API errors, send notification text to admin phone number
- [ ] **ADMN-02**: Admin phone number configured via ADMIN_PHONE env var
- [ ] **ADMN-03**: Error notifications include: error type, user phone (masked), timestamp
- [ ] **ADMN-04**: Rate limit admin notifications (max 1 per minute per error type)

### Deployment

- [ ] **DEPL-01**: package.json with type=module, start script, all dependencies
- [ ] **DEPL-02**: .env.example with all required environment variables documented
- [ ] **DEPL-03**: README with Meta setup steps, Google Sheet setup, and Render deploy instructions
- [ ] **DEPL-04**: Deploy to Render with env vars configured

## v2 Requirements

### Enhanced Search
- **SRCH-01**: Fuzzy search (handle typos/partial matches)
- **SRCH-02**: Category browsing (send categories first, then products in category)

### Analytics
- **ANLT-01**: Track popular search queries
- **ANLT-02**: Track message counts per day
- **ANLT-03**: Daily summary report to admin

### Product Updates
- **PROD-01**: Notify subscribed users when new products added
- **PROD-02**: Price change notifications

## Out of Scope

| Feature | Reason |
|---------|--------|
| Database/ORM | Google Sheets is the data source — no persistence needed |
| User accounts/auth | Bot is open to any WhatsApp sender |
| Payment/checkout | Catalog display only — payments offline |
| Admin dashboard/UI | Google Sheets IS the admin interface |
| NLP/AI intent detection | Keyword matching sufficient for product search |
| Cart functionality | Not e-commerce — catalog browsing only |
| Broadcast/campaigns | Requires template approval, separate concern |
| CRM integration | Not needed at 1000-1500 msgs/day |
| Image/media handling | Meta Commerce catalog handles product images |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SRVR-01 | — | Pending |
| SRVR-02 | — | Pending |
| SRVR-03 | — | Pending |
| SRVR-04 | — | Pending |
| SRVR-05 | — | Pending |
| SRVR-06 | — | Pending |
| CATL-01 | — | Pending |
| CATL-02 | — | Pending |
| CATL-03 | — | Pending |
| CATL-04 | — | Pending |
| CATL-05 | — | Pending |
| CATL-06 | — | Pending |
| CATL-07 | — | Pending |
| CATL-08 | — | Pending |
| MSG-01 | — | Pending |
| MSG-02 | — | Pending |
| MSG-03 | — | Pending |
| MSG-04 | — | Pending |
| MSG-05 | — | Pending |
| HNDL-01 | — | Pending |
| HNDL-02 | — | Pending |
| HNDL-03 | — | Pending |
| HNDL-04 | — | Pending |
| HNDL-05 | — | Pending |
| HNDL-06 | — | Pending |
| LANG-01 | — | Pending |
| LANG-02 | — | Pending |
| LANG-03 | — | Pending |
| LANG-04 | — | Pending |
| ADMN-01 | — | Pending |
| ADMN-02 | — | Pending |
| ADMN-03 | — | Pending |
| ADMN-04 | — | Pending |
| DEPL-01 | — | Pending |
| DEPL-02 | — | Pending |
| DEPL-03 | — | Pending |
| DEPL-04 | — | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 0
- Unmapped: 37 ⚠️

---
*Requirements defined: 2026-04-19*
*Last updated: 2026-04-19 after initial definition*
