import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { handleMessage } from './handler.js';

const app = express();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { translateTime: 'SYS:standard' }
    }
  })
});

const httpLogger = pinoHttp({ 
  logger,
  redact: ['req.headers.authorization', 'req.headers["x-hub-signature-256"]']
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests' }
});

app.use(httpLogger);
app.use(limiter);
// We need the raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

function verifySignature(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    logger.warn('Missing X-Hub-Signature-256 header');
    return res.sendStatus(403);
  }

  const elements = signature.split('=');
  const signatureHash = elements[1];
  const expectedHash = crypto
    .createHmac('sha256', process.env.APP_SECRET || '')
    .update(req.rawBody)
    .digest('hex');

  if (signatureHash !== expectedHash) {
    logger.error('Webhook signature verification failed');
    return res.sendStatus(403);
  }
  next();
}

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    logger.info('Meta webhook verified.');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', verifySignature, async (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const sender = message.from;
      const text = message.type === 'text' ? message.text?.body : '';
      
      await handleMessage(sender, text);
    }
  } catch (error) {
    logger.error({ err: error }, 'Error processing webhook POST');
  } finally {
    // SRVR-04: POST /webhook always returns 200 to Meta regardless of processing outcome
    res.sendStatus(200);
  }
});
app.use((err, req, res, next) => {
  logger.error({ err }, 'Unhandled error or malformed request');
  // SRVR-04: always return 200 to prevent Webhook retries
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
