document.addEventListener("DOMContentLoaded", () => {

  /* ======================================================
     ====== TEMA ESCURO / CLARO ============================
  =======================================================*/
  const themeToggle = document.getElementById("themeToggle");

  themeToggle.addEventListener("click", () => {
    const temaAtual = document.body.classList.toggle("tema-claro") ? "claro" : "escuro";
    localStorage.setItem("tema_sistema", temaAtual);
    themeToggle.textContent = temaAtual === "claro" ? "☀️" : "🌙";
  });

  const temaSalvo = localStorage.getItem("tema_sistema");
  if (temaSalvo === "claro") {
    document.body.classList.add("tema-claro");
    themeToggle.textContent = "☀️";
  }

  function aplicarTema(tema) {
    if (tema === "claro") {
      document.body.classList.add("tema-claro");
      themeToggle.textContent = "☀️";
    } else {
      document.body.classList.remove("tema-claro");
      themeToggle.textContent = "🌙";
    }
  }


  /* ======================================================
     ====== DROPDOWN =======================================
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
     ====== ABAS DAS CONFIGURAÇÕES =========================
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
     ====== EDIÇÃO DO PERFIL ===============================
  =======================================================*/
  const abrirEd = document.getElementById("abrirEdicao");
  const fecharEd = document.getElementById("fecharEdicao");
  const formEd = document.getElementById("formEdicao");
  const inputFoto = document.getElementById("inputFoto");
  const fotoEl = document.getElementById("fotoProfessor");

  const campoNome = document.getElementById("campoNome");
  const campoEmail = document.getElementById("campoEmail");
  const campoDept = document.getElementById("campoDept");
  const campoMaterias = document.getElementById("campoMaterias");
  const campoTurmas = document.getElementById("campoTurmas");
  const campoHorario = document.getElementById("campoHorario");

  if (abrirEd && fecharEd && formEd) {
    abrirEd.addEventListener("click", () => formEd.classList.remove("oculto"));
    fecharEd.addEventListener("click", () => formEd.classList.add("oculto"));
  }

  if (campoNome) {
    campoNome.value = "Maria Oliveira";
    campoEmail.value = "maria.oliveira@escola.com";
    campoDept.value = "Matemática";
    campoMaterias.value = "Álgebra, Geometria";
    campoTurmas.value = "2ºA, 3ºB";
    campoHorario.value = "Seg 14:00–16:00";
  }

  if (inputFoto) {
    inputFoto.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => (fotoEl.src = reader.result);
      reader.readAsDataURL(file);
    });
  }

  const salvarBtn = document.getElementById("salvarEdicao");
  if (salvarBtn) {
    salvarBtn.addEventListener("click", () => {

      document.querySelector(".perfil-card .info").innerHTML = `
        <p><strong>Nome:</strong> ${campoNome.value}</p>
        <p><strong>Email:</strong> ${campoEmail.value}</p>
        <p><strong>Departamento:</strong> ${campoDept.value}</p>
        <p><strong>Matérias:</strong> ${campoMaterias.value}</p>
        <p><strong>Turmas:</strong> ${campoTurmas.value}</p>
        <p><strong>Horário de atendimento:</strong> ${campoHorario.value}</p>
      `;

      formEd.classList.add("oculto");
      alert("Perfil atualizado com sucesso!");
    });
  }


  /* ======================================================
     ====== FORMULÁRIOS DAS ABAS ===========================
  =======================================================*/

  const formDados = document.getElementById("formDados");
  const formPrefs = document.getElementById("formPrefs");
  const formSeg = document.getElementById("formSeg");

  if (formDados) {
    formDados.addEventListener("submit", e => {
      e.preventDefault();
      alert("Dados pessoais salvos.");
    });
  }

  if (formPrefs) {
    formPrefs.addEventListener("submit", e => {
      e.preventDefault();
      const tema = document.getElementById("selectTema").value;
      aplicarTema(tema);
      alert("Preferências salvas.");
    });
  }

  if (formSeg) {
    formSeg.addEventListener("submit", e => {
      e.preventDefault();
      alert("Senha atualizada.");
    });
  }
});
