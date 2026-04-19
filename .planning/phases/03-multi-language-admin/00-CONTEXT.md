# Phase 3: Multi-Language & Admin Context

## 1. Goal
Support English, Hindi, Tamil message templates + admin error notifications.

## 2. Requirements Addressed
- LANG-01: All messages in EN/HI/TA
- LANG-02: Language selection via keyword (e.g., 'hindi', 'tamil', 'english')
- LANG-03: Default English
- LANG-04: Remember language per session
- ADMN-01: Admin notification on API errors
- ADMN-02: ADMIN_PHONE env var
- ADMN-03: Error details in notification
- ADMN-04: Rate limit notifications (1/min/type)

## 3. Decisions & Gray Areas Handled
### 3.1. Language Storage
Given the scale and constraints, we will store user language preferences in a simple global in-memory `Map<senderId, lang>`. It defaults to 'en'.

### 3.2. Translation Scope
Only the bot's static message templates (welcome message, no-results, list headers, fallback) will be translated. Dynamic data from Google Sheets (product names, descriptions) remains in the language authored in the spreadsheet.

### 3.3. Language Switching Keywords
Language change is triggered if the message text exactly matches predefined keywords in supported languages (ex: "hindi", "हिंदी", "tamil", "தமிழ்", "english").

### 3.4. Admin Notifications Limit
A global `Map<errorName, timestamp>` will track the last time an error was sent to the `ADMIN_PHONE`. If the last error of the same type was < 60 seconds ago, suppress notification.

## Code context to read during planning
- `handler.js` to see where language detection and injection of translation strings is needed.
- The `searchCatalog` calls which will need translated `No products found` text.
