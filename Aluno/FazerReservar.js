// Dropdown menu
    document.querySelector('.dropbtn').addEventListener('click', function() {
      document.querySelector('.dropdown-content').classList.toggle("show");
    });

    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown')) {
        document.querySelector('.dropdown-content').classList.remove("show");
      }
    }; 
    
function alternarModo() {
  document.body.classList.toggle('modo-claro');
}

document.addEventListener("DOMContentLoaded", () => {
  const diasDoMes = document.getElementById("diasDoMes");
  const mesAnoTexto = document.getElementById("mesAno");
  const dataSelecionadaInput = document.getElementById("dataSelecionada");
  const status = document.getElementById("reservaStatus");
  const localSelect = document.getElementById("local");
  const horarioSelect = document.getElementById("horario");
  const finalidadeSelect = document.getElementById("finalidade");

  let dataAtual = new Date();

  const horarios = {
    quadra: ["08:00", "09:00", "10:00", "14:00", "15:00"],
    biblioteca: ["08:00", "09:30", "11:00", "13:00", "15:00"],
    laboratorio: ["08:00", "10:00", "12:00", "14:00", "16:00"],
    sala: ["07:30", "09:00", "10:30", "13:30", "15:00"]
  };

  const finalidades = {
    quadra: ["Educação Física", "Campeonato", "Treino Escolar", "Recreação"],
    biblioteca: ["Leitura", "Estudo", "Reunião de Grupo", "Pesquisa"],
    laboratorio: ["Experimento", "Aula Prática", "Projeto de Robótica"],
    sala: ["Aula Regular", "Reunião de Professores", "Oficina Escolar"]
  };

  let reservas = { quadra: {}, biblioteca: {}, laboratorio: {}, sala: {} };

  // === NOVA FUNÇÃO: ajusta a cor do status conforme o tema ===
  function definirCorStatus(tipo) {
    const modoClaro = document.body.classList.contains("modo-claro");

    if (tipo === "erro") {
      status.style.color = modoClaro ? "#b00000" : "#ff9999"; // vermelho escuro no claro, vermelho claro no escuro
    } else if (tipo === "sucesso") {
      status.style.color = modoClaro ? "#000000" : "#a2f9b5"; // preto no claro, verde no escuro
    } else {
      status.style.color = modoClaro ? "#000000" : "#000000ff"; // padrão
    }
  }

  // === GERAR CALENDÁRIO ===
  function gerarCalendario() {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    mesAnoTexto.textContent = dataAtual.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric"
    });

    diasDoMes.innerHTML = "";
    let dia = 1;

    for (let i = 0; i < 6; i++) {
      const tr = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const td = document.createElement("td");

        if ((i === 0 && j < primeiroDia) || dia > totalDias) {
          td.textContent = "";
        } else {
          td.textContent = dia;
          td.classList.add("dia");

          ((d) => {
            td.addEventListener("click", (e) => selecionarDia(e, d, mes, ano));
          })(dia);

          dia++;
        }

        tr.appendChild(td);
      }

      diasDoMes.appendChild(tr);
    }
  }

  // === SELECIONAR DIA ===
  function selecionarDia(event, dia, mes, ano) {
    document.querySelectorAll(".calendario td").forEach(td =>
      td.classList.remove("selecionado")
    );
    event.currentTarget.classList.add("selecionado");

    const dataISO = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    dataSelecionadaInput.value = dataISO;
    atualizarHorarios();
  }

  // === ATUALIZAR HORÁRIOS ===
  function atualizarHorarios() {
    const local = localSelect.value;
    const data = dataSelecionadaInput.value;
    horarioSelect.innerHTML = "<option value=''>Selecione horário</option>";

    if (!local || !data) return;

    const horariosDisponiveis = horarios[local];
    const horariosReservados = reservas[local][data] || [];

    horariosDisponiveis.forEach(h => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = horariosReservados.includes(h) ? `${h} (Ocupado)` : h;
      opt.disabled = horariosReservados.includes(h);
      horarioSelect.appendChild(opt);
    });
  }

  // === MUDAR LOCAL E FINALIDADES ===
  localSelect.addEventListener("change", () => {
    const local = localSelect.value;
    finalidadeSelect.innerHTML = "";

    if (!local) {
      finalidadeSelect.disabled = true;
      finalidadeSelect.innerHTML = "<option value=''>Selecione o local primeiro</option>";
      return;
    }

    finalidadeSelect.disabled = false;
    finalidades[local].forEach(f => {
      const opt = document.createElement("option");
      opt.value = f;
      opt.textContent = f;
      finalidadeSelect.appendChild(opt);
    });

    atualizarHorarios();
  });

  // === NAVEGAÇÃO ENTRE MESES ===
  document.getElementById("mesAnterior").addEventListener("click", () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    gerarCalendario();
  });

  document.getElementById("mesSeguinte").addEventListener("click", () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    gerarCalendario();
  });

  // === CONFIRMAR RESERVA ===
  document.getElementById("formReserva").addEventListener("submit", e => {
    e.preventDefault();

    const local = localSelect.value;
    const horario = horarioSelect.value;
    const data = dataSelecionadaInput.value;
    const finalidade = finalidadeSelect.value;

    if (!local || !horario || !data || !finalidade) {
      status.textContent = "Por favor, selecione data, local, horário e finalidade.";
      definirCorStatus("erro");
      return;
    }

    if (!reservas[local][data]) reservas[local][data] = [];
    if (reservas[local][data].includes(horario)) {
      status.textContent = "Esse horário já está reservado.";
      definirCorStatus("erro");
      return;
    }

    reservas[local][data].push(horario);
    const dataLegivel = new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    status.innerHTML = `Reserva confirmada para <strong>${dataLegivel}</strong> às <strong>${horario}</strong> em <strong>${local}</strong> — Finalidade: <strong>${finalidade}</strong>.`;
    definirCorStatus("sucesso");

    e.target.reset();
    finalidadeSelect.disabled = true;
    finalidadeSelect.innerHTML = "<option value=''>Selecione o local primeiro</option>";
    dataSelecionadaInput.value = "";
    gerarCalendario();
  });

  gerarCalendario();
});
