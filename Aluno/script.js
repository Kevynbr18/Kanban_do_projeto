document.addEventListener("DOMContentLoaded", () => {

  // Grupos iniciais com mensagens simuladas
  let groups = {
    "Ciências": [
      { from: "Ana", text: "Oi pessoal, vamos marcar no laboratório amanhã?" },
      { from: "Carlos", text: "Pode ser às 14h?" },
      { from: "Você", text: "Fechado, levo o material de química." }
    ],
    "Educação Física": [
      { from: "Lucas", text: "Treino na quadra às 10h?" },
      { from: "Você", text: "Perfeito, vou levar as bolas." },
      { from: "Mariana", text: "Eu aviso o professor." }
    ],
    "Biblioteca": [
      { from: "João", text: "Podemos estudar lá depois da aula?" },
      { from: "Você", text: "Sim, encontro vocês às 15h." }
    ],
    "Matemática": [
      { from: "Luiza", text: "Revisão para a prova amanhã?" },
      { from: "Pedro", text: "Vamos nos reunir na sala 2 às 13h." },
      { from: "Você", text: "Confirmado!" }
    ]
  };

  let currentGroup = null;

  const groupList = document.getElementById("groupList");
  const chatTitle = document.getElementById("chatTitle");
  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const addGroupBtn = document.getElementById("addGroupBtn");
  const newGroupBox = document.getElementById("newGroupBox");

  // Mostrar/ocultar criação de grupo
  addGroupBtn.onclick = () => {
    newGroupBox.classList.toggle("hidden");
  };

  // Renderizar grupos
  function renderGroups() {
    groupList.innerHTML = "";
    Object.keys(groups).forEach(group => {
      const div = document.createElement("div");
      div.className = "group" + (group === currentGroup ? " active" : "");
      div.innerText = group;
      div.onclick = () => selectGroup(group);
      groupList.appendChild(div);
    });
  }

  // Selecionar grupo
  function selectGroup(group) {
    currentGroup = group;
    chatTitle.innerText = group;
    msgInput.disabled = false;
    renderGroups();
    renderMessages();
  }

  // Renderizar mensagens
  function renderMessages() {
    messagesDiv.innerHTML = "";
    groups[currentGroup].forEach(msg => {
      const div = document.createElement("div");
      div.className = msg.from === "Você" ? "msg right" : "msg left";
      div.innerHTML = `<b>${msg.from}:</b> ${msg.text}`;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Criar grupo
  window.createGroup = function() {
    const input = document.getElementById("newGroupName");
    const newGroup = input.value.trim();
    if (!newGroup) return alert("Digite um nome para o grupo.");
    if (groups[newGroup]) return alert("Esse grupo já existe.");

    groups[newGroup] = [{ from: newGroup, text: "Novo grupo criado!" }];
    input.value = "";
    newGroupBox.classList.add("hidden");
    renderGroups();
  };

  // Excluir grupo
  window.deleteGroup = function() {
    if (!currentGroup) return alert("Selecione um grupo para excluir.");
    const confirmDelete = confirm(`Excluir "${currentGroup}"?`);
    if (!confirmDelete) return;

    delete groups[currentGroup];
    currentGroup = null;
    chatTitle.innerText = "Selecione um grupo";
    messagesDiv.innerHTML = "";
    msgInput.disabled = true;
    renderGroups();
  };

  // Enviar mensagem
  window.sendMsg = function() {
    const text = msgInput.value.trim();
    if (!text || !currentGroup) return;

    groups[currentGroup].push({ from: "Você", text });
    msgInput.value = "";
    renderMessages();

    // Resposta automática simulada
    setTimeout(() => {
      const reply = { from: "Carlos", text: "Ok, te espero lá!" };
      groups[currentGroup].push(reply);
      renderMessages();
    }, 1000);
  };

  // Inicializa com os grupos
  renderGroups();
});
console.log("Script carregado!");

// Quando o botão for clicado, alterna a exibição do menu
document.addEventListener("DOMContentLoaded", function() {
  const dropbtn = document.querySelector(".dropbtn");
  const dropdown = document.querySelector(".dropdown-content");

  if (dropbtn && dropdown) {
    dropbtn.addEventListener("click", function(event) {
      event.stopPropagation(); // impede o fechamento instantâneo
      dropdown.classList.toggle("show");
    });

    // Fecha o dropdown ao clicar fora
    window.addEventListener("click", function(event) {
      if (!event.target.matches(".dropbtn")) {
        dropdown.classList.remove("show");
      }
    });
  }
});
