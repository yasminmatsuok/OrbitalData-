// =============================================
//  OrbitalData — mapa.js
//  Interatividade do mapa do Brasil
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  const tooltip    = document.getElementById('mapa-tooltip');
  const ttEstado   = document.getElementById('tt-estado');
  const ttCo2      = document.getElementById('tt-co2');
  const ttTemp     = document.getElementById('tt-temp');
  const ttFogo     = document.getElementById('tt-fogo');
  const ttNivel    = document.getElementById('tt-nivel');
  const detContent = document.getElementById('detalhe-content');
  const detPlaceholder = document.getElementById('detalhe-placeholder');

  const nivelLabels = {
    'nivel-baixo':   { label: 'Baixo',   color: 'var(--green)' },
    'nivel-medio':   { label: 'Médio',   color: 'var(--amber)' },
    'nivel-alto':    { label: 'Alto',    color: 'var(--red)' },
    'nivel-critico': { label: 'Crítico', color: '#ff0030' },
  };

  // ── Tooltip nos estados ──────────────────

  document.querySelectorAll('.estado').forEach(estado => {
    estado.addEventListener('mouseenter', (e) => {
      const nome  = estado.dataset.estado;
      const co2   = estado.dataset.co2;
      const temp  = estado.dataset.temp;
      const fogo  = estado.dataset.fogo;
      const nivel = [...estado.classList].find(c => c.startsWith('nivel-'));

      ttEstado.textContent = nome;
      ttCo2.textContent    = co2 + ' MtCO₂';
      ttTemp.textContent   = temp + '°C';
      ttFogo.textContent   = fogo + ' focos';
      ttNivel.textContent  = nivelLabels[nivel]?.label || '—';
      ttNivel.style.color  = nivelLabels[nivel]?.color || 'var(--text-primary)';

      tooltip.classList.add('show');
    });

    estado.addEventListener('mousemove', (e) => {
      const rect = document.querySelector('.mapa-area').getBoundingClientRect();
      let x = e.clientX - rect.left + 16;
      let y = e.clientY - rect.top + 16;

      // Evita sair da tela
      if (x + 220 > rect.width)  x = e.clientX - rect.left - 230;
      if (y + 160 > rect.height) y = e.clientY - rect.top  - 160;

      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
    });

    estado.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });

    // ── Clique → painel de detalhes ──
    estado.addEventListener('click', () => {
      // Remove seleção anterior
      document.querySelectorAll('.estado').forEach(e => e.classList.remove('selected-state'));
      estado.classList.add('selected-state');

      const nome  = estado.dataset.estado;
      const co2   = estado.dataset.co2;
      const temp  = estado.dataset.temp;
      const fogo  = estado.dataset.fogo;
      const nivel = [...estado.classList].find(c => c.startsWith('nivel-'));
      const nivelInfo = nivelLabels[nivel] || { label: '—', color: 'var(--text-primary)' };

      document.getElementById('det-nome').textContent  = nome;
      document.getElementById('det-co2').textContent   = co2 + ' MtCO₂';
      document.getElementById('det-co2').style.color   = nivelInfo.color;
      document.getElementById('det-temp').textContent  = temp + '°C';
      document.getElementById('det-fogo').textContent  = fogo + ' focos';
      document.getElementById('det-nivel').textContent = nivelInfo.label;
      document.getElementById('det-nivel').style.color = nivelInfo.color;

      detPlaceholder.style.display = 'none';
      detContent.style.display     = 'block';
    });
  });

  // ── Filtros de camada ────────────────────

  document.querySelectorAll('[data-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-layer]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('camada-ativa').textContent = btn.textContent;
    });
  });

  // Filtros de período
  document.querySelectorAll('.mapa-filtros .filtro-btn:not([data-layer])').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mapa-filtros .filtro-btn:not([data-layer])')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ── Biomas na sidebar ────────────────────

  const biomas = [
    { nome: 'Amazônia',       co2: 48.2, cor: '#ff4560', pct: 88 },
    { nome: 'Cerrado',        co2: 31.7, cor: '#ffb830', pct: 65 },
    { nome: 'Mata Atlântica', co2: 18.4, cor: '#3a7bd5', pct: 40 },
    { nome: 'Pantanal',       co2: 12.1, cor: '#00e5a0', pct: 28 },
    { nome: 'Caatinga',       co2: 9.8,  cor: '#7a9fff', pct: 22 },
    { nome: 'Pampa',          co2: 4.2,  cor: '#5a9ae8', pct: 10 },
  ];

  const lista = document.getElementById('regiao-list');
  if (lista) {
    lista.innerHTML = biomas.map(b => `
      <div class="mapa-regiao-item">
        <div class="mapa-regiao-top">
          <div class="mapa-regiao-nome" style="display:flex;align-items:center;gap:0.4rem;">
            <span style="width:8px;height:8px;border-radius:50%;background:${b.cor};display:inline-block;box-shadow:0 0 6px ${b.cor}88;"></span>
            ${b.nome}
          </div>
          <div class="mapa-regiao-val">${b.co2} Mt</div>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${b.pct}%;background:${b.cor};"></div>
        </div>
      </div>
    `).join('');
  }

  // ── Relógio UTC ──────────────────────────

  function updateClock() {
    const utc = new Date().toUTCString().split(' ')[4];
    const el  = document.getElementById('mapa-hora');
    if (el) el.textContent = 'UTC: ' + utc;
  }
  updateClock();
  setInterval(updateClock, 1000);

});