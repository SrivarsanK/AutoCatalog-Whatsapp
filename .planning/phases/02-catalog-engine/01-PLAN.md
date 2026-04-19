---
status: pending
phase: 02-catalog-engine
requirements_addressed: [CATL-01, CATL-02, CATL-03, CATL-04, CATL-05, CATL-08]
dependencies: []
---

# Plan 01: Google Sheets Fetch & Caching

## Objective
Implement CSV downloading, parsing, normalization, and in-memory 5-minute caching mechanism for the product catalog.

## Implementation Steps

1. **Install Dependencies**
   - Run `npm install csv-parse` to add parsing capabilities.

2. **Configuration**
   - Verify `SHEET_CSV_URL` exists in `.env.example` (or add to logic).

3. **Create `sheets.js`**
   - Setup a `cache` object with `data` (array) and `lastFetch` (timestamp).
   - Implement `fetchCatalog()`:
     - Check if cache is < 5 minutes old. If so, return `cache.data`.
     - Try `axios.get(process.env.SHEET_CSV_URL)`.
     - Parse response using `csv-parse/sync` with `columns: true`.
     - Output row 1 keys on startup to satisfy CATL-08.
     - Normalize headers to lowercase to satisfy CATL-03.
     - Update cache: `cache.data = rawData`, `cache.lastFetch = Date.now()`.
     - Return `cache.data`.
     - **Exception handler**: If `axios.get` fails, log error. If `cache.data` has stale data, log warning and serve stale data (CATL-05). If no cache exists, throw error.

## Verification
- Test by running a mock script or server.
- Verify `csv-parse` handles normal CSV rows.
- Verify caching avoids HTTP requests for 5 minutes.
- Verify fallback works by changing URL to an invalid one after a successful fetch.
