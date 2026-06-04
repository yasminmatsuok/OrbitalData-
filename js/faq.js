// =============================================
//  OrbitalData — faq.js
//  Accordion, busca e filtro por categoria
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Accordion ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Fecha todos
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Abre o clicado (se não estava aberto)
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Filtro por categoria ──
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      document.querySelectorAll('.faq-item').forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });

      // Limpa busca ao trocar categoria
      const input = document.getElementById('faq-search-input');
      if (input) input.value = '';
    });
  });

  // ── Busca ──
  const searchInput = document.getElementById('faq-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();

      // Reseta categoria
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-cat="all"]').classList.add('active');

      document.querySelectorAll('.faq-item').forEach(item => {
        const text = item.querySelector('.faq-q-text').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        if (!query || text.includes(query) || answer.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Abre primeiro item por padrão
  const first = document.querySelector('.faq-item');
  if (first) first.classList.add('open');

});