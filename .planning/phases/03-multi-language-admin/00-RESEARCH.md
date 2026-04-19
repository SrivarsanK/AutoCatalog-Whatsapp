# Research: Multi-Language & Admin

## 1. Multi-Language (i18n)
- A simple `i18n.js` module exporting an object of language strings is best for this scale (EN, HI, TA).
- Strings required:
  - `welcome`: Welcome message
  - `noResults`: Fallback when search returns 0 products
  - `multipleResultsHeader`: Header for product lists
  - `fullCatalogHeader`: Header for full catalog
  - `langChanged`: Confirmation of language change
- State mapping: A simple JavaScript `Map` where the key is the WhatsApp sender ID (phone number) and the value is the language code (`en`, `hi`, `ta`).
- Memory size constraint: A `Map` with 10k users takes <2MB RAM. Perfectly fine on Render free tier.

## 2. Admin Error Logging & Rate Limiting
- Track errors using a `Map` where key is the `error.name` or generic `API_ERROR`, and value is a Unix timestamp.
- If `Date.now() - map.get(errType) > 60000`, send the message to the number defined by `ADMIN_PHONE`.
- The notification message can reuse `sendText()` from `whatsapp.js`.
- Catch blocks in `handler.js` and `sheets.js` can call `notifyAdmin(err)`. 
