// =============================================
//  OrbitalData — satelites.js
// =============================================

const satelitesData = [
  { nome:'NASA AQUA',        agencia:'NASA', orbita:'LEO', alt:'705 km', status:'online',  ping:'12ms', sinal:5, ultima:'2 min atrás',  missao:'Temperatura e vapor d\'água' },
  { nome:'NASA TERRA',       agencia:'NASA', orbita:'LEO', alt:'705 km', status:'online',  ping:'14ms', sinal:5, ultima:'8 min atrás',  missao:'Vegetação e uso do solo' },
  { nome:'ESA SENTINEL-5P',  agencia:'ESA',  orbita:'SSO', alt:'824 km', status:'online',  ping:'18ms', sinal:4, ultima:'5 min atrás',  missao:'Qualidade do ar e gases' },
  { nome:'ESA SENTINEL-3A',  agencia:'ESA',  orbita:'SSO', alt:'814 km', status:'online',  ping:'21ms', sinal:4, ultima:'11 min atrás', missao:'Temperatura oceânica' },
  { nome:'ESA SENTINEL-3B',  agencia:'ESA',  orbita:'SSO', alt:'814 km', status:'alerta',  ping:'45ms', sinal:2, ultima:'32 min atrás', missao:'Temperatura oceânica' },
  { nome:'INPE AMAZONIA-1',  agencia:'INPE', orbita:'SSO', alt:'752 km', status:'online',  ping:'9ms',  sinal:5, ultima:'3 min atrás',  missao:'Desmatamento Amazônia' },
  { nome:'NOAA-20',          agencia:'NOAA', orbita:'LEO', alt:'824 km', status:'online',  ping:'22ms', sinal:4, ultima:'15 min atrás', missao:'Clima e atmosfera' },
  { nome:'NASA LANDSAT-9',   agencia:'NASA', orbita:'LEO', alt:'705 km', status:'online',  ping:'16ms', sinal:5, ultima:'6 min atrás',  missao:'Imagens multiespectrais' },
  { nome:'ESA SENTINEL-2A',  agencia:'ESA',  orbita:'SSO', alt:'786 km', status:'online',  ping:'19ms', sinal:4, ultima:'9 min atrás',  missao:'Cobertura vegetal' },
  { nome:'ESA SENTINEL-2B',  agencia:'ESA',  orbita:'SSO', alt:'786 km', status:'online',  ping:'20ms', sinal:4, ultima:'7 min atrás',  missao:'Cobertura vegetal' },
  { nome:'NASA SUOMI-NPP',   agencia:'NASA', orbita:'LEO', alt:'824 km', status:'online',  ping:'17ms', sinal:5, ultima:'4 min atrás',  missao:'Clima global' },
  { nome:'CBERS-4A',         agencia:'INPE', orbita:'SSO', alt:'631 km', status:'online',  ping:'11ms', sinal:5, ultima:'14 min atrás', missao:'Recursos naturais BR' },
  { nome:'ESA SENTINEL-6',   agencia:'ESA',  orbita:'LEO', alt:'1336 km',status:'alerta',  ping:'58ms', sinal:2, ultima:'48 min atrás', missao:'Nível do mar' },
  { nome:'NASA OCO-3',       agencia:'NASA', orbita:'ISS', alt:'408 km', status:'online',  ping:'8ms',  sinal:5, ultima:'1 min atrás',  missao:'CO₂ atmosférico' },
  { nome:'METOP-C',          agencia:'ESA',  orbita:'LEO', alt:'817 km', status:'offline', ping:'—',    sinal:0, ultima:'6h atrás',     missao:'Meteorologia operacional' },
];

function signalBars(n, status) {
  const color = status === 'online' ? 'active' : status === 'alerta' ? 'amber' : '';
  return `<div class="signal-bars">
    ${[1,2,3,4,5].map((v,i) => `
      <div class="s-bar ${i < n ? color : ''}" style="height:${6 + i*3}px;"></div>
    `).join('')}
  </div>`;
}

function statusPill(status) {
  const labels = { online:'ONLINE', alerta:'ALERTA', offline:'OFFLINE' };
  return `<span class="status-pill ${status}"><span class="s-dot"></span>${labels[status]}</span>`;
}

function renderTabela(lista) {
  const tbody = document.getElementById('sat-tbody');
  if (!tbody) return;
  tbody.innerHTML = lista.map(s => `
    <tr>
      <td>
        <div class="sat-name-cell">
          <div class="sat-avatar">🛰️</div>
          <div>
            <div class="sat-cell-name">${s.nome}</div>
            <div class="sat-cell-agency">${s.agencia} · ${s.missao}</div>
          </div>
        </div>
      </td>
      <td><span class="sat-cell-mono">${s.orbita}</span></td>
      <td><span class="sat-cell-mono">${s.alt}</span></td>
      <td>${statusPill(s.status)}</td>
      <td><span class="sat-cell-mono" style="color:${s.status==='online'?'var(--green)':s.status==='alerta'?'var(--amber)':'var(--text-muted)'}">${s.ping}</span></td>
      <td>${signalBars(s.sinal, s.status)}</td>
      <td><span class="sat-cell-mono">${s.ultima}</span></td>
    </tr>
  `).join('');
}

function filtrar() {
  const search  = document.getElementById('sat-search-input')?.value.toLowerCase() || '';
  const agencia = document.getElementById('filtro-agencia')?.value || 'todos';
  const status  = document.getElementById('filtro-status')?.value  || 'todos';

  const resultado = satelitesData.filter(s => {
    const matchSearch  = !search  || s.nome.toLowerCase().includes(search) || s.missao.toLowerCase().includes(search);
    const matchAgencia = agencia === 'todos' || s.agencia === agencia;
    const matchStatus  = status  === 'todos' || s.status  === status;
    return matchSearch && matchAgencia && matchStatus;
  });

  renderTabela(resultado);
}

document.addEventListener('DOMContentLoaded', () => {
  renderTabela(satelitesData);

  document.getElementById('sat-search-input')?.addEventListener('input', filtrar);
  document.getElementById('filtro-agencia')?.addEventListener('change', filtrar);
  document.getElementById('filtro-status')?.addEventListener('change', filtrar);

  // Relógio
  function updateClock() {
    const utc = new Date().toUTCString().split(' ')[4];
    const el = document.getElementById('sat-clock');
    if (el) el.textContent = 'UTC: ' + utc;
  }
  updateClock();
  setInterval(updateClock, 1000);
});