# Phase 1: Webhook & Core Messaging - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Express.js webhook server that handles Meta verification handshake and sends text replies to incoming WhatsApp messages. Includes: server setup (PORT config, Pino logging, error catching), GET /webhook verification, POST /webhook message extraction, sendText function via WhatsApp Cloud API, and greeting/welcome reply logic.

NOT included: product card/list messages (Phase 2), multi-language (Phase 3), deployment (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Welcome & Greeting Flow
- **D-01:** Professional tone — no emojis, no casual language. Business-appropriate messaging.
- **D-02:** Welcome message includes shop name, configurable via `SHOP_NAME` environment variable.
- **D-03:** Example welcome: "Welcome to {SHOP_NAME} product catalog. Please type a product name to search, or send *all* to view available products."
- **D-04:** Greeting triggers: hi, hello, hey, start, menu, catalog (case-insensitive).

### Error Response Behavior
- **D-05:** On errors, send user a helpful redirect message: "We're experiencing a temporary issue. Please try again in a moment, or contact us: {SUPPORT_CONTACT}."
- **D-06:** Support/contact info configurable via `SUPPORT_CONTACT` environment variable.
- **D-07:** Never expose technical error details to end users.

### New Environment Variables (Phase 1 additions)
- **D-08:** `SHOP_NAME` — Business name shown in welcome message. Required.
- **D-09:** `SUPPORT_CONTACT` — Contact info shown in error messages. Required.

### Agent's Discretion
- Webhook payload parsing strategy (how defensive, what to skip, what to log)
- Logging granularity and levels (Pino configuration, what gets logged at info/debug/error)
- Exact message extraction logic (safety of nested property access)
- HTTP error handling patterns (try/catch structure, 200 response timing)

</decisions>

<specifics>
## Specific Ideas

- Professional tone means no emojis, no "Hey there!" — think business SMS, not chatbot
- Welcome message should tell the user exactly what to do: search by name or type "all"
- Error messages should feel reassuring, not apologetic — "temporary issue" not "sorry, we broke"

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### WhatsApp Cloud API
- `.planning/research/ARCHITECTURE.md` — Component architecture, data flow, and file structure
- `.planning/research/PITFALLS.md` — Critical pitfalls including webhook 200-response, WABA subscription, SKU matching
- `.planning/research/STACK.md` — Dependency versions and rationale

### Requirements
- `.planning/REQUIREMENTS.md` — SRVR-01..06, MSG-01, MSG-05, HNDL-01, HNDL-02 (Phase 1 scope)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None — Phase 1 establishes all patterns (ESM imports, logging, error handling, API client structure)
- Patterns set here will be followed by Phases 2-4

### Integration Points
- `index.js` — entry point, creates Express app
- `whatsapp.js` — API client, used by handler
- `handler.js` — message routing, used by index.js webhook POST

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-webhook-core-messaging*
*Context gathered: 2026-04-19*
