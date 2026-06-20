const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8080);
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const FALLBACK_MODEL = 'claude-haiku-4-5-20251001';
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf'
};

loadDotEnv();

function loadDotEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) process.env[key] = value;
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function parseQuoteData() {
  try {
    const source = fs.readFileSync(path.join(ROOT, 'quote-pricing-data.js'), 'utf8');
    const match = source.match(/window\.PCT_QUOTE_DATA\s*=\s*({[\s\S]*?})\s*;/);
    return match ? JSON.parse(match[1]) : {};
  } catch (err) {
    return {};
  }
}

function itemLine(item) {
  const parts = [
    item.name,
    item.duration ? `${item.duration}` : '',
    Number.isFinite(Number(item.priceCOP)) ? `base price: COP ${Number(item.priceCOP).toLocaleString('en-US')}` : '',
    item.desc || item.subtitle || '',
    item.included?.length ? `Includes: ${item.included.slice(0, 5).join(', ')}` : ''
  ].filter(Boolean);
  return `- ${parts.join(' | ')}`;
}

function buildKnowledge() {
  const data = parseQuoteData();
  const tours = (data.tours || []).slice(0, 40).map(itemLine).join('\n');
  const boats = (data.boats || []).slice(0, 30).map(itemLine).join('\n');
  const clubs = (data.clubs || []).slice(0, 30).map(itemLine).join('\n');
  return `
Critical exact facts:
- Assistant name: Andrea.
- Supported customer languages right now: English, Spanish, Portuguese. Always answer in the customer's language.
- ATV Tour on Tierra Bomba Island: 3 time slots: 10am, 1pm, 4pm.
- ATV checkout pricing: single ATV is $115 USD for 1 person on 1 ATV. Double ATV is $135 USD for 2 people sharing 1 ATV.
- If the ATV homepage card shows a different "from" price, explain that the card is the public starting display price and the checkout options are single/double ATV setup prices.
- Top Cartagena tour cards on the homepage: ATV Tour, Cholon Island Tour, Bora Bora Beach Club, 5 Island Tour.
- Never promise live availability. Say the team can confirm availability manually.
- Do not quote cancellation/refund policies. Offer to connect them with the team.
- Do not collect credit card details.
- Most island/beach club guests should bring COP cash for port tax/reserve fees, tips, extra drinks, and optional extras.

Tours:
${tours || '- Tour data unavailable.'}

Private boats:
${boats || '- Boat data unavailable.'}

Beach clubs:
${clubs || '- Beach club data unavailable.'}
`;
}

function formatPageContext(pageContext) {
  if (!pageContext || typeof pageContext !== 'object') return '';
  const tours = Array.isArray(pageContext.visibleTours) ? pageContext.visibleTours : [];
  const facts = Array.isArray(pageContext.exactFacts) ? pageContext.exactFacts : [];
  const visibleTourLines = tours
    .filter(item => item && item.name)
    .map(item => `- ${item.name}${item.price ? ` | visible card price: ${item.price}` : ''}${item.duration ? ` | ${item.duration}` : ''}${item.description ? ` | ${item.description}` : ''}`)
    .join('\n');
  const factLines = facts.map(fact => `- ${String(fact).slice(0, 300)}`).join('\n');
  return `
Live page context from the visitor's current screen:
- Selected currency: ${pageContext.currency || 'unknown'}
${visibleTourLines ? `Visible homepage tour cards:\n${visibleTourLines}` : ''}
${factLines ? `Current exact facts:\n${factLines}` : ''}
`;
}

function systemPrompt(language, pageContext) {
  const languageInstruction = {
    en: 'Answer in English.',
    es: 'Answer in Spanish.',
    pt: 'Answer in Portuguese.'
  }[language] || 'Answer in the same language the customer used.';

  return `
You are Andrea, the AI assistant for Haven Cartagena Tours.
${languageInstruction}

Style:
- Sound like a knowledgeable, friendly local travel assistant.
- Keep answers concise: usually 2 to 5 short sentences.
- If the customer asks for a recommendation, ask for group size/date/vibe only if needed.
- If a customer is ready to book or asks live availability, explain that the human team confirms manually on WhatsApp.
- If the live page context includes visible card prices, those prices are more current than base COP prices. Use the visible card prices for public "from" prices.
- Do not convert COP to USD yourself unless the user explicitly asks for an estimate and no visible price is available.
- Use the provided knowledge. If the answer is not in the knowledge, do not invent details.

${formatPageContext(pageContext)}
${buildKnowledge()}
`;
}

function normalizeHistory(history, message) {
  const safe = Array.isArray(history) ? history : [];
  const messages = safe
    .filter(item => item && (item.role === 'user' || item.role === 'assistant') && item.content)
    .slice(-8)
    .map(item => ({ role: item.role, content: String(item.content).slice(0, 1200) }));
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user' || last.content.trim() !== message.trim()) {
    messages.push({ role: 'user', content: message });
  }
  return messages;
}

async function handleAssistant(req, res) {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, { error: 'ANTHROPIC_API_KEY is not configured on the server.' });
  }

  try {
    const payload = JSON.parse(await readBody(req));
    const message = String(payload.message || '').trim();
    const language = ['en', 'es', 'pt'].includes(payload.language) ? payload.language : 'en';
    if (!message) return sendJson(res, 400, { error: 'Message is required.' });

    const requestPayload = {
      model: MODEL,
      max_tokens: 360,
      temperature: 0.3,
      system: systemPrompt(language, payload.pageContext),
      messages: normalizeHistory(payload.history, message)
    };

    let anthropicResponse = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestPayload)
    });

    let data = await anthropicResponse.json();
    const modelError = !anthropicResponse.ok && /model/i.test(data?.error?.message || '');
    if (modelError && requestPayload.model !== FALLBACK_MODEL) {
      requestPayload.model = FALLBACK_MODEL;
      anthropicResponse = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestPayload)
      });
      data = await anthropicResponse.json();
    }

    if (!anthropicResponse.ok) {
      return sendJson(res, anthropicResponse.status, {
        error: data?.error?.message || 'Anthropic request failed.'
      });
    }

    const reply = (data.content || [])
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim();

    sendJson(res, 200, { reply });
  } catch (err) {
    sendJson(res, 500, { error: err.message || 'Assistant error.' });
  }
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let requestedPath = decodeURIComponent(url.pathname);
  if (requestedPath === '/') requestedPath = '/index.html';
  const fullPath = path.resolve(ROOT, `.${requestedPath}`);
  if (!fullPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(fullPath).toLowerCase()] || 'application/octet-stream'
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/assistant')) return handleAssistant(req, res);
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Haven Cartagena Tours running at http://localhost:${PORT}`);
  console.log(process.env.ANTHROPIC_API_KEY ? 'Andrea is connected to Claude.' : 'Andrea is using browser fallback until ANTHROPIC_API_KEY is set.');
});
