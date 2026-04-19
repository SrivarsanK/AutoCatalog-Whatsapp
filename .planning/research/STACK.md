# Stack Research: WhatsApp Catalog Auto-Reply Bot

## Recommended Stack (2026)

### Runtime & Framework
| Component | Choice | Version | Rationale | Confidence |
|-----------|--------|---------|-----------|------------|
| Runtime | Node.js | 20 LTS | ESM native, stable, WhatsApp SDK examples all Node | High |
| Framework | Express.js | 4.x | Simplest webhook server, most tutorials/examples | High |
| HTTP Client | axios | 1.x | Clean API for WhatsApp Cloud API calls + Google Sheets fetch | High |

### Data & Parsing
| Component | Choice | Version | Rationale | Confidence |
|-----------|--------|---------|-----------|------------|
| CSV Parser | csv-parse | 5.x | Streaming, handles edge cases (quoted fields, newlines) | High |
| Cache | In-memory (Map + TTL) | — | Single instance, 1500 msgs/day = no need for Redis | High |

### Logging & Monitoring
| Component | Choice | Version | Rationale | Confidence |
|-----------|--------|---------|-----------|------------|
| Logger | Pino | 9.x | 5x faster than Winston, JSON-native, low overhead | High |
| Process Manager | — | — | Render handles restarts, no PM2 needed | Medium |

### Dev Tools
| Component | Choice | Version | Rationale | Confidence |
|-----------|--------|---------|-----------|------------|
| Env vars | dotenv | 16.x | Load .env in dev, Render injects in prod | High |
| Tunnel | ngrok | — | Expose local webhook for Meta verification | High |
| Linter | — | — | Optional, not critical for 4-file project | Low |

## What NOT to Use

| Technology | Why Not |
|-----------|---------|
| Fastify | Overkill — Express sufficient for single-endpoint webhook |
| Redis | Single instance, 1500 msgs/day, in-memory cache fine |
| MongoDB/PostgreSQL | Google Sheets IS the database — no persistence layer needed |
| Winston | Slower than Pino, more config, no advantage here |
| WhatsApp Web.js | Unofficial, violates ToS, use Cloud API |
| Google Sheets API v4 | Requires OAuth/service account — published CSV simpler |

## Dependencies (package.json)

```json
{
  "type": "module",
  "dependencies": {
    "express": "^4.21.0",
    "axios": "^1.7.0",
    "csv-parse": "^5.6.0",
    "dotenv": "^16.4.0",
    "pino": "^9.5.0",
    "pino-pretty": "^11.3.0"
  }
}
```
