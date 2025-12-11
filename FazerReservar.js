// FazerReserva.js — versão corrigida e robusta
(function () {
  'use strict';

  // Util: mostrar mensagem temporária
  function mostrarMsg(texto, tipo = 'info', tempo = 3000) {
    const msg = document.getElementById('msg');
    if (!msg) return;
    msg.textContent = texto;
    msg.style.opacity = '1';
    msg.style.transition = 'opacity .25s';
    msg.style.color = tipo === 'sucesso' ? '#0a8f3a' : tipo === 'erro' ? '#c0392b' : '#1f6f8b';

    // limpar após tempo
    clearTimeout(mostrarMsg._timer);
    mostrarMsg._timer = setTimeout(() => {
      msg.style.opacity = '0';
      // opcional: esvaziar depois da transição
      setTimeout(() => { if (msg) msg.textContent = ''; }, 300);
    }, tempo);
  }

  // Valida data não ser passada
  function dataEhValida(dataISO) {
    if (!dataISO) return false;
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const data = new Date(dataISO + 'T00:00:00');
    return data >= hoje;
  }

  // Dropdown do perfil
  function initDropdown() {
    const dropbtn = document.querySelector('.dropbtn');
    const dropdown = document.querySelector('.dropdown');
    const content = document.querySelector('.dropdown-content');

    if (!dropbtn || !content) return;

    dropbtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = content.classList.toggle('show');
      dropbtn.setAttribute('aria-expanded', String(isOpen));
    });

    // fecha ao clicar fora
    document.addEventListener('click', (ev) => {
      if (!dropdown) return;
      if (!dropdown.contains(ev.target)) {
        content.classList.remove('show');
        if (dropbtn) dropbtn.setAttribute('aria-expanded', 'false');
      }
    });

    // fecha com ESC
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        content.classList.remove('show');
        if (dropbtn) dropbtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Tema claro/escuro
  function initThemeToggle() {
    const botao = document.getElementById('themeToggle');
    if (!botao) return;

    function atualizarIconeTema() {
      botao.textContent = document.body.classList.contains('modo-claro') ? '☀️' : '🌙';
    }

    // carregar tema salvo
    const temaSalvo = localStorage.getItem('sae-tema');
    if (temaSalvo === 'claro') document.body.classList.add('modo-claro');
    else document.body.classList.remove('modo-claro');
    atualizarIconeTema();

    botao.addEventListener('click', () => {
      document.body.classList.toggle('modo-claro');
      const modoClaro = document.body.classList.contains('modo-claro');
      localStorage.setItem('sae-tema', modoClaro ? 'claro' : 'escuro');
      atualizarIconeTema();
    });
  }

  // Formulário de reserva
  function initForm() {
    const form = document.getElementById('formReserva');
    const btn = document.getElementById('btnReservar');
    const tipoEl = document.getElementById('tipoEspaco');
    const dataEl = document.getElementById('dataReserva');
    const horaEl = document.getElementById('horaReserva');
    const descEl = document.getElementById('descricao');

    // proteção: se não existir, sai
    if (!form || !btn || !tipoEl || !dataEl || !horaEl || !descEl) {
      console.warn('FazerReserva.js: elemento(s) do formulário não encontrado(s). Verifique IDs.');
      return;
    }

    // permitir submit por Enter no form (se quiser), mas aqui usamos botão
    btn.addEventListener('click', () => {
      const tipo = tipoEl.value.trim();
      const data = dataEl.value;
      const hora = horaEl.value;
      const desc = descEl.value.trim();

      if (!tipo) {
        mostrarMsg('Selecione o tipo de espaço.', 'erro');
        tipoEl.focus();
        return;
      }

      if (!data) {
        mostrarMsg('Escolha uma data.', 'erro');
        dataEl.focus();
        return;
      }

      if (!dataEhValida(data)) {
        mostrarMsg('A data escolhida é anterior a hoje. Escolha outra data.', 'erro', 4000);
        dataEl.focus();
        return;
      }

      if (!hora) {
        mostrarMsg('Selecione um horário.', 'erro');
        horaEl.focus();
        return;
      }

      // montar objeto reserva
      const reserva = {
        id: Date.now(),             // id simples para referência futura
        tipo,
        data,
        hora,
        descricao: desc
      };

      try {
        const chave = 'reservas';
        const historico = JSON.parse(localStorage.getItem(chave)) || [];
        historico.push(reserva);
        localStorage.setItem(chave, JSON.stringify(historico));
        mostrarMsg('Reserva feita com sucesso!', 'sucesso', 3500);
        form.reset();

        // opcional: emitir evento custom para outras partes da app ouvirem
        const evt = new CustomEvent('reservaCriada', { detail: reserva });
        document.dispatchEvent(evt);
      } catch (err) {
        console.error('Erro ao salvar reserva:', err);
        mostrarMsg('Erro ao salvar reserva. Tente novamente.', 'erro');
      }
    });
  }

  // Inicialização única
  function init() {
    initDropdown();
    initThemeToggle();
    initForm();
  }

  // start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
