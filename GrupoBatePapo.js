// Dados iniciais (mensagens naturais)
const groupChats = {
  "Biblioteca": [
    { from: "Ana", text: "Gente, vamos estudar na biblioteca depois da aula? Pode ser às 15h?" },
    { from: "Carlos", text: "15h pra mim tá ótimo. Levo resumos de história." },
    { from: "Você", text: "Beleza — encontro vocês perto da estante de literatura." }
  ],
  "Educação Física": [
    { from: "Lucas", text: "Treino amanhã cedo na quadra? 7h funciona?" },
    { from: "Você", text: "Posso às 7h, já aviso o pessoal do futsal." },
    { from: "Mariana", text: "Levem água e tênis, por favor." }
  ],
  "Ciências": [
    { from: "João", text: "Vamos fazer o experimento na sala 3. Quem traz reagentes?" },
    { from: "Ana", text: "Eu trago álcool e luvas." },
    { from: "Você", text: "Eu levo cronômetro e bloco de anotações." }
  ]
};

const privateChats = {
  "Ana": [
    { from: "Ana", text: "Oi! Você pode me ajudar com a tarefa de química?" },
    { from: "Você", text: "Posso sim. Quando quer revisar?" }
  ],
  "Carlos": [
    { from: "Carlos", text: "Tem como pegar minha apostila na biblioteca depois?" },
    { from: "Você", text: "Claro, encontro você às 15h." }
  ],
  "Lucas": [
    { from: "Lucas", text: "Confirmado para o treino às 7h?" },
    { from: "Você", text: "Confirmado, até lá!" }
  ],
  "João": [
    { from: "João", text: "Consegue revisar meu relatório?" },
    { from: "Você", text: "Sim, manda quando terminar." }
  ]
};

// DOM refs
const userList = document.getElementById('userList');
const groupList = document.getElementById('groupList');
const messagesArea = document.getElementById('messages');
const chatName = document.getElementById('chatName');
const chatAvatar = document.getElementById('chatAvatar');
const chatMeta = document.getElementById('chatMeta');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearChatBtn = document.getElementById('clearChatBtn');

// create-group popup refs
const openCreateGroup = document.getElementById('openCreateGroup');
const createGroupPopup = document.getElementById('createGroupPopup');
const newGroupInput = document.getElementById('newGroupInput');
const createUserList = document.getElementById('createUserList');
const cancelCreate = document.getElementById('cancelCreate');
const confirmCreate = document.getElementById('confirmCreate');

let current = { type: null, id: null }; // {type: 'group'|'user', id: 'Nome'}
const defaultAvatar = '../imagem/estudante-graduado.png';

// UTIL
function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function clearActive() {
  document.querySelectorAll('.group-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
}
function timeNow() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  return `${hh}:${mm}`;
}

// RENDER mensagens
function renderMessages(list) {
  messagesArea.innerHTML = '';
  if (!list || list.length === 0) {
    messagesArea.innerHTML = '<div class="empty-note">Nenhuma mensagem ainda.</div>';
    return;
  }
  list.forEach(m => {
    const div = document.createElement('div');
    div.className = 'msg ' + (m.from === 'Você' ? 'me' : 'other');
    div.innerHTML = `<span class="from">${escapeHtml(m.from)}</span>
                     <div class="text">${escapeHtml(m.text)}</div>
                     <span class="time">${m.time || timeNow()}</span>`;
    messagesArea.appendChild(div);
  });
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// abrir grupo
function openGroup(id, el) {
  clearActive();
  el.classList.add('active');
  current = { type: 'group', id };
  chatName.textContent = id;
  chatAvatar.src = defaultAvatar;
  chatMeta.innerHTML = `<span style="color:#2b6d6f">Grupo</span>`;
  renderMessages(groupChats[id] || []);
  messageInput.disabled = false; sendBtn.disabled = false; messageInput.focus();
}

// abrir privado
function openPrivate(id, el) {
  clearActive();
  el.classList.add('active');
  current = { type: 'user', id };
  chatName.textContent = id;
  const img = el.querySelector('img');
  chatAvatar.src = img ? img.src : defaultAvatar;
  const status = el.querySelector('.status-dot').classList.contains('status-online') ? 'Online' : 'Offline';
  chatMeta.innerHTML = `<span style="display:inline-flex;align-items:center;gap:8px"><span class="${el.querySelector('.status-dot').className}" style="width:10px;height:10px;border-radius:50%;"></span>${status}</span>`;
  renderMessages(privateChats[id] || []);
  messageInput.disabled = false; sendBtn.disabled = false; messageInput.focus();
}

// delegação: clicar usuário
userList.addEventListener('click', (e) => {
  const item = e.target.closest('.user-item');
  if (!item) return;
  openPrivate(item.dataset.id, item);
});

// delegação: abrir grupo (ignora clique no botão ⋮)
groupList.addEventListener('click', (e) => {
  const item = e.target.closest('.group-item');
  if (!item) return;
  if (e.target.classList.contains('menu-btn')) return; // botão do menu (tratado depois)
  openGroup(item.dataset.id, item);
});

// criar grupo: abrir popup com lista de usuários
openCreateGroup.addEventListener('click', () => {
  // preencher lista de usuários no popup
  createUserList.innerHTML = '';
  document.querySelectorAll('.user-item').forEach(u => {
    const id = u.dataset.id;
    const img = u.querySelector('img').src;
    const row = document.createElement('label');
    row.className = 'create-user-row';
    row.innerHTML = `<input type="checkbox" value="${escapeHtml(id)}"> <img src="${img}" alt="${escapeHtml(id)}"> <span style="font-weight:700; color:#03464a">${escapeHtml(id)}</span>`;
    createUserList.appendChild(row);
  });
  newGroupInput.value = '';
  createGroupPopup.classList.remove('hidden');
  createGroupPopup.setAttribute('aria-hidden','false');
});

// cancelar criação
cancelCreate.addEventListener('click', () => {
  createGroupPopup.classList.add('hidden');
  createGroupPopup.setAttribute('aria-hidden','true');
});

// confirmar criação
confirmCreate.addEventListener('click', () => {
  const name = newGroupInput.value.trim();
  if (!name) return alert('Digite o nome do grupo.');
  if (groupChats[name] || document.querySelector(`.group-item[data-id="${CSS.escape(name)}"]`)) return alert('Já existe um grupo com esse nome.');
  const checked = Array.from(createUserList.querySelectorAll('input[type=checkbox]:checked')).map(c => c.value);
  // criar grupo e mensagens iniciais
  groupChats[name] = [{ from: 'Sistema', text: `Grupo "${name}" criado. Participantes: ${checked.join(', ') || 'Nenhum'}`, time: timeNow() }];
  // criar elemento na lista
  const el = document.createElement('div');
  el.className = 'group-item';
  el.dataset.type = 'group';
  el.dataset.id = name;
  el.innerHTML = `<div class="group-left"><div class="group-name">${escapeHtml(name)}</div></div><div style="position:relative;"><button class="menu-btn" aria-label="Abrir menu do grupo">⋮</button></div>`;
  groupList.appendChild(el);
  // fechar popup e abrir o grupo
  createGroupPopup.classList.add('hidden'); createGroupPopup.setAttribute('aria-hidden','true');
  // abrir o grupo recém-criado
  openGroup(name, el);
});

// MENU FLUTUANTE: criar um único elemento reutilizável
const popMenu = document.createElement('div');
popMenu.className = 'pop-menu';
popMenu.innerHTML = `
  <button data-action="edit">Editar nome</button>
  <button data-action="delete">Excluir grupo</button>
  <button data-action="addmsg">Adicionar conversa simulada</button>
`;
document.body.appendChild(popMenu);

let menuOpenFor = null;

// posicionar e abrir menu ao lado do botão
function openPopMenu(buttonEl, groupId) {
  const rect = buttonEl.getBoundingClientRect();
  // posiciona à direita do botão (caberá automaticamente)
  const left = rect.right - popMenu.offsetWidth;
  popMenu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
  popMenu.style.left = Math.max(10, left + window.scrollX) + 'px';
  popMenu.classList.add('show');
  menuOpenFor = groupId;
}

// fechar menu
function closePopMenu() {
  popMenu.classList.remove('show');
  menuOpenFor = null;
}

// clique para abrir/fechar menu (delegação)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.menu-btn');
  if (!btn) {
    if (!e.target.closest('.pop-menu')) closePopMenu();
    return;
  }
  e.stopPropagation();
  const item = btn.closest('.group-item');
  const groupId = item && item.dataset.id;
  if (menuOpenFor === groupId) { closePopMenu(); return; }
  openPopMenu(btn, groupId);
});

// ações do menu
popMenu.addEventListener('click', (e) => {
  const action = e.target.closest('button') && e.target.closest('button').dataset.action;
  if (!action || !menuOpenFor) return;
  const groupId = menuOpenFor;
  const groupEl = document.querySelector(`.group-item[data-id="${CSS.escape(groupId)}"]`);
  if (action === 'edit') {
    const novo = prompt('Novo nome para o grupo:', groupId);
    if (!novo || !novo.trim()) { closePopMenu(); return; }
    if (novo !== groupId && (groupChats[novo] || document.querySelector(`.group-item[data-id="${CSS.escape(novo)}"]`))) {
      alert('Já existe um grupo com esse nome.');
      closePopMenu();
      return;
    }
    groupChats[novo] = groupChats[groupId];
    delete groupChats[groupId];
    groupEl.dataset.id = novo;
    groupEl.querySelector('.group-name').textContent = novo;
    if (current.type === 'group' && current.id === groupId) {
      current.id = novo; chatName.textContent = novo;
    }
  } else if (action === 'delete') {
    if (!confirm(`Excluir o grupo "${groupId}"?`)) { closePopMenu(); return; }
    delete groupChats[groupId];
    groupEl.remove();
    if (current.type === 'group' && current.id === groupId) {
      current = { type: null, id: null };
      chatName.textContent = 'Selecione um grupo ou usuário';
      messagesArea.innerHTML = '<div class="empty-note">Nenhuma conversa selecionada. Clique em um grupo ou usuário à esquerda.</div>';
      messageInput.disabled = true; sendBtn.disabled = true;
    }
  } else if (action === 'addmsg') {
    groupChats[groupId] = groupChats[groupId] || [];
    const sample = { from: 'Carlos', text: 'Pessoal, confirmando o horário combinado!', time: timeNow() };
    groupChats[groupId].push(sample);
    if (current.type === 'group' && current.id === groupId) renderMessages(groupChats[groupId]);
  }
  closePopMenu();
});

// fechar menu com esc
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopMenu(); });

// fechar menu ao resize
window.addEventListener('resize', () => { if (menuOpenFor) closePopMenu(); });

// enviar mensagem
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !current.type) return;
  const msg = { from: 'Você', text, time: timeNow() };
  if (current.type === 'group') {
    groupChats[current.id] = groupChats[current.id] || [];
    groupChats[current.id].push(msg);
    renderMessages(groupChats[current.id]);
  } else {
    privateChats[current.id] = privateChats[current.id] || [];
    privateChats[current.id].push(msg);
    renderMessages(privateChats[current.id]);
  }
  messageInput.value = ''; messageInput.focus();
  // resposta simulada em grupo
  if (current.type === 'group') {
    setTimeout(() => {
      const reply = { from: 'Carlos', text: 'Ok, combinado!', time: timeNow() };
      groupChats[current.id].push(reply);
      renderMessages(groupChats[current.id]);
    }, 700);
  }
}
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

// limpar chat
clearChatBtn.addEventListener('click', () => {
  if (!current.type) return;
  if (!confirm('Limpar todas as mensagens desta conversa?')) return;
  if (current.type === 'group') {
    groupChats[current.id] = [];
    renderMessages([]);
  } else {
    privateChats[current.id] = [];
    renderMessages([]);
  }
});

// dropdown do header
const dropdown = document.getElementById('userDropdown');
document.getElementById('dropBtn').addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('show'); });
document.addEventListener('click', (e) => { if (!dropdown.contains(e.target)) dropdown.classList.remove('show'); });

// inicial: nada aberto (padrão). Opcional: abrir 'Biblioteca' por padrão
// const defaultGroup = document.querySelector('.group-item[data-id="Biblioteca"]'); if (defaultGroup) openGroup('Biblioteca', defaultGroup);
