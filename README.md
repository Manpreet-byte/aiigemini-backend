# AIII Gemini Backend

Express.js proxy server for secure Gemini API calls with Firebase integration.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your Gemini API key
npm run dev
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `ALLOWED_ORIGIN` - CORS origin (e.g., http://localhost:5176)
- `GEMINI_API_KEY` - Google Gemini API key
- `GEMINI_TEXT_MODEL` - Text model (default: gemini-2.5-flash-preview-09-2025)
- `GEMINI_VISION_MODEL` - Vision model (default: gemini-2.0-flash-exp)

## Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Text chat (v1beta)
- `POST /api/vision` - Image analysis (v1beta)

## Architecture

Secure proxy that:
- Proxies all Gemini API calls server-side
- Keeps API key out of client code
- Enforces CORS for frontend origin
- Supports both text and vision models
