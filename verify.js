import { fetchCatalog, searchCatalog, clearCache } from './sheets.js';
import axios from 'axios';
import { handleMessage } from './handler.js';
import assert from 'node:assert';

// State to track mock calls
let allPayloads = [];
let postCount = 0;

// Mock axios methods
axios.get = async (url) => {
  if (!url) throw new Error('Invalid URL');
  return {
    data: "sku,name,category,description,keywords\n" +
          "SKU001,Blue Shirt,Apparel,A nice blue shirt,shirt casual\n" +
          "SKU002,Red Shirt,Apparel,A bright red shirt,shirt vibrant\n" +
          "SKU003,Pants,Apparel,Comfy jeans,pants casual\n" +
          "SKU004,Shoes,Footwear,Running shoes,shoes sports\n"
  };
};

axios.post = async (url, data) => {
  allPayloads.push(data);
  postCount++;
  return { data: { success: true } };
};

process.env.SHEET_CSV_URL = "http://mock-url/csv";
process.env.CATALOG_ID = "mock_catalog_id";
process.env.PHONE_ID = "mock_phone_id";
process.env.ADMIN_PHONE = "9999999999";
process.env.SHOP_NAME = "Test Shop";
process.env.SUPPORT_CONTACT = "support@test.com";

async function runTests() {
  try {
    console.log("=== Test 1: Fetch Catalog ===");
    const catalog = await fetchCatalog();
    assert.strictEqual(catalog.length, 4, 'Catalog should have 4 items');
    assert.strictEqual(catalog[0].sku, 'SKU001');

    console.log("=== Test 2: Search Catalog (shirt) ===");
    const searchResults = await searchCatalog('shirt');
    assert.strictEqual(searchResults.length, 2, 'Should find 2 shirts');

    let currentPayload;

    console.log("=== Test 3: Handler (No match) ===");
    await handleMessage('12345', 'xyz');
    currentPayload = allPayloads[allPayloads.length - 1];
    assert.strictEqual(currentPayload.type, 'text');
    assert.ok(currentPayload.text.body.includes('No products found'), 'Should send no results text');

    console.log("=== Test 4: Handler (Single match) ===");
    await handleMessage('12345', 'shoes');
    currentPayload = allPayloads[allPayloads.length - 1];
    assert.strictEqual(currentPayload.type, 'interactive');
    assert.strictEqual(currentPayload.interactive.type, 'product');
    assert.strictEqual(currentPayload.interactive.action.product_retailer_id, 'SKU004');

    console.log("=== Test 5: Handler (Multiple match) ===");
    await handleMessage('12345', 'shirt');
    currentPayload = allPayloads[allPayloads.length - 1];
    assert.strictEqual(currentPayload.interactive.type, 'product_list');
    assert.strictEqual(currentPayload.interactive.action.sections[0].product_items.length, 2);

    console.log("=== Test 6: Handler (Language switch to Hindi) ===");
    await handleMessage('12345', 'hindi');
    currentPayload = allPayloads[allPayloads.length - 1];
    assert.ok(currentPayload.text.body.includes('हिंदी'), 'Should confirm language change in Hindi');

    console.log("=== Test 7: Handler (Greeting in Hindi) ===");
    await handleMessage('12345', 'hi');
    currentPayload = allPayloads[allPayloads.length - 1];
    assert.ok(currentPayload.text.body.includes('स्वागत'), 'Welcome message should be in Hindi');

    console.log("=== Test 8: Admin Notification (Rate Limiting) ===");
    const startCount = allPayloads.length;
    clearCache();
    process.env.SHEET_CSV_URL = ""; // trigger fetch error
    try {
      await handleMessage('12345', 'shirt');
    } catch(e) {}
    
    const newPayloads = allPayloads.slice(startCount);
    assert.strictEqual(newPayloads.length, 3, 'Should have sent 2 admin notifications and 1 user message');
    
    const adminMsgs = newPayloads.filter(p => p.text?.body?.includes('🚨 System Error'));
    assert.strictEqual(adminMsgs.length, 2, 'Should have 2 admin notifications');
    
    const userMsg = newPayloads.find(p => p.text?.body?.includes('experiencing a temporary issue'));
    assert.ok(userMsg, 'Should have sent user error message');

    console.log("\n✅ ALL VERIFICATIONS PASSED");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ TEST FAILED");
    console.error(error);
    process.exit(1);
  }
}

runTests();
