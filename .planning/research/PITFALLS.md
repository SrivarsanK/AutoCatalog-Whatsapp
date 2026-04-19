# Pitfalls Research: WhatsApp Catalog Auto-Reply Bot

## Critical Pitfalls

### 1. retailer_id / SKU Mismatch (Severity: BLOCKER)
**What:** product_retailer_id in API call must EXACTLY match retailer_id in Meta Commerce Manager catalog. Even whitespace or case difference = "Product not found" error.
**Warning signs:** Product messages fail silently or return error 131009.
**Prevention:**
- Document exact matching requirement prominently
- Trim whitespace when reading SKU from Google Sheets
- Log SKU values on search to debug mismatches
**Phase:** Phase 1 (core product messaging)

### 2. Catalog Not Connected to WABA (Severity: BLOCKER)
**What:** Catalog in Commerce Manager must be explicitly linked to WhatsApp Business Account. Without this, ALL product messages fail.
**Warning signs:** Error "Catalog not connected" or product messages return 400.
**Prevention:**
- Add to setup docs: Commerce Manager → Settings → WhatsApp → Connect
- Test with one product message before building full flow
**Phase:** Phase 1 (setup verification)

### 3. Webhook Not Returning 200 (Severity: HIGH)
**What:** If webhook POST handler throws or returns non-200, Meta retries with exponential backoff, then stops sending events entirely.
**Warning signs:** Messages stop arriving, Meta dashboard shows webhook errors.
**Prevention:**
- Wrap entire POST handler in try/catch
- ALWAYS return 200 first, process async
- Never let unhandled promise rejection crash Express
**Phase:** Phase 1 (webhook setup)

### 4. 24-Hour Conversation Window (Severity: MEDIUM)
**What:** Interactive product messages can only be sent within 24 hours of user's last message. After that, only template messages allowed.
**Warning signs:** API returns error for product messages to users who haven't messaged recently.
**Prevention:**
- This bot is reactive (user messages first), so window is always open
- But admin error notifications could fail if admin hasn't messaged bot recently
- For admin notify: use template message or send to admin's personal WhatsApp
**Phase:** Phase 3 (admin notifications)

### 5. Google Sheets CSV URL Instability (Severity: MEDIUM)
**What:** Published CSV URL can break if sheet is unpublished, renamed, or sharing changes. No error notification from Google.
**Warning signs:** Empty catalog, CSV fetch returns HTML (Google login page) instead of CSV.
**Prevention:**
- Validate CSV response (check Content-Type or first line for headers)
- Cache last-good data — serve stale rather than empty
- Log fetch failures prominently
- Document: don't change sheet name/structure after publishing
**Phase:** Phase 2 (sheets module)

### 6. Product List Max Items (Severity: LOW)
**What:** product_list supports max 30 items total across all sections, but practically 10 per section works best.
**Warning signs:** API error when sending too many items.
**Prevention:**
- Slice results to max 10 items
- Add "showing first 10 results" message if more exist
- Group by category in sections if needed
**Phase:** Phase 2 (product messaging)

### 7. App-to-WABA Subscription Missing (Severity: HIGH)
**What:** Even with correct webhook URL, if App is not subscribed to WABA, messages are silently dropped — hardest bug to diagnose.
**Warning signs:** Webhook verification works, test events arrive, but real messages never do.
**Prevention:**
- POST to /{WABA_ID}/subscribed_apps to subscribe
- Add this step to setup documentation
- Verify with real message early, not just dashboard test
**Phase:** Phase 1 (setup)

### 8. CSV Column Name Sensitivity (Severity: LOW)
**What:** csv-parse with columns:true uses exact header text. Extra spaces, different capitalization = undefined fields.
**Warning signs:** All search results return 0, but CSV has data.
**Prevention:**
- Normalize column headers: trim + toLowerCase
- Document exact expected headers
- Log first parsed row on startup to verify structure
**Phase:** Phase 2 (sheets module)

## Quick Reference

| Pitfall | Severity | Phase | Type |
|---------|----------|-------|------|
| SKU mismatch | BLOCKER | 1 | Data |
| Catalog not connected | BLOCKER | 1 | Setup |
| Webhook not returning 200 | HIGH | 1 | Code |
| WABA subscription missing | HIGH | 1 | Setup |
| 24-hour window | MEDIUM | 3 | API |
| CSV URL instability | MEDIUM | 2 | Data |
| Product list max items | LOW | 2 | API |
| CSV column sensitivity | LOW | 2 | Data |
