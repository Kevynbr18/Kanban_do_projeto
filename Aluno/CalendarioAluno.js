
document.addEventListener("DOMContentLoaded", function() {
  const daysContainer = document.getElementById("days");
  const monthYear = document.getElementById("monthYear");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  let date = new Date();

  const events = {
    "2025-11-10": [
      { type: "prova", color: "#e74c3c" },
      { type: "atividade", color: "#ff00bfff" },
      { type: "reunião", color: "#2ecc71" },
      { type: "palestra", color: "#f1c40f" }
    ],
    "2025-11-15": [
      { type: "feriado", color: "#3e0057ff" },
      { type: "atividade", color: "#ff00bfff" }
    ]
  };

  function renderCalendar() {
    const year = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric"
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    daysContainer.innerHTML = "";

    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement("div");
      empty.classList.add("empty");
      daysContainer.appendChild(empty);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = document.createElement("div");
      day.classList.add("day");
      day.textContent = i;

      const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      if (events[fullDate]) {
        const dotsContainer = document.createElement("div");
        dotsContainer.classList.add("event-dots");

        const eventList = events[fullDate];
        const shown = eventList.slice(0, 3);

        shown.forEach(e => {
          const dot = document.createElement("div");
          dot.classList.add("event-dot");
          dot.style.background = e.color;
          dotsContainer.appendChild(dot);
        });

        if (eventList.length > 3) {
          const more = document.createElement("span");
          more.classList.add("event-more");
          more.textContent = `+${eventList.length - 3}`;
          dotsContainer.appendChild(more);
        }

        day.appendChild(dotsContainer);
      }

      daysContainer.appendChild(day);
    }
  }

  prev.onclick = () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
  };

  next.onclick = () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
  };

  renderCalendar();
});