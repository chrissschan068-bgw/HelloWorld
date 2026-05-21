(() => {
  'use strict';

  const tbody = document.getElementById('ticker-body');
  const searchInput = document.getElementById('search');
  const sortBySelect = document.getElementById('sort-by');
  const sortDirSelect = document.getElementById('sort-dir');
  const flashToggle = document.getElementById('flash-toggle');
  const wsStatus = document.getElementById('ws-status');
  const lastUpdateEl = document.getElementById('last-update');
  const statsEl = document.getElementById('stats');

  let allData = [];
  let sortKey = 'usdtVolume';
  let sortDir = 'desc';
  let searchTerm = '';
  let ws = null;
  let reconnectTimer = null;

  function formatNum(val, decimals = 2) {
    const n = parseFloat(val);
    if (isNaN(n)) return '-';
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(2) + 'K';
    return n.toFixed(decimals);
  }

  function formatPrice(val) {
    const n = parseFloat(val);
    if (isNaN(n)) return '-';
    if (n >= 1000) return n.toFixed(2);
    if (n >= 1) return n.toFixed(4);
    if (n >= 0.01) return n.toFixed(6);
    return n.toFixed(8);
  }

  function formatPct(val) {
    const n = parseFloat(val);
    if (isNaN(n)) return '-';
    return (n >= 0 ? '+' : '') + (n * 100).toFixed(2) + '%';
  }

  function formatTickPct(val) {
    const n = parseFloat(val);
    if (isNaN(n)) return '-';
    return (n >= 0 ? '+' : '') + n + '%';
  }

  function pctClass(val) {
    const n = parseFloat(val);
    if (isNaN(n) || n === 0) return 'neutral';
    return n > 0 ? 'positive' : 'negative';
  }

  function drawSparkline(canvas, prices) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!prices || prices.length < 2) return;

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    const isUp = prices[prices.length - 1] >= prices[0];
    ctx.strokeStyle = isUp ? '#00c896' : '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < prices.length; i++) {
      const x = (i / (prices.length - 1)) * w;
      const y = h - ((prices[i] - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function splitSymbol(sym) {
    const match = sym.match(/^(.+?)(USDT|USDC|USD)$/);
    if (match) return { base: match[1], quote: match[2] };
    return { base: sym, quote: '' };
  }

  function computeSpread(ask, bid) {
    const a = parseFloat(ask);
    const b = parseFloat(bid);
    if (isNaN(a) || isNaN(b) || b === 0) return '-';
    const mid = (a + b) / 2;
    if (mid === 0) return '-';
    return ((a - b) / mid * 100).toFixed(4) + '%';
  }

  function sortData(data) {
    const copy = [...data];
    copy.sort((a, b) => {
      let va, vb;
      if (sortKey === 'symbol') {
        va = a.symbol;
        vb = b.symbol;
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      va = parseFloat(a[sortKey]) || 0;
      vb = parseFloat(b[sortKey]) || 0;
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return copy;
  }

  function filterData(data) {
    if (!searchTerm) return data;
    const q = searchTerm.toUpperCase();
    return data.filter(d => d.symbol.includes(q));
  }

  const prevPrices = new Map();

  function render(data) {
    const filtered = filterData(sortData(data));

    const gainers = data.filter(d => parseFloat(d.changeUtc24h) > 0).length;
    const losers = data.filter(d => parseFloat(d.changeUtc24h) < 0).length;
    statsEl.textContent = `${data.length} contracts | ${gainers} up | ${losers} down`;

    const existingRows = new Map();
    for (const row of tbody.children) {
      existingRows.set(row.dataset.symbol, row);
    }

    const flashEnabled = flashToggle.checked;
    const fragment = document.createDocumentFragment();

    filtered.forEach((d, idx) => {
      const { base, quote } = splitSymbol(d.symbol);
      const chg24class = pctClass(d.changeUtc24h);
      const tickClass = pctClass(d.priceDeltaPct);
      const fundingVal = parseFloat(d.fundingRate);
      const fundingClass = isNaN(fundingVal) || fundingVal === 0 ? 'neutral' : fundingVal > 0 ? 'positive' : 'negative';

      let tr = existingRows.get(d.symbol);
      let isNew = false;
      if (!tr) {
        tr = document.createElement('tr');
        tr.dataset.symbol = d.symbol;
        isNew = true;
      }

      if (flashEnabled && !isNew) {
        const delta = parseFloat(d.priceDelta);
        if (delta > 0) {
          tr.classList.remove('flash-red', 'flash-green');
          void tr.offsetWidth;
          tr.classList.add('flash-green');
        } else if (delta < 0) {
          tr.classList.remove('flash-green', 'flash-red');
          void tr.offsetWidth;
          tr.classList.add('flash-red');
        }
      }

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><div class="symbol-cell"><span class="symbol-base">${base}</span><span class="symbol-quote">/${quote}</span></div></td>
        <td>${formatPrice(d.lastPr)}</td>
        <td><canvas class="sparkline" width="80" height="28" data-symbol="${d.symbol}"></canvas></td>
        <td><span class="badge ${parseFloat(d.priceDeltaPct) > 0 ? 'up' : parseFloat(d.priceDeltaPct) < 0 ? 'down' : 'flat'}">${formatTickPct(d.priceDeltaPct)}</span></td>
        <td class="${chg24class}">${formatPct(d.changeUtc24h)}</td>
        <td>${formatPrice(d.high24h)}</td>
        <td>${formatPrice(d.low24h)}</td>
        <td>${formatNum(d.usdtVolume, 0)}</td>
        <td>${formatNum(d.holdingAmount, 2)}</td>
        <td class="${fundingClass}">${fundingVal !== null ? (fundingVal * 100).toFixed(4) + '%' : '-'}</td>
        <td>${formatPrice(d.indexPrice)}</td>
        <td>${formatPrice(d.markPrice)}</td>
        <td class="neutral">${computeSpread(d.askPr, d.bidPr)}</td>
      `;

      fragment.appendChild(tr);
    });

    tbody.replaceChildren(fragment);

    for (const d of filtered) {
      const canvas = tbody.querySelector(`canvas[data-symbol="${d.symbol}"]`);
      if (canvas && d.sparkline) drawSparkline(canvas, d.sparkline);
    }
  }

  function connectWS() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${proto}//${location.host}`);

    ws.onopen = () => {
      wsStatus.className = 'status connected';
      wsStatus.querySelector('.label').textContent = 'Live';
      if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === 'update') {
          allData = msg.data;
          render(allData);
          const d = new Date(msg.ts);
          lastUpdateEl.textContent = d.toLocaleTimeString();
        }
      } catch (e) {
        console.error('ws parse error', e);
      }
    };

    ws.onclose = () => {
      wsStatus.className = 'status disconnected';
      wsStatus.querySelector('.label').textContent = 'Disconnected';
      reconnectTimer = setTimeout(connectWS, 3000);
    };

    ws.onerror = () => ws.close();
  }

  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    render(allData);
  });

  sortBySelect.addEventListener('change', (e) => {
    sortKey = e.target.value;
    render(allData);
  });

  sortDirSelect.addEventListener('change', (e) => {
    sortDir = e.target.value;
    render(allData);
  });

  document.querySelectorAll('thead th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (sortKey === key) {
        sortDir = sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        sortKey = key;
        sortDir = 'desc';
      }
      sortBySelect.value = key;
      sortDirSelect.value = sortDir;
      document.querySelectorAll('thead th').forEach(t => t.classList.remove('active'));
      th.classList.add('active');
      render(allData);
    });
  });

  connectWS();
})();
