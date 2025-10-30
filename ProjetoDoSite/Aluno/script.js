let groups = ["Grupo Campinho", "Grupo Laboratório", "Turma", "Grupo Biblioteca", "Grupo Ciência"];
let currentGroup = null;

const groupList = document.getElementById("groupList");
const chatTitle = document.getElementById("chatTitle");
const messagesDiv = document.getElementById("messages");

function renderGroups() {
  groupList.innerHTML = "";
  groups.forEach((group, index) => {
    const div = document.createElement("div");
    div.className = "group" + (group === currentGroup ? " active" : "");
    div.innerText = group;
    div.onclick = () => selectGroup(group);
    groupList.appendChild(div);
  });
}

function selectGroup(group) {
  currentGroup = group;
  chatTitle.innerText = group;
  messagesDiv.innerHTML = ""; // limpa o chat ao mudar de grupo
  renderGroups();
}

function createGroup() {
  const input = document.getElementById("newGroupName");
  const newGroup = input.value.trim();
  if (!newGroup) return alert("Digite um nome para o grupo.");
  if (groups.includes(newGroup)) return alert("Esse grupo já existe.");

  groups.push(newGroup);
  input.value = "";
  renderGroups();
}

function deleteGroup() {
  if (!currentGroup) return alert("Selecione um grupo para deletar.");
  const confirmDelete = confirm(`Deseja realmente deletar "${currentGroup}"?`);
  if (!confirmDelete) return;

  groups = groups.filter(g => g !== currentGroup);
  currentGroup = null;
  chatTitle.innerText = "Selecione um grupo";
  messagesDiv.innerHTML = "";
  renderGroups();
}

function sendMsg() {
  const input = document.getElementById("msgInput");
  const text = input.value.trim();
  if (!text || !currentGroup) return;

  const div = document.createElement("div");
  div.className = "msg right";
  div.innerHTML = `<b>Você:</b> ${text}`;
  messagesDiv.appendChild(div);
  input.value = "";
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

renderGroups(); // Inicializa os grupos


