# AutoCatalog WhatsApp Bot

A WhatsApp auto-reply bot that connects a Google Sheets product catalog to WhatsApp's native product messaging (single product cards, product lists).

## How it Works
1. Small businesses add products (SKU, Name, Category, Description, Keywords) to a Google Sheet.
2. The bot fetches the catalog as a CSV and searches it based on user keywords.
3. Customers get native WhatsApp product cards or lists instantly.
4. Supports English, Hindi, and Tamil.

## Setup Instructions

### 1. Google Sheets Setup
1. Create a Google Sheet with headers: `sku`, `name`, `category`, `description`, `keywords`.
2. Populate it with your products.
3. Go to **File > Share > Publish to web**.
4. Select the sheet and set format to **CSV**.
5. Copy the generated URL.

### 2. Meta WhatsApp Cloud API Setup
1. Create an app on the [Meta App Dashboard](https://developers.facebook.com/).
2. Setup WhatsApp Product and get:
   - `PHONE_ID`
   - `WA_TOKEN` (Permanent Token recommended)
   - `CATALOG_ID` (from Commerce Manager)
3. Configure Webhooks to point to your deployed URL `/webhook`.

### 3. Environment Variables
Create a `.env` file (or set in Render):
```env
PORT=3000
WA_TOKEN=your_meta_access_token
PHONE_ID=your_phone_number_id
VERIFY_TOKEN=your_custom_webhook_verify_token
SHOP_NAME="My Shop"
SUPPORT_CONTACT="support@myshop.com"
ADMIN_PHONE="your_whatsapp_number"
SHEET_CSV_URL="your_published_csv_url"
CATALOG_ID="your_catalog_id"
```

### 4. Local Development
```bash
npm install
npm test      # runs end-to-end verification
npm start     # starts the webhook server
```

### 5. Deployment (Render)
1. Push to GitHub.
2. Create a new **Web Service** on Render.
3. Set the environment variables.
4. Render will automatically bind to `$PORT`.
5. Uptime check available at `/health`.

## Admin Notifications
The bot will notify the `ADMIN_PHONE` via WhatsApp if:
- Google Sheets fails to fetch.
- WhatsApp API errors occur.
Notifications are rate-limited to 1 per minute per error type.
