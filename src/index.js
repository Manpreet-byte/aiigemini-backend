import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5174';

app.use(cors({
  origin: ALLOWED_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash-preview-09-2025';
const GEMINI_VISION_MODEL = process.env.GEMINI_VISION_MODEL || 'gemini-1.5-flash';
// Use v1beta for both endpoints (supports systemInstruction)
const GEMINI_API_VERSION_TEXT = process.env.GEMINI_API_VERSION_TEXT || 'v1beta';
const GEMINI_API_VERSION_VISION = process.env.GEMINI_API_VERSION_VISION || 'v1beta';

if (!GEMINI_API_KEY) {
  console.warn('[WARN] GEMINI_API_KEY is not set. Text/Vision endpoints will fail.');
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy for text chat
app.post('/api/chat', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server misconfigured: GEMINI_API_KEY missing' });
    }

    const url = `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION_TEXT}/models/${GEMINI_TEXT_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error('[chat] Error:', err);
    res.status(500).json({ error: 'Failed to call Gemini text API' });
  }
});

// Proxy for vision analysis
app.post('/api/vision', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server misconfigured: GEMINI_API_KEY missing' });
    }

    const url = `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION_VISION}/models/${GEMINI_VISION_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error('[vision] Error:', err);
    res.status(500).json({ error: 'Failed to call Gemini vision API' });
  }
});

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  console.log(`[server] Allowed origin: ${ALLOWED_ORIGIN}`);
  console.log(`[server] Text model: ${GEMINI_TEXT_MODEL} (version: ${GEMINI_API_VERSION_TEXT})`);
  console.log(`[server] Vision model: ${GEMINI_VISION_MODEL} (version: ${GEMINI_API_VERSION_VISION})`);
});
