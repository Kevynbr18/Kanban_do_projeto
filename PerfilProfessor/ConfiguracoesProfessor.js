document.addEventListener("DOMContentLoaded", () => {

  /* ======================================================
     ====== TEMA ESCURO / CLARO ============================
  =======================================================*/
  const themeToggle = document.getElementById("themeToggle");

  function aplicarTema(tema) {
    if (tema === "claro") {
      document.body.classList.add("modo-claro");
      themeToggle.textContent = "☀️";
    } else {
      document.body.classList.remove("modo-claro");
      themeToggle.textContent = "🌙";
    }
  }

  // Botão que alterna o tema
  themeToggle.addEventListener("click", () => {
    const novoTema = document.body.classList.toggle("modo-claro") ? "claro" : "escuro";
    localStorage.setItem("tema_sistema_prof", novoTema);
    aplicarTema(novoTema);
  });

  // Carregar tema salvo
  const temaSalvo = localStorage.getItem("tema_sistema_prof");
  if (temaSalvo) aplicarTema(temaSalvo);


  /* ======================================================
     ====== DROPDOWN (Menu do usuário) =====================
  =======================================================*/
  const dropBtn = document.querySelector(".dropbtn");
  const dropContent = document.querySelector(".dropdown-content");

  if (dropBtn) {
    dropBtn.addEventListener("click", e => {
      e.stopPropagation();
      dropContent.classList.toggle("show");
    });

    window.addEventListener("click", ev => {
      if (!ev.target.closest(".dropdown")) dropContent.classList.remove("show");
    });
  }


  /* ======================================================
     ====== ABAS DO FORMULÁRIO =============================
  =======================================================*/
  const abas = document.querySelectorAll(".aba");
  const conteudos = document.querySelectorAll(".aba-conteudo");

  abas.forEach(aba => {
    aba.addEventListener("click", () => {

      abas.forEach(a => a.classList.remove("ativa"));
      conteudos.forEach(c => c.classList.remove("ativo"));

      aba.classList.add("ativa");

      const alvo = aba.getAttribute("data-aba");
      document.getElementById(alvo).classList.add("ativo");
    });
  });


  /* ======================================================
     ====== FORMULÁRIOS — SALVAMENTO =======================
  =======================================================*/

  /* ----  Dados Pessoais  ---- */
  const formDados = document.getElementById("formDadosProf");
  if (formDados) {
    formDados.addEventListener("submit", e => {
      e.preventDefault();
      alert("Dados pessoais atualizados com sucesso!");
    });
  }

  /* ----  Preferências  ---- */
  const formPrefs = document.getElementById("formPrefsProf");
  if (formPrefs) {
    formPrefs.addEventListener("submit", e => {
      e.preventDefault();

      const selecionado = document.getElementById("temaPreferencia").value;
      aplicarTema(selecionado);
      localStorage.setItem("tema_sistema_prof", selecionado);

      alert("Preferências salvas!");
    });
  }

  /* ----  Segurança (trocar senha) ---- */
  const formSeg = document.getElementById("formSegProf");
  if (formSeg) {
    formSeg.addEventListener("submit", e => {
      e.preventDefault();
      alert("Senha alterada com sucesso!");
    });
  }

});
