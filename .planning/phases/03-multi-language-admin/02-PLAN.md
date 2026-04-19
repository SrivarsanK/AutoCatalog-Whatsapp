---
status: pending
phase: 03-multi-language-admin
requirements_addressed: [ADMN-01, ADMN-02, ADMN-03, ADMN-04]
dependencies: []
---

# Plan 02: Admin Error Notifications

## Objective
Send WhatsApp texts to an admin phone number whenever there is a failure in the Google Sheets fetch or WhatsApp messaging pipeline, rate-limited to 1 per minute.

## Implementation Steps

1. **Update Environment Files**
   - Add `ADMIN_PHONE` to `.env` and `.env.example` if it doesn't already exist (ADMN-02).

2. **Create `admin.js`**
   - Import `sendText` from `whatsapp.js` and `pino`.
   - Setup `logger = pino({ name: 'admin' })`.
   - Setup `const errorTimestamps = new Map()`.
   - Implement `export async function notifyAdmin(errorType, errorObj)`:
     - Check `ADMIN_PHONE` exists.
     - Check `Date.now() - (errorTimestamps.get(errorType) || 0) < 60000`. If so, skip (rate limited ADMN-04).
     - Update `errorTimestamps.set(errorType, Date.now())`.
     - Construct error message: `🚨 System Error [${errorType}]: ${errorObj.message}` (ADMN-03).
     - Call `await sendText(process.env.ADMIN_PHONE, message)`.
     - Log success or failure of admin notification.

3. **Wire Error Handling**
   - In `handler.js`, within the main `catch (error)`, invoke `notifyAdmin('HandlerError', error)` (ADMN-01).
   - In `sheets.js`, within `fetchCatalog`'s catch block, invoke `notifyAdmin('SheetsFetchError', error)` (ADMN-01).

## Verification
- Test by forcing a Sheets error (e.g. invalid URL) and sending a message. Verify the admin phone (e.g., your own test number) gets a notification.
- Force it again within 60 seconds and verify only ONE notification was sent to admin.
- Wait >60 seconds, force again, verify notification comes through.
