# Phase 1: Webhook & Core Messaging - Research

**Gathered:** 2026-04-19
**Goal:** Research how to implement Phase 1: Webhook & Core Messaging

## 1. Technical Context

### WhatsApp Cloud API v19.0 - Messages Webhook

#### 1. Webhook Verification (GET /webhook)
When setting up the webhook in the Meta App Dashboard, Meta sends a `GET` request.
- **Parameters:**
  - `hub.mode`: usually `"subscribe"`
  - `hub.verify_token`: custom string you define
  - `hub.challenge`: random string from Meta
- **Response:** If `verify_token` matches your `VERIFY_TOKEN` env var, send a 200 OK with `hub.challenge` as plain text. Otherwise, send 403 Forbidden.

#### 2. Incoming Messages (POST /webhook)
WhatsApp sends POST requests for both incoming messages and message status updates (e.g., delivered, read).
- **Required response:** Must return HTTP `200 OK` immediately (within 20 seconds). Any non-200 responses will cause Meta to retry, leading to duplicated messages and potential webhook disabling.
- **Typical Payload path for messages:**
  `req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]`
- **Structure details:**
  - `from`: The sender's phone number
  - `type`: usually `"text"`, `"interactive"`, etc. For Phase 1, we focus on `"text"`.
  - Content path: If `type === 'text'`, the message is in `.text.body`.
- **Status Updates:** Payloads containing `.statuses` instead of `.messages` should be ignored and simply answered with 200 OK.

### WhatsApp Cloud API v19.0 - Send API

- **Endpoint:** `POST https://graph.facebook.com/v19.0/{PHONE_ID}/messages`
- **Headers:**
  - `Authorization: Bearer {WA_TOKEN}`
  - `Content-Type: application/json`
- **Payload for Text Messages:**
  ```json
  {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "PHONE_NUMBER",
    "type": "text",
    "text": { 
      "preview_url": false,
      "body": "Your text message here"
    }
  }
  ```

### Express & Pino Structure

- **Pino-http:** Using `pino-http` middleware ensures every request is logged uniformly without manual `console.log`.
- **Error Handling:** Since we must return 200 OK, unhandled promise rejections inside the webhook route need to be caught. We can wrap the route logic in a `try...catch` block. On catch, log the error and STILL return `200 OK`. If the error occurred before responding 200, return 200.

## 2. Implementation Approach

### 2.1 File Structure
As defined in project architecture:
- `index.js`: Express app, Pino middleware, `GET /webhook` and `POST /webhook` definitions. Loads dotenv.
- `whatsapp.js`: API client wrapper for Meta Cloud API. Exports `sendText`.
- `handler.js`: Contains business logic for message routing.
- `package.json` & `.env.example`: Config files.

### 2.2 Environment Variables needed
- `PORT` (default 3000)
- `WA_TOKEN`
- `PHONE_ID`
- `VERIFY_TOKEN`
- `SHOP_NAME`
- `SUPPORT_CONTACT`

### 2.3 Handler Routing Logic (HNDL-01, HNDL-02)

Upon receiving a valid message payload from POST `/webhook`:
1. Extract `sender` and `text`.
2. Normalize `text` (`text.trim().toLowerCase()`).
3. If `!text`, send the Welcome Message.
4. If `text` matches `hi`, `hello`, `hey`, `start`, `menu`, `catalog`, send the Usage Instructions (which is identical to the Welcome Message in D-03).
5. If an error occurs in the handler, catch it, log it, and trigger the generic Error Response (D-05) via WhatsApp message, while returning 200 to Meta.

## 3. Potential Pitfalls

- **Crash Loop:** An error processing a message might crash the Express server. Ensure top-level try/catch around the webhook handler logic, and a global Express error handler `app.use((err, req, res, next) ...)`.
- **Nested undefined values:** The Meta webhook payload is deeply nested. Accessing `messages[0]` safely requires optional chaining (`?.`).
- **Pino formatting:** In local dev, standard Pino output is hard to read. `pino-pretty` is in dependencies and should be used during dev, but standard Pino JSON for prod.

## RESEARCH COMPLETE
