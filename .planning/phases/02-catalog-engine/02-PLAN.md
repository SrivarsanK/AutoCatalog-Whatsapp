---
status: pending
phase: 02-catalog-engine
requirements_addressed: [CATL-06, CATL-07, MSG-02, MSG-03, MSG-04, HNDL-03, HNDL-04, HNDL-05, HNDL-06]
dependencies: [01-PLAN.md]
---

# Plan 02: Product Messaging & Integration

## Objective
Implement keyword search in the catalog, extend `whatsapp.js` to send native catalog messages, and wire everything up to `handler.js`.

## Implementation Steps

1. **Implement `searchCatalog(keyword)` in `sheets.js`**
   - Call `fetchCatalog()`.
   - If `keyword` === "all", return full dataset.
   - Filter dataset: match `.toLowerCase().includes(keyword.toLowerCase())` on Name, Category, Description, and Keywords columns.
   - Limit returned items to exactly 10 (MSG-04).

2. **Extend `whatsapp.js`**
   - Implement `sendSingleProduct(to, sku)`:
     - `POST` to WhatsApp Graph API.
     - Payload is an `interactive` message of type `product`.
     - Required: `action.product_retailer_id = sku` and `action.catalog_id = process.env.CATALOG_ID`.
   - Implement `sendProductList(to, products, headerText)`:
     - Payload is an `interactive` message of type `product_list`.
     - Required: `action.sections[0].product_items` = array of `{ product_retailer_id: sku }`.
     - Limit exactly 10 inside the payload or before.

3. **Wire in `handler.js`**
   - On incoming text:
     - If typical greeting -> send text welcome message as before.
     - Else: call `searchCatalog(text)`.
     - If results length === 0, send fallback: "No products found for '...'." (HNDL-04).
     - If results length === 1, call `sendSingleProduct` with its SKU (HNDL-05).
     - If results length >= 2, call `sendProductList` with all SKUs (HNDL-03, HNDL-06).

4. **Environment Variables**
   - Make sure `CATALOG_ID` is documented or handled gracefully.

## Verification
- Search for something returning 0 products -> text fallback works.
- Search returning 1 product -> calls `sendSingleProduct`.
- Search returning many products -> calls `sendProductList` (max 10 items).
