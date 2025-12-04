// ==========================
// TEMA CLARO / ESCURO
// ==========================
document.addEventListener("DOMContentLoaded", () => {
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
});

// ==========================
// DROPDOWN
// ==========================
const dropBtn = document.querySelector(".dropbtn");
const dropContent = document.querySelector(".dropdown-content");

dropBtn.addEventListener("click", () => {
    dropContent.classList.toggle("show");
});

window.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) dropContent.classList.remove("show");
});

// ==========================
// NOTIFICAÇÕES
// ==========================
const listaNotificacoes = document.getElementById("listaNotificacoes");

const notificacoesExemplo = [
    {
        id: 1,
        titulo: "Reserva confirmada",
        texto: "A sala de informática foi confirmada para a aula de amanhã às 08h.",
        data: "20/11/2025",
        lida: false
    },
    {
        id: 2,
        titulo: "Novo horário escolar",
        texto: "A coordenação publicou o novo horário de aulas.",
        data: "18/11/2025",
        lida: false
    },
    {
        id: 3,
        titulo: "Equipamento devolvido",
        texto: "O projetor devolvido foi registrado pela equipe de TI.",
        data: "17/11/2025",
        lida: true
    }
];

function carregarNotificacoes() {
    listaNotificacoes.innerHTML = "";

    notificacoesExemplo.forEach(not => {
        const div = document.createElement("div");
        div.classList.add("notificacao");
        if (not.lida) div.classList.add("lida");

        div.innerHTML = `
            <h3>${not.titulo}</h3>
            <p>${not.texto}</p>
            <span class="data">${not.data}</span>
        `;

        div.addEventListener("click", () => marcarComoLida(not, div));
        listaNotificacoes.appendChild(div);
    });
}

function marcarComoLida(notificacao, elemento) {
    if (!notificacao.lida) {
        notificacao.lida = true;
        elemento.classList.add("lida");
    }
}

carregarNotificacoes();
