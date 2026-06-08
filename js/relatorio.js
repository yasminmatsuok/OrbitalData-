// =============================================
//  OrbitalData — relatorios.js
// =============================================

const relatoriosData = [
  { icon:'🌿', nome:'Relatório de Carbono — Amazônia',          tipo:'Carbono & CO₂',  regiao:'Amazônia',  periodo:'Jun 2026',  fmt:'PDF',  tamanho:'2.4 MB', data:'Hoje, 14:32' },
  { icon:'🔥', nome:'Focos de Queimada — Brasil Nacional',       tipo:'Queimadas',      regiao:'Brasil',    periodo:'Mai 2026',  fmt:'PDF',  tamanho:'1.8 MB', data:'Hoje, 11:15' },
  { icon:'📋', nome:'Relatório ESG — Emissões Industriais',      tipo:'ESG Compliance', regiao:'Sudeste',   periodo:'2T 2026',   fmt:'PDF',  tamanho:'3.1 MB', data:'Ontem, 16:40' },
  { icon:'📊', nome:'Exportação de dados CO₂ — Cerrado',         tipo:'Carbono & CO₂',  regiao:'Cerrado',   periodo:'Abr 2026',  fmt:'CSV',  tamanho:'840 KB', data:'Ontem, 09:22' },
  { icon:'🌡️', nome:'Temperatura superficial — Nordeste',        tipo:'Temperatura',    regiao:'Nordeste',  periodo:'Mai 2026',  fmt:'PDF',  tamanho:'1.2 MB', data:'02/06, 14:10' },
  { icon:'🌳', nome:'Desmatamento — Mato Grosso',                tipo:'Desmatamento',   regiao:'Cerrado',   periodo:'Mai 2026',  fmt:'PDF',  tamanho:'2.8 MB', data:'01/06, 10:45' },
  { icon:'{ }',nome:'Dados brutos — Satélites NASA Maio',        tipo:'Completo',       regiao:'Brasil',    periodo:'Mai 2026',  fmt:'JSON', tamanho:'12.4 MB', data:'31/05, 22:00' },
  { icon:'🌿', nome:'Carbono — Pantanal Relatório Mensal',       tipo:'Carbono & CO₂',  regiao:'Pantanal',  periodo:'Abr 2026',  fmt:'CSV',  tamanho:'560 KB', data:'30/05, 15:30' },
];

const fmtColors = { PDF:'badge-red', CSV:'badge-green', JSON:'badge-blue' };

function renderLista() {
  const el = document.getElementById('rel-lista');
  if (!el) return;
  el.innerHTML = relatoriosData.map(r => `
    <div class="rel-item">
      <div class="rel-item-icon">${r.icon}</div>
      <div class="rel-item-info">
        <div class="rel-item-nome">${r.nome}</div>
        <div class="rel-item-meta">
          <span>📍 ${r.regiao}</span>
          <span>📅 ${r.periodo}</span>
          <span>🕐 ${r.data}</span>
        </div>
      </div>
      <div class="rel-item-right">
        <span class="badge ${fmtColors[r.fmt]}">${r.fmt}</span>
        <span class="rel-size">${r.tamanho}</span>
        <button class="btn-dl" title="Baixar">⬇</button>
      </div>
    </div>
  `).join('');
}

// ── Tipo de relatório ──
document.querySelectorAll('[data-tipo]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tipo]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── Formato ──
document.querySelectorAll('[data-fmt]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-fmt]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── Gerar relatório (simulado) ──
function gerarRelatorio() {
  const progressWrap = document.getElementById('rel-progress');
  const progressFill = document.getElementById('rel-progress-fill');
  const progressLabel = document.getElementById('rel-progress-label');
  const btnGerar = document.getElementById('btn-gerar');
  const btnTopo  = document.getElementById('btn-gerar-topo');

  if (!progressWrap) return;

  // Desabilita botões
  if (btnGerar) { btnGerar.disabled = true; btnGerar.textContent = '⏳ Gerando...'; }
  if (btnTopo)  { btnTopo.disabled  = true; }

  progressWrap.classList.add('show');

  const etapas = [
    { pct: 15, label: 'Conectando aos satélites...' },
    { pct: 35, label: 'Coletando dados satelitais...' },
    { pct: 55, label: 'Processando leituras...' },
    { pct: 75, label: 'Gerando visualizações...' },
    { pct: 90, label: 'Compilando relatório...' },
    { pct: 100, label: '✓ Relatório gerado com sucesso!' },
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i >= etapas.length) {
      clearInterval(interval);

      // Adiciona novo relatório na lista
      const tipo     = document.querySelector('[data-tipo].active')?.dataset.tipo || 'completo';
      const regiao   = document.getElementById('rel-regiao')?.value || 'brasil';
      const fmt      = document.querySelector('[data-fmt].active')?.dataset.fmt || 'PDF';
      const tipoLabels = { carbono:'Carbono & CO₂', queimadas:'Queimadas', temperatura:'Temperatura', floresta:'Desmatamento', esg:'ESG Compliance', completo:'Completo' };
      const icones = { carbono:'🌿', queimadas:'🔥', temperatura:'🌡️', floresta:'🌳', esg:'📋', completo:'📊' };

      relatoriosData.unshift({
        icon: icones[tipo] || '📄',
        nome: `${tipoLabels[tipo]} — ${regiao.charAt(0).toUpperCase() + regiao.slice(1)}`,
        tipo: tipoLabels[tipo],
        regiao: regiao.charAt(0).toUpperCase() + regiao.slice(1),
        periodo: 'Jun 2026',
        fmt,
        tamanho: fmt === 'JSON' ? '8.2 MB' : fmt === 'CSV' ? '720 KB' : '1.9 MB',
        data: 'Agora mesmo',
      });

      renderLista();

      // Reseta
      setTimeout(() => {
        progressWrap.classList.remove('show');
        progressFill.style.width = '0%';
        if (btnGerar) { btnGerar.disabled = false; btnGerar.textContent = '⚙️ Gerar Relatório'; }
        if (btnTopo)  { btnTopo.disabled  = false; }
      }, 1500);

      return;
    }
    progressFill.style.width  = etapas[i].pct + '%';
    progressLabel.textContent = etapas[i].label;
    i++;
  }, 600);
}

document.addEventListener('DOMContentLoaded', () => {
  renderLista();
  document.getElementById('btn-gerar')?.addEventListener('click', gerarRelatorio);
  document.getElementById('btn-gerar-topo')?.addEventListener('click', gerarRelatorio);
});