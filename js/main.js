// =============================================
//  OrbitalData — main.js
//  Interações globais da plataforma
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Marca link ativo na navbar ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ── Animação de entrada dos elementos ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ── Tabs (usado nas páginas internas) ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tab-group');
      const target = btn.dataset.tab;

      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = group.querySelector(`[data-tab-content="${target}"]`);
      if (content) content.classList.add('active');
    });
  });

  // ── Relógio UTC no badge "AO VIVO" ──
  const badge = document.querySelector('.nav-badge');
  if (badge) {
    setInterval(() => {
      const now = new Date();
      const utc = now.toUTCString().split(' ')[4];
      badge.innerHTML = `<span class="dot"></span> AO VIVO ${utc} UTC`;
    }, 1000);
  }

});