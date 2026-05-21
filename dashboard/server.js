const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;
const BITGET_API = 'https://api.bitget.com/api/v2/mix/market/tickers';
const POLL_INTERVAL_MS = 3000;

let previousData = new Map();
let currentData = new Map();
let priceHistory = new Map();

const MAX_HISTORY = 60;

async function fetchTickers(productType) {
  const url = `${BITGET_API}?productType=${productType}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Bitget API error: ${res.status}`);
  const json = await res.json();
  if (json.code !== '00000') throw new Error(`Bitget API error: ${json.msg}`);
  return json.data || [];
}

function computeChanges(tickers) {
  const results = [];

  for (const t of tickers) {
    const symbol = t.symbol;
    const lastPr = parseFloat(t.lastPr);
    const prev = previousData.get(symbol);
    const prevPrice = prev ? parseFloat(prev.lastPr) : lastPr;
    const priceDelta = lastPr - prevPrice;
    const priceDeltaPct = prevPrice !== 0 ? (priceDelta / prevPrice) * 100 : 0;

    if (!priceHistory.has(symbol)) priceHistory.set(symbol, []);
    const hist = priceHistory.get(symbol);
    hist.push({ price: lastPr, ts: Date.now() });
    if (hist.length > MAX_HISTORY) hist.shift();

    results.push({
      symbol,
      lastPr: t.lastPr,
      askPr: t.askPr,
      bidPr: t.bidPr,
      high24h: t.high24h,
      low24h: t.low24h,
      open24h: t.open24h,
      change24h: t.change24h,
      changeUtc24h: t.changeUtc24h,
      baseVolume: t.baseVolume,
      quoteVolume: t.quoteVolume,
      usdtVolume: t.usdtVolume,
      indexPrice: t.indexPrice,
      markPrice: t.markPrice,
      fundingRate: t.fundingRate,
      holdingAmount: t.holdingAmount,
      bidSz: t.bidSz,
      askSz: t.askSz,
      priceDelta: priceDelta.toFixed(6),
      priceDeltaPct: priceDeltaPct.toFixed(4),
      sparkline: hist.map(h => h.price),
    });
  }

  return results;
}

async function pollAndBroadcast() {
  try {
    const tickers = await fetchTickers('USDT-FUTURES');
    previousData = new Map(currentData);
    currentData = new Map(tickers.map(t => [t.symbol, t]));

    const enriched = computeChanges(tickers);

    const payload = JSON.stringify({
      type: 'update',
      ts: Date.now(),
      data: enriched,
    });

    for (const client of wss.clients) {
      if (client.readyState === 1) client.send(payload);
    }
  } catch (err) {
    console.error('[poll error]', err.message);
  }
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/tickers', async (_req, res) => {
  try {
    const tickers = await fetchTickers('USDT-FUTURES');
    res.json({ ok: true, data: tickers });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

wss.on('connection', (ws) => {
  console.log('[ws] client connected');
  if (currentData.size > 0) {
    const enriched = computeChanges([...currentData.values()]);
    ws.send(JSON.stringify({ type: 'update', ts: Date.now(), data: enriched }));
  }
  ws.on('close', () => console.log('[ws] client disconnected'));
});

server.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
  setInterval(pollAndBroadcast, POLL_INTERVAL_MS);
  pollAndBroadcast();
});
