import axios from 'axios';
import { parse } from 'csv-parse/sync';
import pino from 'pino';
import { notifyAdmin } from './admin.js';

const logger = pino({ name: 'sheets' });

let cache = {
  data: [],
  lastFetch: 0
};

const CACHE_TTL_MS = 5 * 60 * 1000;

export function clearCache() {
  cache.data = [];
  cache.lastFetch = 0;
}

export async function fetchCatalog() {
  if (Date.now() - cache.lastFetch < CACHE_TTL_MS && cache.data.length > 0) {
    return cache.data;
  }

  try {
    const url = process.env.SHEET_CSV_URL;
    if (!url) {
      throw new Error('SHEET_CSV_URL is not defined in environment');
    }

    const response = await axios.get(url);
    const rawData = parse(response.data, {
      columns: (headers) => headers.map(h => String(h).trim().toLowerCase()),
      skip_empty_lines: true
    });

    if (cache.lastFetch === 0 && rawData.length > 0) {
      logger.info({ firstRow: rawData[0] }, 'Logged first row on startup');
    }

    cache.data = rawData;
    cache.lastFetch = Date.now();
    
    return cache.data;
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch or parse Google Sheets CSV');
    await notifyAdmin('SheetsFetchError', error);
    if (cache.data.length > 0) {
      logger.warn('Serving stale data from cache due to fetch failure');
      return cache.data;
    }
    throw error;
  }
}

export async function searchCatalog(keyword) {
  const data = await fetchCatalog();
  const kw = (keyword || '').toLowerCase().trim();

  if (kw === 'all') {
    return data.slice(0, 10);
  }

  const results = data.filter(item => {
    return (item.name && item.name.toLowerCase().includes(kw)) ||
           (item.category && item.category.toLowerCase().includes(kw)) ||
           (item.description && item.description.toLowerCase().includes(kw)) ||
           (item.keywords && item.keywords.toLowerCase().includes(kw));
  });

  return results.slice(0, 10);
}
