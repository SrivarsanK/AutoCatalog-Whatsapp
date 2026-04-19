---
wave: 1
depends_on: []
files_modified: ["package.json", ".env.example", "index.js", "whatsapp.js", "handler.js"]
autonomous: true
requirements: ["SRVR-01", "SRVR-02", "SRVR-03", "SRVR-04", "SRVR-05", "SRVR-06", "MSG-01", "MSG-05", "HNDL-01", "HNDL-02"]
---

<objective>
Set up the Express webhook server to authenticate with Meta and successfully handle and reply to "greeting" and empty messages.
</objective>

<must_haves>
- Express server runs on PORT and uses Pino for JSON logging.
- `GET /webhook` successfully handles the Meta verification handshake using `VERIFY_TOKEN`.
- `POST /webhook` acknowledges requests with 200 OK without crashing on malformed inputs.
- `whatsapp.js` exposes `sendText(to, text)` sending data to Graph API using `WA_TOKEN`.
- `handler.js` properly triggers a standard welcome instructions text on empty or greeting strings.
- Graceful error handling mapping unhandled exceptions to user-friendly redirects based on `SUPPORT_CONTACT`.
</must_haves>

<task>
<read_first>
- .planning/phases/01-webhook-core-messaging/01-CONTEXT.md
- package.json
</read_first>
<action>
Initialize the project structure and install dependencies.
1. Add `"type": "module"` to `package.json`.
2. Add a `start` script: `"node index.js"`.
3. Create `.env.example` with the following variables:
   ```
   PORT=3000
   WA_TOKEN=your_meta_access_token
   PHONE_ID=your_phone_number_id
   VERIFY_TOKEN=your_custom_webhook_verify_token
   SHOP_NAME="My Custom Shop"
   SUPPORT_CONTACT="support@myshop.com"
   ADMIN_PHONE="1234567890"
   SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
   ```
</action>
<acceptance_criteria>
- `package.json` contains `"type": "module"`
- `package.json` contains `"start": "node index.js"`
- `.env.example` contains EXACT string `WA_TOKEN=your_meta_access_token`
</acceptance_criteria>
</task>

<task>
<read_first>
- .planning/phases/01-webhook-core-messaging/01-CONTEXT.md
- whatsapp.js
</read_first>
<action>
Create `whatsapp.js` to handle WhatsApp Cloud API communication.
1. Import `axios`.
2. Export an async function `sendText(to, text)` that makes a POST request to `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`.
3. Set the Axios headers:
   - `Authorization: Bearer ${process.env.WA_TOKEN}`
   - `Content-Type: application/json`
4. Set the Payload body:
   `{ "messaging_product": "whatsapp", "recipient_type": "individual", "to": to, "type": "text", "text": { "preview_url": false, "body": text } }`
5. Handle exceptions internally and re-throw them for the caller to handle if `axios.post` fails.
</action>
<acceptance_criteria>
- `whatsapp.js` contains `export async function sendText`
- `whatsapp.js` contains `Authorization: Bearer`
- `whatsapp.js` contains `https://graph.facebook.com/v19.0/`
</acceptance_criteria>
</task>

<task>
<read_first>
- .planning/phases/01-webhook-core-messaging/01-CONTEXT.md
- handler.js
- whatsapp.js
</read_first>
<action>
Create `handler.js` to route incoming WhatsApp messages.
1. Import `sendText` from `./whatsapp.js`.
2. Export an async function `handleMessage(sender, text)`.
3. Implement logic:
   - Trim and lowercase `text` if provided, else assume empty string.
   - Define a greeting array: `['hi', 'hello', 'hey', 'start', 'menu', 'catalog']`
   - If `text` is empty OR matched in the greeting list, send the welcome message:
     `await sendText(sender, \`Welcome to ${process.env.SHOP_NAME} product catalog. Please type a product name to search, or send *all* to view available products.\`)`
   - On error inside this logic: Send user redirect error message: `await sendText(sender, \`We're experiencing a temporary issue. Please try again in a moment, or contact us: ${process.env.SUPPORT_CONTACT}.\`)`. Re-throw or log error so the main server is aware.
</action>
<acceptance_criteria>
- `handler.js` contains `export async function handleMessage`
- `handler.js` contains `Welcome to ${process.env.SHOP_NAME}`
- `handler.js` contains `We're experiencing a temporary issue`
</acceptance_criteria>
</task>

<task>
<read_first>
- .planning/phases/01-webhook-core-messaging/01-CONTEXT.md
- index.js
- handler.js
</read_first>
<action>
Create `index.js` to implement the Express webhook server.
1. Import `express`, `pino`, `dotenv/config`, and `handleMessage` from `./handler.js`.
2. Initialize `pino` logger and `express` app, using `express.json()` middleware. Use a simple middleware to log incoming requests with Pino.
3. Define `GET /webhook`. Extract `hub.mode`, `hub.verify_token`, `hub.challenge` from `req.query`.
   - If mode `=== 'subscribe'` and token `=== process.env.VERIFY_TOKEN`, respond with HTTP 200 and `.send(req.query['hub.challenge'])`.
   - Else respond with `.sendStatus(403)`.
4. Define `POST /webhook` to handle incoming events.
   - Immediately wrap logic in a `try/catch` to ensure server never crashes.
   - Safely navigate payload: `const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];`
   - If `message` exists (could be any message type including non-text), extract `sender = message.from` and `text = message.type === 'text' ? message.text?.body : ''`.
   - Call `handleMessage(sender, text)` without awaiting it so we can respond quickly, or await it but catch its errors. Best practice is to `await` so we can log outcome but since Meta requires 200 OK quickly, processing asynchronously then logging is fine. Given the simplicity, we can await it inside a try/catch.
   - Send `res.sendStatus(200)` at the end of the route.
   - In catch block, log error with Pino `logger.error`, but still `res.sendStatus(200)`.
5. Start server on `process.env.PORT || 3000` with `app.listen`.
</action>
<acceptance_criteria>
- `index.js` contains `app.get('/webhook'`
- `index.js` contains `app.post('/webhook'`
- `index.js` contains `res.sendStatus(200)`
- `index.js` contains `res.sendStatus(403)`
- `index.js` contains `req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]`
</acceptance_criteria>
</task>
