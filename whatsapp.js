import axios from 'axios';

export async function sendText(to, text) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          preview_url: false,
          body: text
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WA_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function sendSingleProduct(to, sku) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'product',
          body: {
            text: 'Product detail:'
          },
          action: {
            catalog_id: process.env.CATALOG_ID,
            product_retailer_id: sku
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WA_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function sendProductList(to, products, headerText) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'product_list',
          header: {
            type: 'text',
            text: headerText || 'Matching products'
          },
          body: {
            text: 'Please select a product below:'
          },
          action: {
            catalog_id: process.env.CATALOG_ID,
            sections: [
              {
                title: 'Search Results',
                product_items: products.slice(0, 10).map(p => ({ product_retailer_id: p.sku }))
              }
            ]
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WA_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
