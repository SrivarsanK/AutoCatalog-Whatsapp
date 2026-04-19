# Phase 2: Catalog Engine

## Goal
Fetch product catalog from Google Sheets, search by keyword, send native product cards/lists.

## Requirements
- CATL-01: Fetch CSV from Google Sheets URL
- CATL-02: Parse CSV with csv-parse
- CATL-03: Normalize headers (trim + lowercase)
- CATL-04: 5-min in-memory cache
- CATL-05: Serve stale cache on fetch failure
- CATL-06: Keyword search across name/category/description/keywords
- CATL-07: "all" returns full catalog
- CATL-08: Log first row on startup
- MSG-02: sendSingleProduct
- MSG-03: sendProductList
- MSG-04: Cap at 10 items
- HNDL-03: "all" → full product list
- HNDL-04: 0 results → no-results text
- HNDL-05: 1 result → single product card
- HNDL-06: 2+ results → product list

## Success Criteria
1. User sends "shirt" → gets product card/list of matching items from Google Sheet
2. User sends "all" → gets product list of full catalog (max 10)
3. User sends "xyznonexistent" → gets friendly no-results message
4. Cache serves stale data when Google Sheets temporarily unavailable
5. SKU in product messages matches retailer_id in Meta Commerce catalog
