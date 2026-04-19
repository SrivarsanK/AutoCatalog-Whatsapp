import { sendText, sendSingleProduct, sendProductList } from './whatsapp.js';
import { searchCatalog } from './sheets.js';
import { setUserLanguage, getString } from './i18n.js';
import { notifyAdmin } from './admin.js';

export async function handleMessage(sender, textStr) {
  try {
    let text = (textStr || '').trim().toLowerCase();
    
    // SEC-05: Input validation - limit search query length
    if (text.length > 100) {
      text = text.substring(0, 100);
    }
    // Language configuration
    const langMap = {
      'english': 'en',
      'hindi': 'hi',
      'हिंदी': 'hi',
      'tamil': 'ta',
      'தமிழ்': 'ta'
    };

    if (langMap[text]) {
      setUserLanguage(sender, langMap[text]);
      await sendText(sender, getString(sender, 'langChanged'));
      return;
    }

    const greetings = ['hi', 'hello', 'hey', 'start', 'menu', 'catalog'];

    if (!text || greetings.includes(text)) {
      await sendText(sender, getString(sender, 'welcome'));
      return;
    }

    const results = await searchCatalog(text);
    if (results.length === 0) {
      await sendText(sender, getString(sender, 'noResults', text));
    } else if (results.length === 1) {
      await sendSingleProduct(sender, results[0].sku);
    } else {
      const header = text === 'all' ? getString(sender, 'fullCatalogHeader') : getString(sender, 'multipleResultsHeader', results.length);
      await sendProductList(sender, results, header);
    }
  } catch (error) {
    // Admin notification
    await notifyAdmin('HandlerError', error);

    // Notify the user something went wrong
    try {
      await sendText(
        sender,
        `We're experiencing a temporary issue. Please try again in a moment, or contact us: ${process.env.SUPPORT_CONTACT}.`
      );
    } catch (e) {
      // If we can't even send the error message, just throw the original error
    }
    
    // Re-throw so index.js can log it
    throw error;
  }
}
