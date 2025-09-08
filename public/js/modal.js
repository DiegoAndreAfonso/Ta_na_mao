// modal.js - controla abertura/fechamento e troca de painéis
const openBtn = document.getElementById('openModalBtn');
const overlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('closeModalBtn');
const loginPanel = document.getElementById('loginPanel');
const registerPanel = document.getElementById('registerPanel');
const loginTitle = document.getElementById('loginTitle');
const registerTitle = document.getElementById('registerTitle');

function setActive(side){
  if(side === 'login'){
    loginPanel.classList.add('active');
    loginPanel.classList.remove('collapsed');
    registerPanel.classList.add('collapsed');
    registerPanel.classList.remove('active');
  } else {
    registerPanel.classList.add('active');
    registerPanel.classList.remove('collapsed');
    loginPanel.classList.add('collapsed');
    loginPanel.classList.remove('active');
  }
}

// open / close modal
if(openBtn){
  openBtn.addEventListener('click', ()=>{
    overlay.classList.add('open');
    // abrir com login ativo por padrão
    setActive('login');
    overlay.setAttribute('aria-hidden','false');
  });
}
if(closeBtn){
  closeBtn.addEventListener('click', ()=>{
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
  });
}
// fechar ao clicar fora do modal
if(overlay){
  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay) overlay.classList.remove('open');
  });
}

// permitir trocar clicando nos títulos
if(loginTitle) loginTitle.addEventListener('click', ()=> setActive('login'));
if(registerTitle) registerTitle.addEventListener('click', ()=> setActive('register'));

// open modal from landing page header
const openModalBtnLanding = document.getElementById('openModalBtnLanding');
if(openModalBtnLanding){
  openModalBtnLanding.addEventListener('click', ()=>{
    overlay.classList.add('open');
    setActive('login');
    overlay.setAttribute('aria-hidden','false');
  });
}

// Edit user modal handlers
const editOverlay = document.getElementById('editOverlay');
const editBtn = document.getElementById('editProfileBtn');
const editCloseBtn = document.getElementById('editCloseBtn');
const editCancelBtn = document.getElementById('editCancelBtn');
const editSaveBtn = document.getElementById('editSaveBtn');
const editForm = document.getElementById('editForm');

if(editBtn){
  editBtn.addEventListener('click', ()=>{
    if(editOverlay){
      editOverlay.classList.add('open');
      editOverlay.setAttribute('aria-hidden','false');
      // populate fields with current values (simple example)
      document.getElementById('editName').value = document.querySelector('.profile-card .name')?.textContent || '';
      document.getElementById('editEmail').value = document.querySelector('.profile-card .meta')?.textContent || '';
    }
  });
}
if(editCloseBtn) editCloseBtn.addEventListener('click', ()=>{ editOverlay.classList.remove('open'); editOverlay.setAttribute('aria-hidden','true'); });
if(editCancelBtn) editCancelBtn.addEventListener('click', ()=>{ editOverlay.classList.remove('open'); editOverlay.setAttribute('aria-hidden','true'); });
if(editSaveBtn){
  editSaveBtn.addEventListener('click', ()=>{
    // simple save to DOM (no backend)
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const addr = document.getElementById('editAddress').value;
    if(name) document.querySelector('.profile-card .name').textContent = name;
    if(email) document.querySelector('.profile-card .meta') .textContent = email;
    if(phone){
      const p = document.querySelectorAll('.profile-card .meta')[1];
      if(p) p.innerHTML = '<strong>Telefone</strong><br/>' + phone;
    }
    if(addr){
      const p = document.querySelectorAll('.profile-card .meta')[2];
      if(p) p.innerHTML = '<strong>Endereço</strong><br/>' + addr;
    }
    editOverlay.classList.remove('open');
    editOverlay.setAttribute('aria-hidden','true');
  });
}

// close edit modal clicking outside
if(editOverlay){
  editOverlay.addEventListener('click', (e)=>{ if(e.target === editOverlay) editOverlay.classList.remove('open'); });
}

// Make login/cadastrar buttons work on any page: match ids, class or data attribute
const openModalSelectors = '[id^="openModalBtn"], .open-modal, [data-open-modal]';
const openModalEls = document.querySelectorAll(openModalSelectors);
openModalEls.forEach(el => el.addEventListener('click', (e) => {
  e.preventDefault();
  if(overlay){
    overlay.classList.add('open');
    setActive('login');
    overlay.setAttribute('aria-hidden','false');
  }
}));

// Create a simple user-icon dropdown menu for any .user-icon element
function createUserMenu(){
  document.querySelectorAll('.user-icon').forEach(icon => {
    // avoid attaching twice
    if(icon.dataset.menuAttached) return;
    icon.dataset.menuAttached = '1';
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', (e)=>{
      e.stopPropagation();
      // remove any existing menu
      const existing = document.querySelector('.user-menu');
      if(existing) existing.remove();
      // build menu
      const menu = document.createElement('div');
      menu.className = 'user-menu';
      menu.innerHTML = `
        <a href="#" class="user-menu-item" data-action="profile">Perfil</a>
        <a href="#" class="user-menu-item" data-action="login">Login/Cadastrar</a>
        <a href="#" class="user-menu-item" data-action="logout">Sair</a>
      `;
      document.body.appendChild(menu);
      // position menu under icon
      const r = icon.getBoundingClientRect();
      menu.style.left = Math.max(8, r.right - 160) + 'px';
      menu.style.top = (r.bottom + 8) + 'px';

      // item handlers
      menu.querySelectorAll('.user-menu-item').forEach(item => {
        item.addEventListener('click', (ev)=>{
          ev.preventDefault();
          const action = item.dataset.action;
          if(action === 'profile'){
            // navigate to profile page (default to profile.html)
            window.location.href = 'profile.html';
          } else if(action === 'login'){
            if(overlay){ overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); setActive('login'); }
          } else if(action === 'logout'){
            // placeholder: just remove menu; implement logout later
            alert('Logout (implemente integração)');
          }
          menu.remove();
        });
      });

      // close when clicking outside
      setTimeout(()=>{
        document.addEventListener('click', function onDocClick(){
          const m = document.querySelector('.user-menu');
          if(m) m.remove();
          document.removeEventListener('click', onDocClick);
        });
      }, 0);
    });
  });
}

// initialize menu on load
createUserMenu();

// also observe DOM for added .user-icon elements (optional)
const obs = new MutationObserver(()=> createUserMenu());
obs.observe(document.body, {childList:true, subtree:true});

// expose to inline handlers (seu HTML usa onfocus="setActive(...)")
window.setActive = setActive;
