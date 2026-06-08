// =============================================
//  OrbitalData — alertas.js
// =============================================

const alertasData = [
  { nivel:'critico', tipo:'fogo',     icon:'🔥', titulo:'Foco de queimada crítico detectado',         desc:'Satélite AQUA identificou foco de incêndio de alta intensidade em área de preservação permanente.',  regiao:'Pará, BR',         sat:'NASA AQUA',      time:'Há 4 min',   novo:true  },
  { nivel:'critico', tipo:'co2',      icon:'💨', titulo:'Concentração de CO₂ acima de 430 ppm',       desc:'Leitura pontual do SENTINEL-5P indica pico de emissão localizado, possivelmente por queima de biomassa.', regiao:'Mato Grosso, BR',  sat:'ESA SENTINEL-5', time:'Há 11 min',  novo:true  },
  { nivel:'critico', tipo:'floresta', icon:'🌳', titulo:'Desmatamento acelerado detectado',            desc:'Análise de imagens MODIS confirma perda de 1.240 hectares de floresta nativa nos últimos 7 dias.',  regiao:'Amazonas, BR',     sat:'NASA TERRA',     time:'Há 28 min',  novo:true  },
  { nivel:'alto',    tipo:'temp',     icon:'🌡️', titulo:'Temperatura superficial anômala',            desc:'Temperatura 4.2°C acima da média histórica detectada por satélite de observação térmica.',          regiao:'Nordeste, BR',     sat:'ESA SENTINEL-3', time:'Há 35 min',  novo:false },
  { nivel:'alto',    tipo:'fogo',     icon:'🔥', titulo:'Múltiplos focos ativos — Cerrado',            desc:'12 focos de queimada identificados em área de Cerrado, com risco de expansão para área florestal.', regiao:'Goiás, BR',        sat:'INPE AMAZONIA-1',time:'Há 52 min',  novo:false },
  { nivel:'alto',    tipo:'co2',      icon:'💨', titulo:'Emissão industrial elevada',                 desc:'Pluma de emissão de CO₂ de origem industrial identificada com concentração 28% acima do normal.',   regiao:'São Paulo, BR',    sat:'ESA SENTINEL-5', time:'Há 1h 12min',novo:false },
  { nivel:'alto',    tipo:'floresta', icon:'🌳', titulo:'Alerta de desmatamento — Rondônia',          desc:'Padrão de supressão vegetal identificado em área de amortecimento de unidade de conservação.',      regiao:'Rondônia, BR',     sat:'NASA TERRA',     time:'Há 1h 38min',novo:false },
  { nivel:'medio',   tipo:'temp',     icon:'🌡️', titulo:'Onda de calor em formação',                  desc:'Modelo preditivo indica formação de onda de calor para os próximos 5 dias na região Sul.',          regiao:'Sul do Brasil',    sat:'NOAA GOES',      time:'Há 2h',      novo:false },
  { nivel:'medio',   tipo:'co2',      icon:'💨', titulo:'CO₂ elevado — Região metropolitana',         desc:'Concentração de CO₂ urbano 15% acima da média semanal, associado a tráfego intenso.',              regiao:'Rio de Janeiro, BR',sat:'ESA SENTINEL-5', time:'Há 2h 30min',novo:false },
  { nivel:'medio',   tipo:'fogo',     icon:'🔥', titulo:'Risco alto de incêndio — Pantanal',          desc:'Baixa umidade relativa (18%) e vento forte elevam risco de ignição espontânea na região.',         regiao:'Pantanal, MS',     sat:'NASA AQUA',      time:'Há 3h',      novo:false },
  { nivel:'baixo',   tipo:'temp',     icon:'🌡️', titulo:'Temperatura oceânica acima do normal',       desc:'SST 1.8°C acima da média detectada na costa nordestina, indicador precoce de El Niño.',            regiao:'Atlântico, NE',    sat:'ESA SENTINEL-3', time:'Há 4h',      novo:false },
  { nivel:'baixo',   tipo:'floresta', icon:'🌿', titulo:'Área reflorestada confirmada por satélite',  desc:'Imagens confirmam recuperação de 340 hectares em projeto de restauração ecológica monitorado.',     regiao:'Mata Atlântica, SP',sat:'NASA TERRA',     time:'Há 5h',      novo:false },
];

const nivelConfig = {
  critico: { label:'CRÍTICO', color:'var(--red)',        badgeClass:'badge-red'   },
  alto:    { label:'ALTO',    color:'var(--amber)',      badgeClass:'badge-amber' },
  medio:   { label:'MÉDIO',   color:'var(--blue-bright)',badgeClass:'badge-blue'  },
  baixo:   { label:'BAIXO',   color:'var(--green)',      badgeClass:'badge-green' },
};

function renderAlertas(lista) {
  const el = document.getElementById('alertas-lista');
  if (!el) return;
  if (!lista.length) {
    el.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-muted);font-family:var(--font-display);font-size:0.78rem;letter-spacing:0.1em;">Nenhum alerta encontrado</div>`;
    return;
  }
  el.innerHTML = lista.map(a => {
    const cfg = nivelConfig[a.nivel];
    return `
      <div class="alerta-card ${a.nivel}">
        <div class="alerta-icon-wrap ${a.nivel}">${a.icon}</div>
        <div class="alerta-body">
          <div class="alerta-titulo">${a.titulo}</div>
          <div class="alerta-desc">${a.desc}</div>
          <div class="alerta-meta">
            <span class="alerta-meta-item">📍 ${a.regiao}</span>
            <span class="alerta-meta-item">🛰️ ${a.sat}</span>
            <span class="badge ${cfg.badgeClass}" style="font-size:0.58rem;">${cfg.label}</span>
          </div>
        </div>
        <div class="alerta-right">
          <span class="alerta-time">${a.time}</span>
          ${a.novo ? '<div class="alerta-new"></div>' : ''}
        </div>
      </div>
    `;
  }).join('');
}

function filtrar() {
  const search  = document.getElementById('alerta-search')?.value.toLowerCase() || '';
  const nivel   = document.getElementById('filtro-nivel')?.value || 'todos';
  const tipo    = document.getElementById('filtro-tipo')?.value  || 'todos';

  const resultado = alertasData.filter(a => {
    const matchSearch = !search || a.titulo.toLowerCase().includes(search) || a.regiao.toLowerCase().includes(search);
    const matchNivel  = nivel === 'todos' || a.nivel === nivel;
    const matchTipo   = tipo  === 'todos' || a.tipo  === tipo;
    return matchSearch && matchNivel && matchTipo;
  });

  renderAlertas(resultado);
}

document.addEventListener('DOMContentLoaded', () => {
  renderAlertas(alertasData);

  document.getElementById('alerta-search')?.addEventListener('input', filtrar);
  document.getElementById('filtro-nivel')?.addEventListener('change', filtrar);
  document.getElementById('filtro-tipo')?.addEventListener('change', filtrar);
  document.getElementById('filtro-periodo')?.addEventListener('change', filtrar);

  // Paginação visual
  document.querySelectorAll('.pag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pag-btn').forEach(b => b.classList.remove('active'));
      if (!['‹','›'].includes(btn.textContent)) btn.classList.add('active');
    });
  });
});