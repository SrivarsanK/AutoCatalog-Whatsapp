# Features Research: WhatsApp Catalog Auto-Reply Bot

## Table Stakes (Must Have — Users Leave Without These)

| Feature | Complexity | Notes |
|---------|-----------|-------|
| Webhook verification (GET) | Low | Meta requires hub.challenge handshake |
| Receive messages (POST) | Low | Parse entry.changes[0].value.messages |
| Text reply | Low | Basic sendText for greetings/errors |
| Single product card | Medium | Interactive type=product, requires catalog_id + retailer_id |
| Product list | Medium | Interactive type=product_list, sections with product_items |
| Keyword search | Low | Case-insensitive match across name/category/description/keywords |
| Greeting detection | Low | Match hi/hello/hey/start/menu/catalog |
| No-results fallback | Low | Friendly "nothing found" message |
| Error handling | Medium | Catch API failures, don't crash server |
| Always return 200 | Low | Meta requires 200 on webhook POST or retries |

## Differentiators (Competitive Advantage)

| Feature | Complexity | Notes |
|---------|-----------|-------|
| Multi-language (EN/HI/TA) | Medium | Message templates in 3 languages, detect/set user preference |
| Admin error notifications | Medium | WhatsApp text to admin phone on failures |
| Google Sheets as CMS | Low | Non-technical owners edit products via spreadsheet |
| 5-min cached catalog | Low | Balance freshness vs fetches |
| "all" keyword for full catalog | Low | Browse entire catalog |
| Structured logging (Pino) | Low | JSON logs for debugging/monitoring |

## Anti-Features (Deliberately NOT Building)

| Feature | Why Not |
|---------|---------|
| NLP/AI intent detection | Overkill for product search, keyword matching sufficient |
| Payment processing | Catalog display only, payments handled offline |
| User accounts/auth | Bot open to any WhatsApp sender |
| Admin dashboard | Google Sheets IS the admin interface |
| Cart/checkout flow | v1 is catalog browsing, not e-commerce |
| Broadcast/campaigns | Requires template approval, separate concern |
| CRM integration | Not needed at this scale |

## Feature Dependencies

```
Webhook verification → Receive messages → Handler routing
                                              ↓
Google Sheets fetch + cache → Search → Product messages (single/list)
                                              ↓
                                     Multi-language templates
                                              ↓
                                     Admin error notifications
```
