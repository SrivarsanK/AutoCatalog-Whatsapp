import { sendText } from './whatsapp.js';
import pino from 'pino';

const logger = pino({ name: 'admin' });
const errorTimestamps = new Map();

export async function notifyAdmin(errorType, errorObj) {
  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) {
    logger.warn('ADMIN_PHONE not configured. Cannot send admin notification.');
    return;
  }

  const lastTime = errorTimestamps.get(errorType) || 0;
  if (Date.now() - lastTime < 60000) {
    logger.debug(`Skipping admin notification for ${errorType} due to rate limiting (1 per minute).`);
    return;
  }

  errorTimestamps.set(errorType, Date.now());

  const message = `🚨 System Error [${errorType}]: ${errorObj.message || String(errorObj)}`;
  
  try {
    await sendText(adminPhone, message);
    logger.info(`Successfully sent admin notification for ${errorType}`);
  } catch (notifyErr) {
    logger.error({ err: notifyErr }, `Failed to send admin notification for ${errorType}`);
  }
}
