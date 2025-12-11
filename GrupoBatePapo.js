/* GrupoBatePapo.js
   Versão final integrada (popup + modais + mensagens + tema)
   Mantém os mesmos IDs do seu HTML.
*/

// ----------------------
// CONFIGURAÇÕES E DADOS
// ----------------------
const STORAGE_KEY = 'sae-chat-data-v1';

const initial = {
  users: [
    { name: 'Ana', img: 'https://randomuser.me/api/portraits/women/68.jpg', online: true },
    { name: 'Carlos', img: 'https://randomuser.me/api/portraits/men/44.jpg', online: false },
    { name: 'Lucas', img: 'https://randomuser.me/api/portraits/men/12.jpg', online: true },
    { name: 'João', img: 'https://randomuser.me/api/portraits/men/32.jpg', online: false }
  ],
  groups: {
    'Biblioteca': { meta:{ avatar:'https://cdn-icons-png.flaticon.com/512/149/149071.png', members:['João','Ana'] }, messages:[ { type:'system', text:'Grupo criado.' }, { from:'João', text:'Vamos ao estudo hoje às 15h?' } ] },
    'Educação Física': { meta:{ avatar:'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', members:['Lucas'] }, messages:[ { type:'system', text:'Bem-vindo ao grupo.' }, { from:'Lucas', text:'Treino às 10h na quadra.' } ] },
    'Ciências': { meta:{ avatar:'https://cdn-icons-png.flaticon.com/512/149/149071.png', members:['Ana','Carlos'] }, messages:[ { type:'system', text:'Discussão sobre experimento.' }, { from:'Ana', text:'Levem proteção!' } ] }
  }
};

let store = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || initial;
let usersData = store.users;
let groupsData = store.groups;

// compatibilidade: se algum grupo estiver em formato antigo (array), converte
function normalizeGroups(){
  Object.keys(groupsData).forEach(k => {
    const g = groupsData[k];
    if(Array.isArray(g)){
      groupsData[k] = { meta:{ avatar:'https://cdn-icons-png.flaticon.com/512/149/149071.png', members:[] }, messages: g };
    } else {
      groupsData[k].meta = groupsData[k].meta || { avatar:'https://cdn-icons-png.flaticon.com/512/149/149071.png', members:[] };
      groupsData[k].messages = groupsData[k].messages || [];
    }
  });
}
normalizeGroups();

// ----------------------
// SELECTORES (DOM)
// ----------------------
const usersEl = document.getElementById('users');
const groupsEl = document.getElementById('groups');
const messagesEl = document.getElementById('messages');
const chatCard = document.getElementById('chatCard');
const chatName = document.getElementById('chatName');
const chatMeta = document.getElementById('chatMeta');
const chatAvatar = document.getElementById('chatAvatar');
const composer = document.getElementById('composer');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const addGroupBtn = document.getElementById('addGroup');
const themeToggle = document.getElementById('themeToggle');

// popup elements
const popup = document.getElementById('popupGroupInfo');
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupGroupName = document.getElementById('popupGroupName');
const popupAvatarInput = document.getElementById('popupAvatarInput');
const popupAvatarPreview = document.getElementById('popupAvatarPreview');
const popupSaveBtn = document.getElementById('popupSaveBtn');
const popupLeaveBtn = document.getElementById('popupLeaveBtn');

let currentConversation = null; // { type: 'group'|'user', id: string }
let typingTimer = null;
let typingElement = null;

// ----------------------
// UTILITÁRIAS
// ----------------------
function saveStore(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ users: usersData, groups: groupsData }));
}
function el(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ============================
   TEMA CLARO / ESCURO
   ============================ */

// Carregar tema salvo
document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("sae-tema");

  if (temaSalvo === "claro") {
    document.body.classList.add("modo-claro");
  }

  atualizarIconeTema();
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
// ----------------------
// RENDER USUÁRIOS
// ----------------------
function renderUsers(){
  usersEl.innerHTML = '';
  usersData.forEach(u => {
    const d = el('div','user-item');
    d.innerHTML = `
      <img src="${u.img}" alt="${escapeHtml(u.name)}">
      <div class="meta"><div class="name">${escapeHtml(u.name)}</div><div class="status">${u.online ? 'Online' : 'Offline'}</div></div>
    `;
    d.addEventListener('click', ()=> openConversation({ type:'user', id: u.name }));
    usersEl.appendChild(d);
    // animação suave
    d.style.opacity = 0; d.style.transform = 'translateY(6px)';
    setTimeout(()=>{ d.style.transition='all .22s'; d.style.opacity=1; d.style.transform='translateY(0)'; }, 20);
  });
}

// ----------------------
// RENDER GRUPOS
// ----------------------
function renderGroups() {
    groupsEl.innerHTML = '';

    Object.keys(groupsData).forEach(name => {
        const item = groupsData[name];

        const g = el('div', 'group-item');

        const totalMembers = item.meta.members?.length || 0;

        g.innerHTML = `
            <div class="group-left">
                <!-- Foto do grupo -->
                <img class="group-avatar" 
                     src="${item.meta.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" 
                     alt="">

                <div class="group-info">
                    <div class="group-name">${escapeHtml(name)}</div>

                    <!-- Número de membros -->
                    <div class="group-count">${totalMembers} membros</div>
                </div>
            </div>

            <button class="menu-btn" aria-label="Menu do grupo">⋮</button>
        `;

        g.querySelector('.menu-btn').addEventListener('click', (e)=>{
            e.stopPropagation();
            openGroupMenu(e, name);
        });

        g.addEventListener("click", () => 
    openConversation({ type: "group", id: name })
       );

        g.querySelector('.menu-btn').addEventListener("click", (e) => {
    e.stopPropagation(); // impede que o clique abra o grupo
    openGroupMenu(e, name);
        });

        groupsEl.appendChild(g);

        // animação suave
        g.style.opacity = 0;
        g.style.transform = 'translateX(-8px)';
        setTimeout(()=>{
            g.style.transition='all .22s';
            g.style.opacity=1;
            g.style.transform='translateX(0)';
        }, 30);
    });
}

function renderGroupList() {
    const container = document.getElementById("groups");
    const template = document.getElementById("groupTemplate");

    container.innerHTML = ""; // limpa

    groups.forEach(group => {
        const item = template.content.cloneNode(true);

        item.querySelector(".group-name").textContent = group.name;
        item.querySelector(".group-members").textContent = `${group.members.length} membros`;

        // botão ⋮
        item.querySelector(".menu-btn").onclick = (e) =>
            openGroupMenu(e, group.id);

        container.appendChild(item);
    });
}

// ----------------------
// MENU FLUTUANTE DO GRUPO
// ----------------------
function openGroupMenu(e, groupName){
  closeAnyMenu();
  const menu = el('div','group-menu');
  menu.style.left = (e.clientX - 10) + 'px';
  menu.style.top = (e.clientY + 6) + 'px';
  menu.innerHTML = `
    <button data-action="rename">✏️ Renomear</button>
    <button data-action="edit">🛠️ Editar membros / avatar</button>
    <button data-action="manage">👥 Gerenciar membros (rápido)</button>
    <button data-action="delete">🗑️ Excluir</button>
  `;
  document.body.appendChild(menu);
  menu.addEventListener('click', (ev)=>{
    const action = ev.target.getAttribute('data-action');
    if(action === 'rename'){ menu.remove(); renameGroup(groupName); }
    if(action === 'edit'){ menu.remove(); openEditGroupModal(groupName); }
    if(action === 'manage'){ menu.remove(); manageMembers(groupName); }
    if(action === 'delete'){ menu.remove(); deleteGroupConfirmed(groupName); }
  });
  setTimeout(()=>{ window.addEventListener('click', closeAnyMenu, { once:true }); }, 40);
}
function closeAnyMenu(){ document.querySelectorAll('.group-menu').forEach(m=>m.remove()); }

// ----------------------
// AÇÕES DE GRUPO
// ----------------------
function renameGroup(oldName){
  const newName = prompt('Novo nome do grupo:', oldName);
  if(!newName) return;
  if(groupsData[newName]) return alert('Já existe um grupo com esse nome.');
  groupsData[newName] = groupsData[oldName];
  delete groupsData[oldName];
  if(currentConversation && currentConversation.type==='group' && currentConversation.id===oldName) currentConversation.id = newName;
  saveStore(); renderGroups(); if(currentConversation) openConversation(currentConversation);
}
function deleteGroupConfirmed(name){
  if(!confirm(`Excluir grupo "${name}"?`)) return;
  delete groupsData[name];
  // remover DMs que tinham o mesmo nome (limpeza)
  const dmKey = `__dm__${name}`;
  if(groupsData[dmKey]) delete groupsData[dmKey];
  closeConversation(); saveStore(); renderGroups();
}

// Gerenciamento rápido via prompt (compatibilidade).
function manageMembers(name){
  const cmd = prompt(`Gerenciar membros de "${name}":\n(1) Adicionar pelo nome\n(2) Remover pelo nome\nDigite 1 ou 2`, '1');
  if(cmd === '1'){
    const who = prompt('Digite o nome do usuário para adicionar:'); if(!who) return;
    if(!groupsData[name].meta.members.includes(who)) groupsData[name].meta.members.push(who);
    groupsData[name].messages.push({ type:'system', text:`${who} foi adicionado ao grupo.` });
    saveStore(); if(currentConversation && currentConversation.type==='group' && currentConversation.id===name) renderMessages(groupsData[name].messages);
  } else if(cmd === '2'){
    const who = prompt('Digite o nome do usuário para remover:'); if(!who) return;
    groupsData[name].meta.members = (groupsData[name].meta.members||[]).filter(x=>x!==who);
    groupsData[name].messages.push({ type:'system', text:`${who} foi removido do grupo.` });
    // remover DM associado ao usuário para evitar "ghost DM"
    const dmKey = `__dm__${who}`;
    if(groupsData[dmKey]) delete groupsData[dmKey];
    saveStore(); if(currentConversation && currentConversation.type==='group' && currentConversation.id===name) renderMessages(groupsData[name].messages);
  }
}

// ----------------------
// MODAIS: CRIAR / EDITAR GRUPO (com upload de imagem)
// ----------------------
function openCreateGroupModal(){
  const backdrop = el('div','modal-backdrop');
  const modal = el('div','modal');
  modal.innerHTML = `<h3>Criar novo grupo</h3>`;

  const nameRow = el('div'); nameRow.innerHTML = `<label>Nome do grupo:</label><input id='newGroupName' style='width:100%;margin-top:6px;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06)'>`;
  modal.appendChild(nameRow);

  const avatarRow = el('div'); avatarRow.style.marginTop = '8px';
  avatarRow.innerHTML = `
    <label>Avatar (URL ou upload):</label>
    <input id='newGroupAvatarUrl' placeholder='URL (opcional)' style='width:100%;margin-top:6px;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06)'>
    <input id='newGroupAvatarFile' type='file' accept='image/*' style='margin-top:8px'>
  `;
  modal.appendChild(avatarRow);

  modal.appendChild(el('hr'));
  modal.appendChild(el('div')).innerHTML = `<small>Marque os usuários que estarão no grupo</small>`;
  const list = el('div'); list.style.marginTop = '8px';
  usersData.forEach(u => { const line = el('label','user-checkbox'); line.innerHTML = `<input type='checkbox' data-name='${u.name}'> <img src='${u.img}' style='width:28px;height:28px;border-radius:50%'> <span style='margin-left:8px'>${u.name}</span>`; list.appendChild(line); });
  modal.appendChild(list);

  const preview = el('div','members-preview'); modal.appendChild(preview);
  list.addEventListener('change', ()=>{ preview.innerHTML=''; Array.from(list.querySelectorAll('input[type=checkbox]')).forEach(ch=>{ if(ch.checked){ const name = ch.getAttribute('data-name'); const u = usersData.find(x=>x.name===name); if(u) preview.appendChild(Object.assign(document.createElement('img'),{src:u.img,title:u.name})); }}); });

  const actions = el('div'); actions.style.marginTop = '12px'; actions.innerHTML = `<button id='createGroupSave' class='btn'>Criar</button> <button id='createGroupCancel' class='btn secondary'>Cancelar</button>`;
  modal.appendChild(actions);

  backdrop.appendChild(modal); document.body.appendChild(backdrop);

  backdrop.addEventListener('click', (ev)=>{ if(ev.target === backdrop) backdrop.remove(); });
  document.getElementById('createGroupCancel').addEventListener('click', ()=> backdrop.remove());

  document.getElementById('createGroupSave').addEventListener('click', async ()=>{
    const name = document.getElementById('newGroupName').value.trim();
    if(!name){ alert('Digite um nome para o grupo.'); return; }
    if(groupsData[name]){ alert('Já existe um grupo com esse nome.'); return; }

    const fileInput = document.getElementById('newGroupAvatarFile');
    const urlInput = document.getElementById('newGroupAvatarUrl').value.trim();
    let avatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    if(fileInput && fileInput.files && fileInput.files[0]){
      try{ avatar = await fileToDataUrl(fileInput.files[0]); }catch(e){ console.warn('Erro conversão arquivo:', e); }
    } else if(urlInput){ avatar = urlInput; }

    const members = Array.from(list.querySelectorAll('input[type=checkbox]')).filter(c=>c.checked).map(c=>c.getAttribute('data-name'));
    groupsData[name] = { meta: { avatar, members }, messages: [{type:'system', text:`Grupo "${name}" criado.`}] };
    saveStore(); renderGroups(); backdrop.remove();
  });
}

function openEditGroupModal(groupName){
  const data = groupsData[groupName];
  const backdrop = el('div','modal-backdrop');
  const modal = el('div','modal');
  modal.innerHTML = `<h3>Editar grupo: ${escapeHtml(groupName)}</h3>`;

  const avatarRow = el('div');
  avatarRow.innerHTML = `<label>Avatar (URL ou upload):</label><input id='avatarUrl' style='width:100%;margin-top:6px;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06)' value='${data.meta.avatar || ''}'><input id='avatarFile' type='file' accept='image/*' style='margin-top:8px'>`;
  modal.appendChild(avatarRow);

  modal.appendChild(el('hr'));
  const info = el('div'); info.innerHTML = `<small>Marque os usuários que pertencem ao grupo</small>`; modal.appendChild(info);

  const list = el('div'); list.style.marginTop = '8px';
  usersData.forEach(u => {
    const line = el('label','user-checkbox');
    line.innerHTML = `<input type='checkbox' data-name='${u.name}' ${ (data.meta.members||[]).includes(u.name) ? 'checked' : '' }> <img src='${u.img}' style='width:28px;height:28px;border-radius:50%'> <span style='margin-left:8px'>${u.name}</span>`;
    list.appendChild(line);
  });
  modal.appendChild(list);

  const preview = el('div','members-preview');
  const refreshPreview = ()=>{
    preview.innerHTML = '';
    Array.from(list.querySelectorAll('input[type=checkbox]')).forEach(ch => { if(ch.checked){ const name = ch.getAttribute('data-name'); const u = usersData.find(x=>x.name===name); if(u) preview.appendChild(Object.assign(document.createElement('img'),{src:u.img,title:u.name})); }});
  };
  list.addEventListener('change', refreshPreview); refreshPreview(); modal.appendChild(preview);

  const actions = el('div'); actions.style.marginTop = '12px'; actions.innerHTML = `<button id='saveGroup' class='btn'>Salvar</button> <button id='cancelGroup' class='btn secondary'>Cancelar</button>`;
  modal.appendChild(actions);

  backdrop.appendChild(modal); document.body.appendChild(backdrop);
  backdrop.addEventListener('click', (ev)=>{ if(ev.target === backdrop) backdrop.remove(); });
  document.getElementById('cancelGroup').addEventListener('click', ()=> backdrop.remove());

  document.getElementById('saveGroup').addEventListener('click', async ()=>{
    const url = document.getElementById('avatarUrl').value.trim();
    const fileInput = document.getElementById('avatarFile');
    let avatar = data.meta.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    if(fileInput && fileInput.files && fileInput.files[0]){
      try{ avatar = await fileToDataUrl(fileInput.files[0]); }catch(e){ console.warn('Erro conversão arquivo:', e); }
    } else if(url) avatar = url;

    const selected = Array.from(list.querySelectorAll('input[type=checkbox]')).filter(c=>c.checked).map(c=>c.getAttribute('data-name'));
    groupsData[groupName].meta.avatar = avatar;
    groupsData[groupName].meta.members = selected;
    groupsData[groupName].messages.push({ type:'system', text: `Grupo atualizado.` });
    saveStore(); renderGroups(); if(currentConversation && currentConversation.type==='group' && currentConversation.id===groupName) openConversation(currentConversation);
    backdrop.remove();
  });
}

// helper: converte arquivo para dataURL (base64)
function fileToDataUrl(file){
  return new Promise((resolve,reject)=>{
    const fr = new FileReader();
    fr.onload = ()=> resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

// ----------------------
// POPUP (info do grupo): abrir/fechar / avatar / salvar / sair
// ----------------------
function openPopupForGroup(groupName){
  const g = groupsData[groupName];
  if(!g) return;
  popupGroupName.value = groupName;
  popupAvatarPreview.style.backgroundImage = `url('${g.meta.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}')`;
  popup.classList.add('open'); popup.classList.remove('hidden');
  popupOverlay.classList.add('show'); popupOverlay.classList.remove('hidden');
  popup.classList.add('open');
  currentConversation = { type:'group', id: groupName };
  chatName.textContent = groupName;
  chatAvatar.src = g.meta.avatar || chatAvatar.src;
  if(!chatCard.classList.contains('empty')){} // keep
}

// fechar popup
function closePopup(){
  popup.classList.remove('open'); popup.classList.add('hidden');
  popupOverlay.classList.remove('show'); popupOverlay.classList.add('hidden');
}
popupClose.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', closePopup);

// avatar upload dentro do popup
popupAvatarInput.addEventListener('change', async function(){
  const f = this.files && this.files[0];
  if(!f) return;
  try{
    const data = await fileToDataUrl(f);
    popupAvatarPreview.style.backgroundImage = `url('${data}')`;
    // save temporarily in groupsData for the current group (if set)
    if(currentConversation && currentConversation.type === 'group' && groupsData[currentConversation.id]){
      groupsData[currentConversation.id].meta.avatar = data;
    }
  }catch(e){ console.warn(e); }
});

// salvar alterações do popup
popupSaveBtn.addEventListener('click', ()=>{
  if(!currentConversation || currentConversation.type !== 'group') { closePopup(); return; }
  const oldName = currentConversation.id;
  const newName = popupGroupName.value.trim() || oldName;
  // se renomeou e já existe outro nome
  if(newName !== oldName && groupsData[newName]) { alert('Já existe outro grupo com esse nome.'); return; }
  // renomear se necessário
  if(newName !== oldName){
    groupsData[newName] = groupsData[oldName];
    delete groupsData[oldName];
    currentConversation.id = newName;
  }
  // avatar already updated when upload happened
  saveStore(); renderGroups(); if(currentConversation) openConversation(currentConversation);
  closePopup();
});

// sair do grupo
popupLeaveBtn.addEventListener('click', ()=>{
  if(!currentConversation || currentConversation.type !== 'group') return;
  if(!confirm('Deseja sair do grupo?')) return;
  // remove usuário 'Você' dos membros, e cria mensagem de sistema
  const g = groupsData[currentConversation.id];
  if(g){
    g.meta.members = (g.meta.members||[]).filter(x => x !== 'Você');
    g.messages.push({ type:'system', text: 'Você saiu do grupo.' });
    // opcional: se não houver membros, excluir grupo
    // if((g.meta.members||[]).length === 0) delete groupsData[currentConversation.id];
  }
  saveStore(); renderGroups(); closeConversation(); closePopup();
});

// ----------------------
// CONVERSAS
// ----------------------
function openConversation(conv){
  if(!conv) return;
  currentConversation = conv;
  chatCard.classList.remove('empty');
  composer.classList.remove('hidden');

  if(conv.type === 'group'){
    chatName.textContent = conv.id;
    const g = groupsData[conv.id];
    chatMeta.textContent = `${g.messages.length || 0} mensagens`;
    chatAvatar.src = g.meta.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    renderMessages(g.messages);
  } else {
    chatName.textContent = conv.id;
    chatMeta.textContent = 'Conversa direta';
    const u = usersData.find(x=>x.name===conv.id);
    chatAvatar.src = u ? u.img : 'https://randomuser.me/api/portraits/lego/1.jpg';
    const key = `__dm__${conv.id}`;
    if(!groupsData[key]){
      groupsData[key] = { meta:{ avatar: u ? u.img : '', members:[conv.id] }, messages:[ { type:'system', text:`Conversa com ${conv.id} iniciada.` }, { from: conv.id, text: sampleReply() }, { from: 'Você', text: 'Oi! Como vai?' }, { from: conv.id, text: sampleReply() } ] };
      saveStore();
    }
    renderMessages(groupsData[key].messages);
  }
  closeAnyMenu();
}

function closeConversation(){
  currentConversation = null;
  chatCard.classList.add('empty');
  composer.classList.add('hidden');
  messagesEl.innerHTML = `<div class="empty-note"><h2>Selecione um grupo ou usuário</h2><p>Nenhuma conversa selecionada.</p></div>`;
  chatName.textContent = 'Selecione um grupo ou usuário';
  chatMeta.textContent = 'Nenhuma conversa selecionada.';
}

function renderMessages(arr){
  messagesEl.innerHTML = '';
  if(!arr || arr.length === 0){ messagesEl.innerHTML = `<div class="message system">Nenhuma mensagem ainda.</div>`; return; }
  arr.forEach(m => {
    const elMsg = el('div','message');
    if(m.type === 'system'){ elMsg.className = 'message system'; elMsg.textContent = m.text; }
    else if(m.from === 'Você'){ elMsg.className = 'message me'; elMsg.innerHTML = `<div>${escapeHtml(m.text)}</div>`; }
    else { elMsg.className = 'message other'; elMsg.innerHTML = `<strong>${escapeHtml(m.from)}</strong><div style="margin-top:6px">${escapeHtml(m.text)}</div>`; }
    messagesEl.appendChild(elMsg);
    elMsg.style.opacity = 0; elMsg.style.transform = 'translateY(6px)';
    setTimeout(()=>{ elMsg.style.transition='all .18s'; elMsg.style.opacity=1; elMsg.style.transform='translateY(0)'; }, 10);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// typing indicator
function showTyping(name){ removeTyping(); typingElement = el('div','typing'); typingElement.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div><div style="margin-left:8px;color:var(--muted);">${escapeHtml(name)} está digitando...</div>`; messagesEl.appendChild(typingElement); messagesEl.scrollTop = messagesEl.scrollHeight; }
function removeTyping(){ if(typingElement && typingElement.parentNode) typingElement.parentNode.removeChild(typingElement); typingElement = null; }

// ----------------------
// ENVIAR MENSAGEM + REPLICA SIMULADA
// ----------------------
function sendMessage(){
  const text = msgInput.value.trim(); if(!text || !currentConversation) return;
  const key = currentConversation.type === 'group' ? currentConversation.id : `__dm__${currentConversation.id}`;
  if(!groupsData[key]) groupsData[key] = { meta:{avatar:'', members:[]}, messages: [] };
  groupsData[key].messages.push({ from: 'Você', text });
  saveStore(); renderMessages(groupsData[key].messages); msgInput.value = '';

  const replyDelay = 700 + Math.random()*900;
  showTyping(sampleFromGroup(currentConversation));
  clearTimeout(typingTimer);
  typingTimer = setTimeout(()=>{
    const replyFrom = currentConversation.type === 'group' ? sampleFromGroup(currentConversation.id) : currentConversation.id;
    removeTyping();
    groupsData[key].messages.push({ from: replyFrom, text: sampleReply() });
    saveStore(); renderMessages(groupsData[key].messages);
  }, replyDelay);
}

function sampleFromGroup(group){
  // se for conversa direta, retorna o outro
  if(!group || typeof group !== 'string') return currentConversation ? currentConversation.id : usersData[0].name;
  const grp = groupsData[group];
  const members = (grp && grp.meta && grp.meta.members && grp.meta.members.length>0) ? grp.meta.members : usersData.map(u=>u.name);
  return members[Math.floor(Math.random()*members.length)];
}
function sampleReply(){ const replies = ["Beleza, estou dentro!","Ótimo, combinado.","Vou levar o material.","Perfeito — até lá.","Entendi, obrigado!","Show, confirmado."]; return replies[Math.floor(Math.random()*replies.length)]; }

// ----------------------
// AUX: remover DM quando usuário deletado globalmente
// ----------------------
function removeUserCompletely(name){
  usersData = usersData.filter(u=>u.name !== name);
  const dmKey = `__dm__${name}`;
  if(groupsData[dmKey]) delete groupsData[dmKey];
  Object.keys(groupsData).forEach(g => { groupsData[g].meta.members = (groupsData[g].meta.members||[]).filter(m=>m!==name); });
  saveStore(); renderUsers(); renderGroups();
}

// ----------------------
// EVENTOS INICIAIS
// ----------------------
addGroupBtn.addEventListener('click', openCreateGroupModal);
sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') sendMessage(); });

// init
renderUsers(); renderGroups(); closeConversation();

// expose for debug
window.__sae = { usersData, groupsData, saveStore, openCreateGroupModal, openEditGroupModal, removeUserCompletely, openPopupForGroup };

document.getElementById("resetSite").addEventListener("click", () => {
    localStorage.clear();
    location.reload(); // garante que o estado volta exatamente ao padrão
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