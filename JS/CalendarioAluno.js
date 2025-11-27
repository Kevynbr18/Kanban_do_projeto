// ================== CONFIGURAÇÃO INICIAL ==================
let eventos = {};

// ================== CORES POR FINALIDADE ==================
const coresPorFinalidade = {
  "Trabalho": "#f4d03f",
  "Apresentação": "#3498db",
  "Prova": "#e74c3c",
  "Futsal": "#ff7f50",
  "Vôlei": "#7fff00",
  "Handebol": "#ff69b4",
  "Treino Livre": "#ffa500",
  "Estudo individual": "#8a2be2",
  "Grupo de estudo": "#00ced1",
  "Pesquisa": "#dc143c",
  "Computação": "#1e90ff",
  "Robótica": "#32cd32",
  "Ciências": "#ff4500",
  "Reunião": "#ffd700",
  "Aula de reforço": "#00fa9a",
  "Outro tipo de atividade": "#808080"
};

// ================== ELEMENTOS DO DOM ==================
const calendarBody = document.getElementById("calendarBody");
const monthTitle = document.getElementById("monthTitle");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const reservaModal = document.getElementById("reservaModal");

const localSelect = document.getElementById("local");
const horarioSelect = document.getElementById("horario");
const finalidadeSelect = document.getElementById("finalidade");
const listaReservas = document.getElementById("listaReservas");

let dataAtual = new Date();
let dataSelecionada = null;

// ================== LOCAIS, HORÁRIOS E FINALIDADES ==================
const locais = ["Quadra","Biblioteca","Laboratório","Sala de Aula","Outros"];
const horarios = ["07:00","08:00","09:00","10:00","13:00","14:00","15:00"];
const finalidadesPorLocal = {
  "Quadra":["Futsal","Vôlei","Handebol","Treino Livre"],
  "Biblioteca":["Estudo individual","Grupo de estudo","Pesquisa"],
  "Laboratório":["Computação","Robótica","Ciências"],
  "Sala de Aula":["Reunião","Apresentação","Aula de reforço"],
  "Outros":["Outro tipo de atividade"]
};

// ================== POPULANDO SELECTS ==================
locais.forEach(l => {
  const opt = document.createElement("option");
  opt.value = l;
  opt.textContent = l;
  localSelect.appendChild(opt);
});

localSelect.addEventListener("change", () => {
  const local = localSelect.value;
  finalidadeSelect.innerHTML = "";
  finalidadeSelect.disabled = false;

  finalidadesPorLocal[local].forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    finalidadeSelect.appendChild(opt);
  });

  horarioSelect.innerHTML = "";
  horarios.forEach(h => {
    const opt = document.createElement("option");
    opt.value = h;
    opt.textContent = h;
    horarioSelect.appendChild(opt);
  });
});

// ================== GERAR CALENDÁRIO ==================
function gerarCalendario() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();

  monthTitle.textContent = dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  calendarBody.innerHTML = "";
  let linha = document.createElement("tr");
  let contador = 0;

  // Dias vazios do início do mês
  for (let i = 0; i < primeiroDiaSemana; i++) {
    linha.appendChild(document.createElement("td"));
    contador++;
  }

  // Preenchendo os dias
  for (let dia = 1; dia <= totalDiasMes; dia++) {
    const td = document.createElement("td");
    td.classList.add("dia");
    td.dataset.dia = dia;
    td.textContent = dia;

    const dataISO = `${ano}-${String(mes + 1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;

    // Mostrar bolinhas de eventos
    if (eventos[dataISO]) {
      const markerContainer = document.createElement("div");
      markerContainer.classList.add("marker-container");

      eventos[dataISO].forEach(ev => {
        const bolinha = document.createElement("span");
        bolinha.classList.add("marker");
        bolinha.style.background = coresPorFinalidade[ev.finalidade] || "#fff";
        markerContainer.appendChild(bolinha);
      });

      td.appendChild(markerContainer);

      // Tooltip com eventos
      td.dataset.event = eventos[dataISO].map(ev => ev.titulo).join(", ");
    }

    td.addEventListener("click", () => selecionarDia(td, dataISO));
    linha.appendChild(td);
    contador++;

    if (contador % 7 === 0) {
      calendarBody.appendChild(linha);
      linha = document.createElement("tr");
    }
  }
  if (contador % 7 !== 0) calendarBody.appendChild(linha);
}

// ================== SELECIONAR DIA ==================
function selecionarDia(td, data) {
  document.querySelectorAll(".dia").forEach(d => d.classList.remove("selecionado"));
  td.classList.add("selecionado");
  dataSelecionada = data;
  document.getElementById("dataSelecionada").value = data;
  atualizarListaReservas();
  reservaModal.style.display = "flex";
}

// ================== FECHAR MODAL ==================
function fecharModal() {
  reservaModal.style.display = "none";
}

// Fechar modal clicando fora da caixa
window.addEventListener("click", e => {
  if (e.target === reservaModal) fecharModal();
});

// ================== CONFIRMAR RESERVA ==================
document.getElementById("formReserva").addEventListener("submit", e => {
  e.preventDefault();
  if (!dataSelecionada) { alert("Selecione um dia no calendário."); return; }

  const local = localSelect.value;
  const horario = horarioSelect.value;
  const finalidade = finalidadeSelect.value;

  if (!eventos[dataSelecionada]) eventos[dataSelecionada] = [];
  eventos[dataSelecionada].push({ titulo: `${finalidade} - ${local} (${horario})`, finalidade });

  gerarCalendario();
  atualizarListaReservas();

  const status = document.getElementById("reservaStatus");
  status.textContent = "Reserva realizada com sucesso!";
  setTimeout(() => status.textContent = "", 3000);

  // Resetar selects
  horarioSelect.selectedIndex = 0;
  finalidadeSelect.selectedIndex = 0;
});

// ================== LISTA DE RESERVAS ==================
function atualizarListaReservas() {
  listaReservas.innerHTML = "";
  if (!dataSelecionada || !eventos[dataSelecionada] || eventos[dataSelecionada].length === 0) {
    listaReservas.textContent = "Nenhuma reserva neste dia.";
    return;
  }

  eventos[dataSelecionada].forEach((ev, index) => {
    const divEv = document.createElement("div");
    divEv.classList.add("reserva-item");

    const bolinha = document.createElement("span");
    bolinha.classList.add("event-dot");
    bolinha.style.background = coresPorFinalidade[ev.finalidade] || "#fff";

    const texto = document.createElement("span");
    texto.textContent = ev.titulo;

    const btnDel = document.createElement("button");
    btnDel.textContent = "Excluir";
    btnDel.onclick = () => {
      eventos[dataSelecionada].splice(index, 1);
      gerarCalendario();
      atualizarListaReservas();
    };

    divEv.appendChild(bolinha);
    divEv.appendChild(texto);
    divEv.appendChild(btnDel);
    listaReservas.appendChild(divEv);
  });
}

// ================== NAVEGAR ENTRE MESES ==================
prevMonthBtn.onclick = () => { dataAtual.setMonth(dataAtual.getMonth()-1); gerarCalendario(); };
nextMonthBtn.onclick = () => { dataAtual.setMonth(dataAtual.getMonth()+1); gerarCalendario(); };

// ================== INICIALIZAÇÃO ==================
gerarCalendario();


document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("sae-tema");

  if (temaSalvo === "claro") {
    document.body.classList.add("modo-claro");
  }

  atualizarIconeTema();
});

document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("sae-tema");

  if (temaSalvo === "claro") {
    document.body.classList.add("modo-claro");
  }

  atualizarIconeTema();
});


// Abre/fecha ao clicar
document.querySelector('.dropbtn').addEventListener('click', function (e) {
  e.stopPropagation(); 
  document.querySelector('.dropdown-content').classList.toggle('show');
});

// Fecha clicando fora
window.addEventListener('click', function (event) {
  if (!event.target.closest('.dropdown')) {
    document.querySelector('.dropdown-content').classList.remove('show');
  }
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