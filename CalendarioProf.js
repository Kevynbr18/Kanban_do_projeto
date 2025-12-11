document.addEventListener('DOMContentLoaded', () => {
  const daysContainer = document.getElementById("daysContainer");
  const monthYear = document.getElementById("month-year");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");
  const modal = document.getElementById("eventModal");
  const closeModal = document.querySelector(".close");
  const modalDate = document.getElementById("modalDate");
  const addEventBtn = document.getElementById("addEventBtn");

  const typeColors = { 
    prova: "#e74c3c", 
    reuniao: "#f1c40f", 
    atividade: "#2ecc71", 
    outro: "#9b59b6" 
  };

  let events = JSON.parse(localStorage.getItem("events")) || {};
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDate;

  const months = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  // ===== RENDERIZAR CALENDÁRIO =====
  function renderCalendar() {
    daysContainer.innerHTML = "";
    monthYear.textContent = `${months[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Espaços em branco antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement("div");
      daysContainer.appendChild(emptyDiv);
    }

    // Dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const div = document.createElement("div");

      // Número do dia
      const dayNum = document.createElement("span");
      dayNum.classList.add("day-number");
      dayNum.textContent = d;
      div.appendChild(dayNum);

      // Dots dos eventos
      if (events[dateKey]) {
        const eventDots = document.createElement("div");
        eventDots.classList.add("event-dots");

        events[dateKey].slice(0, 3).forEach(ev => {
          const dot = document.createElement("span");
          dot.classList.add("dot", ev.tipo);
          eventDots.appendChild(dot);
        });

        // Se houver mais de 3 eventos, mostra +N
        if (events[dateKey].length > 3) {
          const more = document.createElement("span");
          more.classList.add("more-events");
          more.textContent = `+${events[dateKey].length - 3}`;
          div.appendChild(more);
        }

        div.appendChild(eventDots);
      }

      // Destaque no dia atual
      if (
        d === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      ) {
        div.classList.add("today");
      }

      div.addEventListener("click", () => openModal(dateKey, d));
      daysContainer.appendChild(div);
    }
  }

  // ===== MODAL =====
  function openModal(key, day) {
    selectedDate = key;
    modal.style.display = "flex";
    modalDate.textContent = `Dia ${day} de ${months[currentMonth]} de ${currentYear}`;
    renderEvents();
  }

  function renderEvents() {
    const eventList = document.getElementById("eventList");
    eventList.innerHTML = "";

    if (events[selectedDate]) {
      events[selectedDate].forEach((ev, i) => {
        const item = document.createElement("div");
        item.textContent = `${ev.hora || ''} ${ev.name || ev.tipo} (${ev.local || ''})`;
        item.style.color = typeColors[ev.tipo] || '#fff';
        item.style.cursor = "pointer";
        item.title = "Clique para remover";
        item.addEventListener("click", () => {
          if (confirm("Remover evento?")) {
            events[selectedDate].splice(i, 1);
            if (events[selectedDate].length === 0) delete events[selectedDate];
            saveEvents();
            renderEvents();
            renderCalendar();
          }
        });
        eventList.appendChild(item);
      });
    } else {
      eventList.innerHTML = "<div>Sem eventos para o dia.</div>";
    }

    // Reset dos inputs
    document.getElementById("eventName").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventType").value = "prova";
  }

  // ===== ADICIONAR EVENTO =====
  addEventBtn.addEventListener("click", () => {
    const name = document.getElementById("eventName").value.trim();
    const local = document.getElementById("eventLocation").value.trim();
    const hora = document.getElementById("eventTime").value;
    const tipo = document.getElementById("eventType").value;

    if (!name || !local || !hora) return alert("Preencha todos os campos.");

    if (!events[selectedDate]) events[selectedDate] = [];
    events[selectedDate].push({ name, local, hora, tipo });

    saveEvents();
    renderEvents();
    renderCalendar();
  });

  // ===== UTIL =====
  function saveEvents() {
    localStorage.setItem("events", JSON.stringify(events));
  }

  closeModal.onclick = () => (modal.style.display = "none");
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

  // ===== NAVEGAÇÃO ENTRE MESES =====
  prevBtn.onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  };

  nextBtn.onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  };

  // ===== DROPDOWN MENU =====
  const dropbtn = document.querySelector('.dropbtn');
  const dropdown = document.querySelector('.dropdown-content');
  dropbtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });
  window.addEventListener('click', e => {
    if (!e.target.matches('.dropbtn')) dropdown.classList.remove("show");
  });

  renderCalendar();
});
