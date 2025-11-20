document.querySelectorAll(".cancelar-btn").forEach(button => {
  button.addEventListener("click", function () {
    if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
      this.closest(".reserva").remove();
      alert("Reserva cancelada com sucesso!");
    }
  });
});

/* ============================
   TEMA CLARO / ESCURO
   ============================ */

// Carregar tema salvo
document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("sae-tema");

  if (temaSalvo === "claro") {
    document.body.classList.add("modo-claro");
  }

  atualizarIconeTema();
});

// Botão para alternar tema
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("modo-claro");

  const modoClaroAtivo = document.body.classList.contains("modo-claro");

  localStorage.setItem("sae-tema", modoClaroAtivo ? "claro" : "escuro");

  atualizarIconeTema();
});

// Ajustar ícone do botão
function atualizarIconeTema() {
  const botao = document.getElementById("themeToggle");
  const modoClaro = document.body.classList.contains("modo-claro");

  botao.textContent = modoClaro ? "☀️" : "🌙";
}