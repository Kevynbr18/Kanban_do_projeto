      function toggleDropdown() {
    document.getElementById("userDropdown").classList.toggle("show");
  }

  // Fecha o dropdown ao clicar fora dele
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove('show');
      }
    }
  };
   
   let salaSelecionada = null;
    const modal = document.getElementById("formModal");

    // Inicialmente, o modal deve estar escondido
    window.onload = () => {
      modal.style.display = "none";
    };

    function selecionarSala(card) {
      document.querySelectorAll('.card').forEach(c => c.classList.remove('selecionada'));
      card.classList.add('selecionada');
      salaSelecionada = card.textContent.trim();
    }

    function cancelar() {
      salaSelecionada = null;
      document.querySelectorAll('.card').forEach(c => c.classList.remove('selecionada'));
    }

    function abrirModal() {
      if (!salaSelecionada) {
        alert("Selecione uma sala antes de agendar.");
        return;
      }
      document.getElementById("salaEscolhida").textContent = salaSelecionada;
      modal.style.display = "flex";
    }

    function fecharModal() {
      modal.style.display = "none";
      // limpa o formulário
      document.getElementById("motivo").value = "";
      document.getElementById("data").value = "";
      document.getElementById("horario").value = "";
      document.getElementById("professor").value = "";
    }

    function confirmarAgendamento() {
      const motivo = document.getElementById("motivo").value;
      const data = document.getElementById("data").value;
      const horario = document.getElementById("horario").value;
      const professor = document.getElementById("professor").value;

      if (!motivo || !data || !horario || !professor) {
        alert("Preencha todos os campos antes de confirmar o agendamento.");
        return;
      }

      alert(`✅ Agendamento confirmado!\n\nSala: ${salaSelecionada}\nData: ${data}\nHorário: ${horario}\nProfessor: ${professor}\nMotivo: ${motivo}`);

      fecharModal();
      cancelar();
    }

    // Fechar o modal clicando fora
    window.onclick = function (event) {
      if (event.target === modal) {
        fecharModal();
      }
    };


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