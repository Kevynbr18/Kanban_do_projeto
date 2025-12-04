// Seletores gerais
const modalDetalhes = document.getElementById("modalDetalhes");
const modalExcluir = document.getElementById("modalExcluir");
const modalEditar = document.getElementById("modalEditar");

const fecharDetalhes = document.querySelector(".fechar-detalhes");
const fecharExcluir = document.querySelector(".fechar-excluir");
const fecharEditar = document.querySelector(".fechar-editar");

const textoExcluir = document.getElementById("textoExcluir");
const modalTitulo = document.getElementById("modalTitulo");
const modalInfo = document.getElementById("modalInfo");

// Seletores do modal editar
const editarTitulo = document.getElementById("editarTitulo");
const editarData = document.getElementById("editarData");
const editarHorario = document.getElementById("editarHorario");
const editarMotivo = document.getElementById("editarMotivo");
const editarProf = document.getElementById("editarProf");

let cardAtual = null; // Card selecionado para excluir
let cardEditar = null; // Card selecionado para editar

// ========== ABRIR MODAL DE DETALHES ==========
document.querySelectorAll(".btn-detalhes").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".card");

    const titulo = card.querySelector("h3").textContent;
    const itens = card.querySelectorAll("p");

    modalTitulo.textContent = titulo;

    // Gera o conteúdo automaticamente
    modalInfo.innerHTML = "";
    itens.forEach(p => {
      modalInfo.innerHTML += `<p>${p.innerHTML}</p>`;
    });

    modalDetalhes.style.display = "block";
  });
});

// ========== ABRIR MODAL DE EXCLUSÃO ==========
document.querySelectorAll(".btn-excluir").forEach(btn => {
  btn.addEventListener("click", () => {
    cardAtual = btn.closest(".card");

    const nomeSala = cardAtual.querySelector("h3").textContent;
    textoExcluir.textContent = `Tem certeza que deseja excluir a reserva: "${nomeSala}"?`;

    modalExcluir.style.display = "block";
  });
});

// ========== CONFIRMAR EXCLUSÃO ==========
document.getElementById("confirmarExcluir").addEventListener("click", () => {
  if (cardAtual) {
    cardAtual.remove();
  }
  modalExcluir.style.display = "none";
});

// ========== CANCELAR EXCLUSÃO ==========
document.getElementById("cancelarExcluir").addEventListener("click", () => {
  modalExcluir.style.display = "none";
});

// ========== FECHAR MODAIS ==========
fecharDetalhes.addEventListener("click", () => {
  modalDetalhes.style.display = "none";
});

fecharExcluir.addEventListener("click", () => {
  modalExcluir.style.display = "none";
});

// Fechar clicando fora
window.addEventListener("click", (event) => {
  if (event.target === modalDetalhes) {
    modalDetalhes.style.display = "none";
  }
  if (event.target === modalExcluir) {
    modalExcluir.style.display = "none";
  }
});




// Abrir modal de editar
document.querySelectorAll(".btn-editar").forEach(btn => {
  btn.addEventListener("click", () => {
    cardEditar = btn.closest(".card");

    const titulo = cardEditar.querySelector("h3").textContent;
    const itens = cardEditar.querySelectorAll("p");

    editarTitulo.value = titulo;
    editarData.value = itens[0].innerText.replace("Data: ", "");
    editarHorario.value = itens[1].innerText.replace("Horário: ", "");
    editarMotivo.value = itens[2]?.innerText.replace("Motivo:", "").trim() || "";
    editarProf.value = itens[3].innerText.replace("Prof(A): ", "").trim();

    modalEditar.style.display = "flex";
  });
});

// Fechar Modal Editar
fecharEditar.addEventListener("click", () => {
  modalEditar.style.display = "none";
});

document.getElementById("cancelarEditar").addEventListener("click", () => {
  modalEditar.style.display = "none";
});

// Salvar edição
document.getElementById("formEditar").addEventListener("submit", (e) => {
  e.preventDefault();

  if (cardEditar) {
    cardEditar.querySelector("h3").textContent = editarTitulo.value;

    const itens = cardEditar.querySelectorAll("p");

    itens[0].innerHTML = `<strong>Data:</strong> ${editarData.value}`;
    itens[1].innerHTML = `<strong>Horário:</strong> ${editarHorario.value}`;
    itens[2].innerHTML = `<strong>Motivo:</strong> ${editarMotivo.value}`;
    itens[3].innerHTML = `<strong>Prof(A):</strong> ${editarProf.value}`;
  }

  modalEditar.style.display = "none";
});

// Fechar clicando fora do modal
window.addEventListener("click", (event) => {
  if (event.target === modalEditar) {
    modalEditar.style.display = "none";
  }
});


/* ================================
   DROPDOWN DO PERFIL
================================= */
const dropBtn = document.querySelector('.dropbtn');
const dropdownContent = document.querySelector('.dropdown-content');

dropBtn.addEventListener('click', () => {
  dropdownContent.classList.toggle('show');
});

window.addEventListener('click', (event) => {
  if (!event.target.matches('.dropbtn')) {
    dropdownContent.classList.remove('show');
  }
});


/* ================================
   TEMA (CLARO / ESCURO)
================================= */
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("modo-claro");

  const modoClaroAtivo = document.body.classList.contains("modo-claro");
  localStorage.setItem("sae-tema", modoClaroAtivo ? "claro" : "escuro");

  atualizarIconeTema();
});

function atualizarIconeTema() {
  const botao = document.getElementById("themeToggle");
  const modoClaro = document.body.classList.contains("modo-claro");
  botao.textContent = modoClaro ? "☀️" : "🌙";
}

window.addEventListener("load", () => {
  const temaSalvo = localStorage.getItem("sae-tema");
  if (temaSalvo === "claro") {
    document.body.classList.add("modo-claro");
  }
  atualizarIconeTema();
});

