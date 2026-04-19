---
status: pending
phase: 03-multi-language-admin
requirements_addressed: [LANG-01, LANG-02, LANG-03, LANG-04]
dependencies: []
---

# Plan 01: Multi-Language (i18n)

## Objective
Implement language selection (EN, HI, TA) triggered by keywords, and translate bot responses using an in-memory session tracker.

## Implementation Steps

1. **Create `i18n.js`**
   - Create and export an object `strings` with keys `en`, `hi`, `ta`.
   - Each should contain entries for `welcome`, `noResults`, `multipleResultsHeader`, `fullCatalogHeader`, `langChanged`.
   - Export an in-memory `userLanguages = new Map()`.
   - Create a helper `getUserLanguage(sender)` that returns the language or defaults to `en` (LANG-03).
   - Create a helper `setUserLanguage(sender, lang)` that updates the map (LANG-04).
   - Create a helper `getString(sender, key, ...args)` that retrieves the string in the user's appropriate language.

2. **Update `handler.js`**
   - Import methods from `i18n.js`.
   - At the top of `handleMessage`, check if `text` is one of `['english', 'hindi', 'हिंदी', 'tamil', 'தமிழ்']`.
     - If so, call `setUserLanguage(sender, langCode)` and `sendText(sender, strings[langCode].langChanged)`. `return;`
   - Modify existing strings using `getString(sender, 'welcome')`, `getString(sender, 'noResults', text)`, etc.
   - Adjust `searchCatalog(text)` to still search using the exact text (since sheet data is not translated by the bot).

## Verification
- Send `hindi` and verify bot says language changed in Hindi.
- Send `hi` and verify the welcome message is in Hindi.
- Send `english` and verify it switches back.
