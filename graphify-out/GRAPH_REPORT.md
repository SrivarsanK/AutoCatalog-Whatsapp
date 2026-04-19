# Graph Report - .  (2026-04-19)

## Corpus Check
- Corpus is ~2,648 words - fits in a single context window. You may not need a graph.

## Summary
- 30 nodes · 36 edges · 6 communities detected
- Extraction: 58% EXTRACTED · 42% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Project Core & Semantic Architecture|Project Core & Semantic Architecture]]
- [[_COMMUNITY_Message Processing & Admin Alerts|Message Processing & Admin Alerts]]
- [[_COMMUNITY_Catalog Syncing & Testing|Catalog Syncing & Testing]]
- [[_COMMUNITY_Internationalization (i18n)|Internationalization (i18n)]]
- [[_COMMUNITY_Webhook Security & Verification|Webhook Security & Verification]]
- [[_COMMUNITY_Server Infrastructure|Server Infrastructure]]

## God Nodes (most connected - your core abstractions)
1. `handleMessage()` - 9 edges
2. `Message Handler Logic` - 6 edges
3. `runTests()` - 5 edges
4. `notifyAdmin()` - 4 edges
5. `fetchCatalog()` - 4 edges
6. `searchCatalog()` - 4 edges
7. `getString()` - 3 edges
8. `sendText()` - 3 edges
9. `getUserLanguage()` - 2 edges
10. `setUserLanguage()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `handleMessage()` --calls--> `setUserLanguage()`  [INFERRED]
  handler.js → i18n.js
- `Meta WhatsApp Cloud API` --conceptually_related_to--> `AutoCatalog WhatsApp Bot`  [INFERRED]
  whatsapp.js → README.md
- `Google Sheets Catalog Client` --implements--> `Sheet-to-WhatsApp Sync`  [INFERRED]
  sheets.js → GEMINI.md
- `fetchCatalog()` --calls--> `notifyAdmin()`  [INFERRED]
  sheets.js → admin.js
- `handleMessage()` --calls--> `getString()`  [INFERRED]
  handler.js → i18n.js

## Communities

### Community 0 - "Project Core & Semantic Architecture"
Cohesion: 0.22
Nodes (9): Admin Alert System, Sheet-to-WhatsApp Sync, Message Handler Logic, i18n Localization Engine, Webhook Endpoint (/webhook), AutoCatalog WhatsApp Bot, Google Sheets Catalog Client, E2E Verification Tests (+1 more)

### Community 1 - "Message Processing & Admin Alerts"
Cohesion: 0.36
Nodes (5): notifyAdmin(), handleMessage(), sendProductList(), sendSingleProduct(), sendText()

### Community 2 - "Catalog Syncing & Testing"
Cohesion: 0.53
Nodes (4): clearCache(), fetchCatalog(), searchCatalog(), runTests()

### Community 3 - "Internationalization (i18n)"
Cohesion: 0.67
Nodes (3): getString(), getUserLanguage(), setUserLanguage()

### Community 4 - "Webhook Security & Verification"
Cohesion: 1.0
Nodes (0): 

### Community 5 - "Server Infrastructure"
Cohesion: 1.0
Nodes (1): Express Webhook Server

## Knowledge Gaps
- **7 isolated node(s):** `Express Webhook Server`, `Webhook Endpoint (/webhook)`, `i18n Localization Engine`, `Admin Alert System`, `E2E Verification Tests` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Webhook Security & Verification`** (2 nodes): `index.js`, `verifySignature()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Server Infrastructure`** (1 nodes): `Express Webhook Server`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `handleMessage()` connect `Message Processing & Admin Alerts` to `Catalog Syncing & Testing`, `Internationalization (i18n)`?**
  _High betweenness centrality (0.234) - this node is a cross-community bridge._
- **Why does `runTests()` connect `Catalog Syncing & Testing` to `Message Processing & Admin Alerts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `handleMessage()` (e.g. with `setUserLanguage()` and `sendText()`) actually correct?**
  _`handleMessage()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `runTests()` (e.g. with `fetchCatalog()` and `searchCatalog()`) actually correct?**
  _`runTests()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `notifyAdmin()` (e.g. with `sendText()` and `handleMessage()`) actually correct?**
  _`notifyAdmin()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `fetchCatalog()` (e.g. with `notifyAdmin()` and `runTests()`) actually correct?**
  _`fetchCatalog()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Express Webhook Server`, `Webhook Endpoint (/webhook)`, `i18n Localization Engine` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._