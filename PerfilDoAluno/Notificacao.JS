document.addEventListener("DOMContentLoaded", () => {

    const lista = document.getElementById("listaNotificacoes");
    const btnMarcarTodas = document.getElementById("marcarTodasBtn");

    let notificacoes = [
        { id: 1, titulo: "Reserva confirmada", msg: "Sua reserva da sala 203 foi aprovada.", lida: false },
        { id: 2, titulo: "Lembrete", msg: "Você possui uma reserva para amanhã às 14h.", lida: true },
        { id: 3, titulo: "Aviso importante", msg: "A escola estará fechada no sábado.", lida: false },
        { id: 4, titulo: "Aviso importante", msg: "A sala em que sera realizada prova foi alterada pra sala-21.", lida: true },
        { id: 5, titulo: "Aviso importante", msg: "Suas tarefas de Matematica estão atrasadas .", lida: false }
    ];

    function carregarNotificacoes() {
        lista.innerHTML = "";

        notificacoes.forEach(notif => {
            const item = document.createElement("div");
            item.classList.add("notificacao");
            item.classList.add(notif.lida ? "lida" : "nao-lida");

            // Ícone: ✅ se lida, ⚠️ se não lida
            const icone = notif.lida ? "✅" : "⚠️";

            item.innerHTML = `
                <div class="texto">
                    <div class="titulo">${icone} ${notif.titulo}</div>
                    <div class="mensagem">${notif.msg}</div>
                </div>
                ${
                    notif.lida
                    ? `<span class="badge-lida">Lida</span>`
                    : `<button class="btnLer" data-id="${notif.id}">Marcar como lida</button>`
                }
            `;

            lista.appendChild(item);
        });
    }

    // Delegação para botão "marcar como lida"
    lista.addEventListener("click", (e) => {
        if (e.target.classList.contains("btnLer")) {
            const id = Number(e.target.getAttribute("data-id"));
            notificacoes = notificacoes.map(n =>
                n.id === id ? { ...n, lida: true } : n
            );
            carregarNotificacoes();
        }
    });

    // Botão "Marcar todas como lidas"
    btnMarcarTodas.addEventListener("click", () => {
        notificacoes = notificacoes.map(n => ({ ...n, lida: true }));
        carregarNotificacoes();
    });

    // Inicializar
    carregarNotificacoes();




    /* =====================
       DROPDOWN
    ===================== */
    const dropBtn = document.querySelector(".dropbtn");
    const dropContent = document.querySelector(".dropdown-content");

    if (dropBtn) {
        dropBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropContent.classList.toggle("show");
        });
    }

    window.addEventListener("click", (event) => {
        if (!event.target.closest(".dropdown")) {
            dropContent.classList.remove("show");
        }
    });


    /* =====================
       TEMA CLARO / ESCURO
    ===================== */
    const saved = localStorage.getItem("sae-tema");
    if (saved === "claro") document.body.classList.add("modo-claro");

    atualizarIconeTema();

    document.getElementById("themeToggle").addEventListener("click", () => {
        document.body.classList.toggle("modo-claro");

        const claro = document.body.classList.contains("modo-claro");
        localStorage.setItem("sae-tema", claro ? "claro" : "escuro");

        atualizarIconeTema();
    });

    function atualizarIconeTema() {
        const btn = document.getElementById("themeToggle");
        btn.textContent = document.body.classList.contains("modo-claro") ? "☀️" : "🌙";
    }

});
