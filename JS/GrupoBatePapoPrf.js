// Dados simulados
let users = [
  { id: 1, name: "Carlos bane", avatar: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
  { id: 2, name: "Joana clara", avatar: "https://cdn-icons-png.flaticon.com/512/147/147140.png" },
  { id: 3, name: "Maria antonieta", avatar: "https://cdn-icons-png.flaticon.com/512/147/147133.png" },
  { id: 4, name: "Pedro cabral", avatar: "https://cdn-icons-png.flaticon.com/512/147/147132.png" }
];

let groups = [];
let chatsPrivate = {};

let selectedChat = { type: null, id: null };

// Referências DOM
const usersContainer = document.getElementById("users");
const groupsContainer = document.getElementById("groups");
const groupTemplate = document.getElementById("groupTemplate");

const searchUsersInput = document.getElementById("searchUsers");

const chatName = document.getElementById("chatName");
const chatMeta = document.getElementById("chatMeta");
const chatAvatar = document.getElementById("chatAvatar");
const messagesArea = document.getElementById("messages");
const composer = document.getElementById("composer");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const openGroupConfigBtn = document.getElementById("openGroupConfig");

const popupOverlay = document.getElementById("popupOverlay");
const popupGroupInfo = document.getElementById("popupGroupInfo");
const popupCloseBtn = document.getElementById("popupClose");
const popupGroupName = document.getElementById("popupGroupName");
const popupAvatarPreview = document.getElementById("popupAvatarPreview");
const popupAvatarInput = document.getElementById("popupAvatarInput");
const popupMembers = document.getElementById("popupMembers");
const popupSaveBtn = document.getElementById("popupSaveBtn");
const popupLeaveBtn = document.getElementById("popupLeaveBtn");

const addGroupBtn = document.getElementById("addGroup");

// Utilitários
function generateId(collection) {
  if (!collection || collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
}

function saveData() {
  localStorage.setItem("sae-users", JSON.stringify(users));
  localStorage.setItem("sae-groups", JSON.stringify(groups));
  localStorage.setItem("sae-chatsPrivate", JSON.stringify(chatsPrivate));
}

function loadData() {
  const usersLS = localStorage.getItem("sae-users");
  const groupsLS = localStorage.getItem("sae-groups");
  const chatsLS = localStorage.getItem("sae-chatsPrivate");
  if (usersLS) users = JSON.parse(usersLS);
  if (groupsLS) groups = JSON.parse(groupsLS);
  if (chatsLS) chatsPrivate = JSON.parse(chatsLS);
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getUserColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

// Render users
function renderUsers(filter = "") {
  usersContainer.innerHTML = "";
  const filtered = users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()));
  filtered.forEach(user => {
    const div = document.createElement("div");
    div.classList.add("user-item");
    div.dataset.userid = user.id;
    div.innerHTML = `
      <img src="${user.avatar}" alt="${user.name}" class="user-avatar" />
      <div class="user-info">
        <div class="user-name">${user.name}</div>
      </div>
    `;
    div.addEventListener("click", () => openChat("user", user.id));
    usersContainer.appendChild(div);
  });
}

// Render groups and attach listeners
function renderGroups() {
  groupsContainer.innerHTML = "";
  groups.forEach(group => {
    const groupElem = groupTemplate.content.cloneNode(true);
    const groupItem = groupElem.querySelector(".group-item");
    const groupPhoto = groupElem.querySelector(".group-photo");
    const groupName = groupElem.querySelector(".group-name");
    const groupMeta = groupElem.querySelector(".group-meta");
    const groupMenuBtn = groupElem.querySelector(".group-menu-button");
    const groupMenu = groupElem.querySelector(".group-menu");
    const btnEdit = groupElem.querySelector(".menu-edit");
    const btnDelete = groupElem.querySelector(".menu-delete");

    groupPhoto.src = group.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    groupName.textContent = group.name;
    groupMeta.textContent = `${group.members.length} membro${group.members.length !== 1 ? "s" : ""}`;

    groupItem.dataset.groupid = group.id;

    // Open chat when clicking on group item (except menu button)
    groupItem.addEventListener("click", e => {
      if (!e.target.classList.contains("group-menu-button") &&
          !e.target.classList.contains("menu-edit") &&
          !e.target.classList.contains("menu-delete")
      ) {
        openChat("group", group.id);
      }
    });

    groupMenuBtn.addEventListener("click", e => {
  e.stopPropagation();
  closeAllGroupMenus();
  groupMenu.classList.toggle("show");
  groupMenu.classList.remove("hidden"); // garante que a classe 'hidden' não bloqueie
});


    btnEdit.addEventListener("click", e => {
      e.stopPropagation();
      closeAllGroupMenus();
      openGroupPopup(group.id);
    });

    btnDelete.addEventListener("click", e => {
      e.stopPropagation();
      closeAllGroupMenus();
      if (confirm(`Tem certeza que deseja excluir o grupo "${group.name}"?`)) {
        groups = groups.filter(g => g.id !== group.id);
        saveData();
        renderGroups();
        if (selectedChat.type === "group" && selectedChat.id === group.id) clearChatArea();
      }
    });

    groupsContainer.appendChild(groupElem);
  });
}

// Close all group menus
function closeAllGroupMenus() {
  document.querySelectorAll(".group-menu").forEach(menu => {
    menu.classList.remove("show");
    menu.classList.add("hidden");
  });
}
document.addEventListener("click", () => closeAllGroupMenus());



// Close menus on clicking outside
document.addEventListener("click", () => {
  closeAllGroupMenus();
});

// Get sender user object
function getChatSenderObject(from) {
  if (from === 0) {
    return { id: 0, name: "Você", avatar: "https://cdn-icons-png.flaticon.com/512/147/147142.png" };
  }
  const u = users.find(x => x.id === from);
  if (u) return u;
  return { id: from, name: "Desconhecido", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" };
}

// Render messages of selected chat
function renderMessages() {
  messagesArea.innerHTML = "";

  if (selectedChat.type === null) {
    messagesArea.innerHTML = `
      <div class="empty-note">
        <h2>Selecione um grupo ou usuário</h2>
        <p>Nenhuma conversa selecionada.</p>
      </div>
    `;
    composer.classList.add("hidden");
    openGroupConfigBtn.style.display = "none";
    return;
  }

  composer.classList.remove("hidden");

  let messages = [];

  if (selectedChat.type === "user") {
    messages = getPrivateMessages(selectedChat.id);
    openGroupConfigBtn.style.display = "none";
  } else if (selectedChat.type === "group") {
    const group = groups.find(g => g.id === selectedChat.id);
    messages = group ? (group.messages || []) : [];
    openGroupConfigBtn.style.display = "inline-block";
  }

  if (!messages.length) {
    messagesArea.innerHTML = `
      <div class="empty-note">
        <h2>Nenhuma mensagem ainda</h2>
        <p>Envie uma mensagem para começar a conversar.</p>
      </div>
    `;
    return;
  }

  messages.forEach(msg => {
  const div = document.createElement("div");
  div.classList.add("message");
  const sender = getChatSenderObject(msg.from);
  div.classList.add(sender.id === 0 ? "from-me" : "from-them");
  const bubbleColor = getUserColor(sender.name);

  const hora = new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = `
    <div class="message-avatar">
      <img src="${sender.avatar}" alt="${sender.name}">
    </div>
    <div class="message-content" style="background: ${bubbleColor}; color: white; position: relative;">
      <div class="message-author">${escapeHTML(sender.name)}</div>
      <div class="message-text">${escapeHTML(msg.text)}</div>
      <div class="message-date">${hora}</div>
    </div>
  `;

  messagesArea.appendChild(div);
});


  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Get private messages for user
function getPrivateMessages(userId) {
  const key = getChatKey(0, userId);
  if (!chatsPrivate[key]) chatsPrivate[key] = [];
  return chatsPrivate[key];
}

// Generate key for chat between two ids
function getChatKey(id1, id2) {
  return id1 < id2 ? `chat-${id1}-${id2}` : `chat-${id2}-${id1}`;
}

// Open chat (user or group)
function openChat(type, id) {
  selectedChat.type = type;
  selectedChat.id = id;

  if (type === "user") {
    const user = users.find(u => u.id === id);
    if (!user) return;
    chatName.textContent = user.name;
    chatAvatar.src = user.avatar;
    chatMeta.textContent = "Conversa privada";
    openGroupConfigBtn.style.display = "none";
  } else if (type === "group") {
    const group = groups.find(g => g.id === id);
    if (!group) return;
    chatName.textContent = group.name;
    chatAvatar.src = group.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    chatMeta.textContent = `${group.members.length} membro${group.members.length !== 1 ? "s" : ""}`;
    openGroupConfigBtn.style.display = "inline-block";
  }

  renderMessages();
}

// Send message
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text || !selectedChat.type || !selectedChat.id) return;

  const now = new Date().toISOString();

  if (selectedChat.type === "user") {
    const key = getChatKey(0, selectedChat.id);
    if (!chatsPrivate[key]) chatsPrivate[key] = [];
    chatsPrivate[key].push({ from: 0, text, date: now });
  } else if (selectedChat.type === "group") {
    const group = groups.find(g => g.id === selectedChat.id);
    if (!group) return;
    if (!group.messages) group.messages = [];
    group.messages.push({ from: 0, text, date: now });
  }

  saveData();
  msgInput.value = "";
  msgInput.focus();
  renderMessages();

  simulateReply();
}

// Auto replies for simulation
const autoReplies = {
  1: ["Entendi!", "Certo, professor!", "Vou verificar isso.", "Obrigado pela ajuda!", "Pode me explicar depois?"],
  2: ["Perfeito!", "Sim professor!", "Já estou fazendo!", "Ótima explicação!", "Certo, vou revisar."],
  3: ["Ahh sim!", "Beleza, professor.", "Valeu!", "Entendi quase tudo, rs", "Já estou resolvendo."],
  4: ["Show!", "Demorou professor!", "Pode deixar!", "Vou estudar isso aí.", "Tranquilo!"]
};

function getRandomReply(userId) {
  const list = autoReplies[userId];
  return list[Math.floor(Math.random() * list.length)];
}

// Simulate replies
function simulateReply() {
  if (selectedChat.type === "user") {
    const userId = selectedChat.id;
    setTimeout(() => {
      const key = getChatKey(0, userId);
      if (!chatsPrivate[key]) chatsPrivate[key] = [];

      chatsPrivate[key].push({
        from: userId,
        text: getRandomReply(userId),
        date: new Date().toISOString()
      });

      saveData();
      if (selectedChat.type === "user" && selectedChat.id === userId) renderMessages();
    }, 1000 + Math.random() * 3000);
  }

  if (selectedChat.type === "group") {
    const group = groups.find(g => g.id === selectedChat.id);
    if (!group) return;

    const members = group.members.filter(id => id !== 0);
    if (members.length === 0) return;

    const replyingUser = members[Math.floor(Math.random() * members.length)];

    setTimeout(() => {
      group.messages.push({
        from: replyingUser,
        text: getRandomReply(replyingUser),
        date: new Date().toISOString()
      });

      saveData();
      if (selectedChat.type === "group") renderMessages();
    }, 1000 + Math.random() * 3000);
  }
}

// Clear chat area
function clearChatArea() {
  selectedChat = { type: null, id: null };
  renderMessages();
  chatName.textContent = "Selecione um grupo ou usuário";
  chatMeta.textContent = "Nenhuma conversa selecionada.";
  chatAvatar.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  composer.classList.add("hidden");
  openGroupConfigBtn.style.display = "none";
}

// Popup group functionalities
let currentEditingGroupId = null;

function openGroupPopup(groupId = null) {
  currentEditingGroupId = groupId;
  popupMembers.innerHTML = "";
  popupAvatarPreview.innerHTML = "";
  popupAvatarInput.value = "";

  if (groupId === null) {
    popupGroupName.value = "";
    popupLeaveBtn.style.display = "none";
  } else {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    popupGroupName.value = group.name;
    if (group.avatar) {
      const img = document.createElement("img");
      img.src = group.avatar;
      img.alt = "Avatar do grupo";
      popupAvatarPreview.appendChild(img);
    }
    popupLeaveBtn.style.display = "inline-block";
  }

  users.forEach(user => {
    const div = document.createElement("div");
    div.classList.add("popup-member-item");

    const checked = groupId !== null && (groups.find(g => g.id === groupId) || { members: [] }).members.includes(user.id);

    div.innerHTML = `
      <label>
        <input type="checkbox" value="${user.id}" ${checked ? "checked" : ""}/>
        <img src="${user.avatar}" alt="${user.name}" class="popup-member-avatar" />
        ${user.name}
      </label>
    `;

    popupMembers.appendChild(div);
  });

  popupOverlay.classList.remove("hidden");
  popupGroupInfo.classList.remove("hidden");
  popupGroupName.focus();
}

function closeGroupPopup() {
  popupOverlay.classList.add("hidden");
  popupGroupInfo.classList.add("hidden");
  currentEditingGroupId = null;
}

// Save group
function saveGroup() {
  const name = popupGroupName.value.trim();
  if (!name) {
    alert("Informe o nome do grupo.");
    popupGroupName.focus();
    return;
  }

  const memberCheckboxes = popupMembers.querySelectorAll("input[type=checkbox]:checked");
  if (memberCheckboxes.length === 0) {
    alert("Selecione ao menos um membro para o grupo.");
    return;
  }
  const members = Array.from(memberCheckboxes).map(cb => parseInt(cb.value));

  const avatar = popupAvatarPreview.querySelector("img")?.src || null;

  if (currentEditingGroupId === null) {
    const newGroup = { id: generateId(groups), name, avatar, members, messages: [] };
    groups.push(newGroup);
  } else {
    const group = groups.find(g => g.id === currentEditingGroupId);
    if (!group) return;
    group.name = name;
    group.members = members;
    group.avatar = avatar;
  }

  saveData();
  renderGroups();
  closeGroupPopup();
}

function leaveGroup() {
  if (currentEditingGroupId === null) return;
  if (!confirm("Tem certeza que deseja sair do grupo?")) return;

  const group = groups.find(g => g.id === currentEditingGroupId);
  if (!group) return;

  group.members = group.members.filter(id => id !== 0);
  saveData();
  renderGroups();
  closeGroupPopup();

  if (selectedChat.type === "group" && selectedChat.id === currentEditingGroupId) clearChatArea();
}

// Avatar preview on input change
popupAvatarInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    popupAvatarPreview.innerHTML = "";
    const img = document.createElement("img");
    img.src = event.target.result;
    popupAvatarPreview.appendChild(img);
  };
  reader.readAsDataURL(file);
});

// Event listeners
searchUsersInput.addEventListener("input", e => renderUsers(e.target.value));
sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });
addGroupBtn.addEventListener("click", () => openGroupPopup(null));
popupCloseBtn.addEventListener("click", closeGroupPopup);
popupOverlay.addEventListener("click", closeGroupPopup);
popupSaveBtn.addEventListener("click", saveGroup);
popupLeaveBtn.addEventListener("click", leaveGroup);
openGroupConfigBtn.addEventListener("click", () => {
  if (selectedChat.type === "group" && selectedChat.id !== null) openGroupPopup(selectedChat.id);
});
document.addEventListener("click", closeAllGroupMenus);

// Dropdown user menu toggle
document.querySelector(".dropbtn").addEventListener("click", function(e) {
  e.stopPropagation();
  document.querySelector(".dropdown-content").classList.toggle("show");
});
window.addEventListener("click", function(event) {
  if (!event.target.closest(".dropdown")) document.querySelector(".dropdown-content").classList.remove("show");
});

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("modo-claro");
  localStorage.setItem("sae-tema", document.body.classList.contains("modo-claro") ? "claro" : "escuro");
  atualizarIconeTema();
});

function atualizarIconeTema() {
  const botao = document.getElementById("themeToggle");
  botao.textContent = document.body.classList.contains("modo-claro") ? "☀️" : "🌙";
}

// Reset site button
document.getElementById("resetSite").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

// Initialization
function init() {
  loadData();

  if (!groups || groups.length === 0) {
    groups = [
      {
        id: 1,
        name: "Turma de Matemática",
        avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        members: [0, 1, 2, 3],
        messages: [
          { from: 1, text: "Boa tarde, professor!", date: new Date(Date.now() - 3600 * 1000).toISOString() },
          { from: 0, text: "Boa tarde, turma! Hoje vamos revisar álgebra.", date: new Date(Date.now() - 3500 * 1000).toISOString() },
          { from: 2, text: "Ótimo! Estou pronto.", date: new Date(Date.now() - 3400 * 1000).toISOString() }
        ]
      },
      {
        id: 2,
        name: "Grupo do RH",
        avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135716.png",
        members: [0, 2, 3],
        messages: [
          { from: 3, text: "Alguém quer revisar o asssunto de segunda?", date: new Date(Date.now() - 7200 * 1000).toISOString() },
          { from: 0, text: "Sim, se possivel", date: new Date(Date.now() - 7100 * 1000).toISOString() }
        ]
      }
    ];
  }

  users.forEach(u => {
    const key = getChatKey(0, u.id);
    if (!chatsPrivate[key]) {
      chatsPrivate[key] = [
        { from: u.id, text: `Olá professor! Aqui é ${u.name}.`, date: new Date(Date.now() - 60000).toISOString() },
        { from: 0, text: `Oi ${u.name}, vamos conversar!`, date: new Date(Date.now() - 30000).toISOString() }
      ];
    }
  });

  renderUsers();
  renderGroups();
  clearChatArea();
  saveData();

  const tema = localStorage.getItem("sae-tema");
  if (tema === "claro") document.body.classList.add("modo-claro");
  atualizarIconeTema();
}

init();
