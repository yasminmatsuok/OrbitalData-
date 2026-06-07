// =============================================
//  OrbitalData — contato.js
//  Validação e envio do formulário de contato
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  const form      = document.getElementById('contato-form');
  const success   = document.getElementById('form-success');
  const btnSubmit = document.getElementById('btn-submit');
  const btnText   = document.getElementById('btn-text');
  const btnNovo   = document.getElementById('btn-novo');

  // ── Validação individual ──────────────────

  function validarCampo(id, erroId, condicao) {
    const input = document.getElementById(id);
    const erro  = document.getElementById(erroId);
    if (!input || !erro) return true;

    if (!condicao(input.value.trim())) {
      input.classList.add('error');
      erro.classList.add('show');
      return false;
    } else {
      input.classList.remove('error');
      erro.classList.remove('show');
      return true;
    }
  }

  function isEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  // Remove erro ao digitar
  ['nome', 'email', 'organizacao', 'tipo', 'assunto', 'mensagem'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const erroEl = document.getElementById('erro-' + id);
      if (erroEl) erroEl.classList.remove('show');
    });
  });

  // ── Submit ────────────────────────────────

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Valida todos os campos
      const v1 = validarCampo('nome',     'erro-nome',     v => v.length >= 2);
      const v2 = validarCampo('email',    'erro-email',    v => isEmail(v));
      const v3 = validarCampo('tipo',     'erro-tipo',     v => v !== '');
      const v4 = validarCampo('assunto',  'erro-assunto',  v => v.length >= 3);
      const v5 = validarCampo('mensagem', 'erro-mensagem', v => v.length >= 10);

      // Valida checkbox
      const aceite    = document.getElementById('aceite');
      const erroAceite = document.getElementById('erro-aceite');
      let v6 = true;
      if (aceite && !aceite.checked) {
        erroAceite.classList.add('show');
        v6 = false;
      } else if (erroAceite) {
        erroAceite.classList.remove('show');
      }

      if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) {
        // Scrolla pro primeiro erro
        const primeiro = form.querySelector('.error, .form-error.show');
        if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Simula envio
      btnSubmit.disabled = true;
      btnText.textContent = '⏳ Enviando...';

      setTimeout(() => {
        form.style.display = 'none';
        success.classList.add('show');
      }, 1500);
    });
  }

  // ── Enviar nova mensagem ──────────────────

  if (btnNovo) {
    btnNovo.addEventListener('click', () => {
      // Reseta o formulário
      form.reset();
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
      btnSubmit.disabled = false;
      btnText.textContent = '✉️ Enviar Mensagem';

      // Mostra formulário novamente
      success.classList.remove('show');
      form.style.display = 'flex';
    });
  }

});