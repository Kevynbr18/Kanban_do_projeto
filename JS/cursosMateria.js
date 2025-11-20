
// Dropdown user menu
document.querySelector(".dropbtn").addEventListener("click", function(e) {
  e.stopPropagation();
  document.querySelector(".dropdown-content").classList.toggle("show");
});

window.addEventListener("click", function(event) {
  if (!event.target.closest(".dropdown")) {
    document.querySelector(".dropdown-content").classList.remove("show");
  }
});

// Troca de tema
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("modo-claro");
  localStorage.setItem("sae-tema",
    document.body.classList.contains("modo-claro") ? "claro" : "escuro"
  );
  atualizarIconeTema();
});

function atualizarIconeTema() {
  const botao = document.getElementById("themeToggle");
  botao.textContent = document.body.classList.contains("modo-claro") ? "☀️" : "🌙";
}

// Carregar tema salvo
(function () {
  const tema = localStorage.getItem("sae-tema");
  if (tema === "claro") document.body.classList.add("modo-claro");
  atualizarIconeTema();
})();

// Abrir página da matéria (exemplo)
function abrirMateria(materia) {
  alert("Você abriu a página da matéria: " + materia);
}
