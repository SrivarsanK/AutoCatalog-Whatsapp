# Research: Catalog Engine

## Google Sheets CSV Fetch & Parse
- `axios` will be used for GET request to Google Sheets published CSV URL.
- `csv-parse/sync` will be optimal to quickly read the data into an array of objects.
- A simple `timestamp` and `data` object variable will serve as an in-memory 5-minute cache.

## WhatsApp Product Message APIs
- The Cloud API requires sending `interactive` messages of type `product` or `product_list`.
- Both types require a `catalog_id`, which must be added to `.env` or passed via environment variables.

### Single Product Message payload
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "{{Recipient-Phone-Number}}",
  "type": "interactive",
  "interactive": {
    "type": "product",
    "body": { "text": "Product details:" },
    "action": {
      "catalog_id": "{{catalog-id}}",
      "product_retailer_id": "{{sku}}"
    }
  }
}
```

### Product List Message payload (max 10 items)
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "{{Recipient-Phone-Number}}",
  "type": "interactive",
  "interactive": {
    "type": "product_list",
    "header": { "type": "text", "text": "Matching products" },
    "body": { "text": "Please select a product below:" },
    "action": {
      "catalog_id": "{{catalog-id}}",
      "sections": [
        {
          "title": "Search Results",
          "product_items": [
            { "product_retailer_id": "sku1" }
          ]
        }
      ]
    }
  }
}
```

## Keyword search
- Iterate over the parsed objects. Normalizing headers ensures consistent keys to check.
- Standard match checks: loop through row attributes, checking `.toLowerCase().includes(keyword.toLowerCase())` on Name, Category, Description, and Keywords columns.
