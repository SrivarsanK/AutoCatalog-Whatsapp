import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
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

app.use(httpLogger);
app.use(express.json());

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

app.post('/webhook', async (req, res) => {
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
