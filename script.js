let salaSelecionada = null;

function selecionarSala(card) {
  // Remove destaque de todas as salas
  document.querySelectorAll(".card").forEach(c => c.classList.remove("selecionada"));
  
  // Marca a sala clicada
  card.classList.add("selecionada");
  salaSelecionada = card.textContent;
}

function cancelar() {
  salaSelecionada = null;
  document.querySelectorAll(".card").forEach(c => c.classList.remove("selecionada"));
  document.getElementById("formAgendamento").style.display = "none";
}

function agendar() {
  if (!salaSelecionada) {
    alert("Por favor, selecione uma sala antes de agendar.");
    return;
  }

  // Mostra o formulário
  document.getElementById("formAgendamento").style.display = "block";
  document.getElementById("salaEscolhida").textContent = salaSelecionada;
}

function confirmarAgendamento() {
  const motivo = document.getElementById("motivo").value;
  const horario = document.getElementById("horario").value;
  const data = document.getElementById("data").value;
  const professor = document.getElementById("professor").value;

  if (!motivo || !horario || !data || !professor) {
    alert("Preencha todos os campos antes de confirmar o agendamento.");
    return;
  }

  alert(`Agendamento confirmado:\nSala: ${salaSelecionada}\nData: ${data}\nHorário: ${horario}\nProfessor: ${professor}\nMotivo: ${motivo}`);
  cancelar(); // Limpa tudo após confirmar
}




 // Controle simples de menu "mais"
    const moreBtn = document.getElementById('moreBtn');
    const menu = document.getElementById('menu');
    const statusBadge = document.getElementById('statusBadge');
    const feedback = document.getElementById('feedback');

    moreBtn.addEventListener('click', (e) => {
      const expanded = moreBtn.getAttribute('aria-expanded') === 'true';
      moreBtn.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('show');
      menu.setAttribute('aria-hidden', String(expanded));
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!moreBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
        moreBtn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      }
    });

    function changeStatus(status, reason) {
      menu.classList.remove('show');
      moreBtn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');

      if (status === 'aprovado') {
        statusBadge.textContent = 'Aprovado';
        statusBadge.className = 'badge status-aprovado';
        feedback.textContent = 'Reserva aprovada e notificação enviada ao solicitante.';
      } else if (status === 'rejeitado') {
        statusBadge.textContent = 'Rejeitado';
        statusBadge.className = 'badge status-rejeitado';
        feedback.textContent = 'Reserva rejeitada. Motivo: ' + (reason || 'não informado.');
      } else {
        statusBadge.textContent = reason || 'Precisando de aprovação';
        statusBadge.className = 'badge status-pendente';
        feedback.textContent = 'Status alterado para pendente.';
      }
    }

    function viewDetails() {
      feedback.textContent = 'Abrindo detalhes da reserva... (aqui abra modal/rota real)';
    }

    function openDialog(type) {
      if (type === 'message') {
        const msg = prompt('Mensagem para o solicitante (ex: pedir alteração):');
        if (msg) {
          feedback.textContent = 'Mensagem enviada: ' + msg;
        } else {
          feedback.textContent = 'Envio cancelado.';
        }
      }
    }

    function duplicateReservation() {
      feedback.textContent = 'Reserva duplicada (uso de exemplo).';
    }

    function deleteReservation() {
      if (confirm('Tem certeza que deseja excluir esta reserva?')) {
        feedback.textContent = 'Reserva excluída.';
        // aqui você removeria o card do DOM ou chamaria API
      } else {
        feedback.textContent = 'Exclusão cancelada.';
      }
    }