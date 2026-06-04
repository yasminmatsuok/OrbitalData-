// =============================================
//  OrbitalData — dashboard.js
//  Gráficos, dados e interações do dashboard
// =============================================

// ── Dados mockados ──────────────────────────

const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

const co2Data = [418.2, 418.8, 419.1, 419.6, 420.1, 420.4, 420.8, 421.0, 421.1, 421.3, 421.2, 421.3];
const co2Meta = [419.0, 419.0, 419.0, 419.0, 419.0, 419.0, 419.0, 419.0, 419.0, 419.0, 419.0, 419.0];

const tempData = [28.1, 29.3, 30.8, 31.2, 32.4, 33.1, 34.2, 33.8, 32.1, 30.4, 29.8, 28.6];

const fireData = [320, 290, 410, 560, 890, 1240, 1247, 980, 720, 540, 380, 290];

const regions = [
  { name: 'Amazônia',       val: 48.2, color: '#ff4560', pct: 88 },
  { name: 'Cerrado',        val: 31.7, color: '#ffb830', pct: 65 },
  { name: 'Mata Atlântica', val: 18.4, color: '#3a7bd5', pct: 40 },
  { name: 'Pantanal',       val: 12.1, color: '#00e5a0', pct: 28 },
  { name: 'Caatinga',       val: 9.8,  color: '#7a9fff', pct: 22 },
];

const satellites = [
  { name: 'NASA AQUA',      orbit: 'LEO 705km', ping: '12ms',  status: 'green',  icon: '🛰️' },
  { name: 'NASA TERRA',     orbit: 'LEO 705km', ping: '14ms',  status: 'green',  icon: '🛰️' },
  { name: 'ESA SENTINEL-5', orbit: 'SSO 824km', ping: '18ms',  status: 'green',  icon: '🛰️' },
  { name: 'ESA SENTINEL-3', orbit: 'SSO 814km', ping: '21ms',  status: 'amber',  icon: '🛰️' },
  { name: 'INPE AMAZONIA-1',orbit: 'SSO 752km', ping: '09ms',  status: 'green',  icon: '🛰️' },
];

const alertsData = [
  { type: 'danger',  icon: '🔥', title: 'Foco de queimada detectado', meta: 'Pará, BR · Há 4 min' },
  { type: 'warning', icon: '🌡️', title: 'Temperatura acima do normal', meta: 'Mato Grosso · Há 12 min' },
  { type: 'info',    icon: '🛰️', title: 'Nova passagem SENTINEL-5',   meta: 'Cobertura BR · Há 18 min' },
  { type: 'warning', icon: '💨', title: 'CO₂ acima de 422 ppm',       meta: 'Global · Há 31 min' },
  { type: 'success', icon: '🌿', title: 'Área reflorestada confirmada',meta: 'Amazônia · Há 45 min' },
];

// ── Sparklines ──────────────────────────────

function renderSparkline(id, values, colorClass) {
  const el = document.getElementById(id);
  if (!el) return;
  const max = Math.max(...values);
  const min = Math.min(...values);
  el.className = 'sparkline';
  values.forEach((v, i) => {
    const bar = document.createElement('div');
    const h = Math.round(((v - min) / (max - min || 1)) * 28 + 6);
    bar.className = `spark-bar ${colorClass}`;
    bar.style.height = h + 'px';
    el.appendChild(bar);
  });
}

// ── CO₂ Line Chart ──────────────────────────

function renderCO2Chart() {
  const svg = document.getElementById('co2-chart');
  if (!svg) return;

  const W = 600, H = 180, padL = 40, padR = 20, padT = 15, padB = 30;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const allVals = [...co2Data, ...co2Meta];
  const minV = Math.min(...allVals) - 0.5;
  const maxV = Math.max(...allVals) + 0.5;

  const xScale = i => padL + (i / (co2Data.length - 1)) * cW;
  const yScale = v => padT + cH - ((v - minV) / (maxV - minV)) * cH;

  let html = '';

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padT + (i / 4) * cH;
    const val = (maxV - (i / 4) * (maxV - minV)).toFixed(1);
    html += `<line class="chart-grid-line" x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}"/>`;
    html += `<text class="chart-axis-label" x="${padL - 5}" y="${y + 3}" text-anchor="end">${val}</text>`;
  }

  // Month labels
  meses.forEach((m, i) => {
    html += `<text class="chart-axis-label" x="${xScale(i)}" y="${H - 5}" text-anchor="middle">${m}</text>`;
  });

  // Area fill CO2
  const areaPath = co2Data.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(v)}`).join(' ')
    + ` L${xScale(co2Data.length-1)},${padT + cH} L${xScale(0)},${padT + cH} Z`;
  html += `<path class="chart-area-fill blue" d="${areaPath}"/>`;

  // Meta line (dashed)
  const metaPath = co2Meta.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(v)}`).join(' ');
  html += `<path d="${metaPath}" fill="none" stroke="var(--green)" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.6"/>`;

  // CO2 line
  const linePath = co2Data.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(v)}`).join(' ');
  html += `<path class="chart-line blue" d="${linePath}"/>`;

  // Dots
  co2Data.forEach((v, i) => {
    if (i === co2Data.length - 1) {
      html += `<circle class="chart-dot blue" cx="${xScale(i)}" cy="${yScale(v)}" r="4"/>`;
      html += `<text class="chart-axis-label" x="${xScale(i) + 6}" y="${yScale(v) - 4}" fill="var(--blue-bright)">${v}</text>`;
    }
  });

  svg.innerHTML = html;
}

// ── Temperature Bar Chart ────────────────────

function renderTempChart() {
  const svg = document.getElementById('temp-chart');
  if (!svg) return;

  const W = 260, H = 160, padL = 28, padB = 22, padT = 10;
  const cW = W - padL - 10;
  const cH = H - padT - padB;
  const barW = (cW / tempData.length) * 0.6;
  const gap   = cW / tempData.length;
  const maxV  = Math.max(...tempData);

  let html = '';

  // Grid
  for (let i = 0; i <= 3; i++) {
    const y = padT + (i / 3) * cH;
    html += `<line class="chart-grid-line" x1="${padL}" y1="${y}" x2="${W}" y2="${y}"/>`;
  }

  tempData.forEach((v, i) => {
    const bH = (v / maxV) * cH;
    const x  = padL + i * gap + gap * 0.2;
    const y  = padT + cH - bH;
    const color = v >= 33 ? 'var(--red)' : v >= 31 ? 'var(--amber)' : 'var(--blue-bright)';
    html += `<rect x="${x}" y="${y}" width="${barW}" height="${bH}" rx="2" fill="${color}" opacity="0.85"/>`;
    html += `<text class="chart-axis-label" x="${x + barW/2}" y="${H - 6}" text-anchor="middle">${meses[i].slice(0,1)}</text>`;
  });

  svg.innerHTML = html;
}

// ── Queimadas Bar Chart ──────────────────────

function renderFireChart() {
  const svg = document.getElementById('fire-chart');
  if (!svg) return;

  const W = 600, H = 180, padL = 45, padR = 20, padT = 15, padB = 30;
  const cW = W - padL - padR;
  const cH = H - padT - padB;
  const maxV = Math.max(...fireData);
  const barW = (cW / fireData.length) * 0.55;
  const gap  = cW / fireData.length;

  let html = '';

  // Grid + labels Y
  for (let i = 0; i <= 4; i++) {
    const y   = padT + (i / 4) * cH;
    const val = Math.round(maxV - (i / 4) * maxV);
    html += `<line class="chart-grid-line" x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}"/>`;
    html += `<text class="chart-axis-label" x="${padL - 5}" y="${y + 3}" text-anchor="end">${val}</text>`;
  }

  fireData.forEach((v, i) => {
    const bH  = (v / maxV) * cH;
    const x   = padL + i * gap + gap * 0.225;
    const y   = padT + cH - bH;
    const pct = v / maxV;
    const color = pct > 0.8 ? 'var(--red)' : pct > 0.5 ? 'var(--amber)' : 'var(--blue)';
    html += `<rect x="${x}" y="${y}" width="${barW}" height="${bH}" rx="3" fill="${color}" opacity="0.8"/>`;
    html += `<text class="chart-axis-label" x="${x + barW/2}" y="${H - 8}" text-anchor="middle">${meses[i]}</text>`;
    if (i === 6) {
      html += `<text class="chart-axis-label" x="${x + barW/2}" y="${y - 4}" text-anchor="middle" fill="var(--red)">${v}</text>`;
    }
  });

  svg.innerHTML = html;
}

// ── Regions list ─────────────────────────────

function renderRegions() {
  const el = document.getElementById('region-list');
  if (!el) return;
  el.innerHTML = regions.map(r => `
    <div class="region-item">
      <div class="region-dot" style="background:${r.color};box-shadow:0 0 6px ${r.color}66;"></div>
      <div class="region-name">${r.name}</div>
      <div class="region-bar-wrap">
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${r.pct}%;background:${r.color};"></div>
        </div>
      </div>
      <div class="region-val">${r.val} Mt</div>
    </div>
  `).join('');
}

// ── Alert feed ───────────────────────────────

function renderAlerts() {
  const el = document.getElementById('alert-feed');
  if (!el) return;
  el.innerHTML = alertsData.map(a => `
    <div class="alert-feed-item">
      <div class="alert-feed-icon ${a.type}">${a.icon}</div>
      <div>
        <div class="alert-feed-title">${a.title}</div>
        <div class="alert-feed-meta">${a.meta}</div>
      </div>
    </div>
  `).join('');
}

// ── Satellite list ───────────────────────────

function renderSatellites() {
  const el = document.getElementById('sat-list');
  if (!el) return;
  const colors = { green: 'var(--green)', amber: 'var(--amber)', red: 'var(--red)' };
  el.innerHTML = satellites.map(s => `
    <div class="sat-item">
      <div class="sat-icon-sm">${s.icon}</div>
      <div style="flex:1;min-width:0;">
        <div class="sat-name">${s.name}</div>
        <div class="sat-orbit">${s.orbit}</div>
      </div>
      <div style="text-align:right;">
        <div class="sat-ping" style="color:${colors[s.status]}">${s.ping}</div>
        <div class="sat-orbit">${s.status.toUpperCase()}</div>
      </div>
    </div>
  `).join('');
}

// ── Relógio UTC ───────────────────────────────

function startClock() {
  function update() {
    const now = new Date();
    const utc = now.toUTCString().split(' ')[4];
    const el = document.getElementById('last-update');
    if (el) el.textContent = `Atualizado: ${utc} UTC`;

    const badge = document.querySelector('.nav-badge');
    if (badge) badge.innerHTML = `<span class="dot" style="width:6px;height:6px;background:var(--green);border-radius:50%;animation:pulse-dot 2s infinite;display:inline-block;"></span> AO VIVO ${utc} UTC`;
  }
  update();
  setInterval(update, 1000);
}

// ── Init ─────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderSparkline('spark-co2',    [418.2,418.5,419.0,419.4,420.1,420.4,420.8,421.0,421.1,421.3], 'blue');
  renderSparkline('spark-temp',   [28,29,31,32,33,34,34,33,32,30], 'red');
  renderSparkline('spark-fire',   [320,290,410,560,890,1240,1247,980,720,540], 'amber');
  renderSparkline('spark-forest', [59.1,59.0,58.9,58.8,58.7,58.6,58.5,58.5,58.4,58.4], 'green');

  renderCO2Chart();
  renderTempChart();
  renderFireChart();
  renderRegions();
  renderAlerts();
  renderSatellites();
  startClock();
});