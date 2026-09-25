const authModal = document.getElementById('auth-modal');
const loginButton = document.getElementById('btn-login');
const logoutButton = document.getElementById('btn-logout');
const userGreeting = document.getElementById('user-greeting');
const modalClose = document.getElementById('modal-close');
const backdrop = document.getElementById('modal-backdrop');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTitle = document.getElementById('auth-title');
const authMessage = document.getElementById('auth-message');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('site-search');
const galleryGrid = document.getElementById('gallery-grid');
const searchEmpty = document.getElementById('search-empty');
const adoptButtons = document.querySelectorAll('.adopt-button');
const infoButtons = document.querySelectorAll('.info-button');
const rescueForm = document.getElementById('rescue-form');
const rescueMessage = document.getElementById('rescue-message');
let currentUser = null;

function getStoredUser() {
  return currentUser;
}

function setStoredUser(name) {
  currentUser = { name };
  updateAuthUI();
}

function clearStoredUser() {
  currentUser = null;
  updateAuthUI();
}

function updateAuthUI() {
  const user = getStoredUser();
  const hasUser = Boolean(user && user.name);

  if (userGreeting) {
    userGreeting.textContent = hasUser ? `Hola, ${user.name}` : '';
    userGreeting.classList.toggle('d-none', !hasUser);
  }

  if (loginButton) {
    loginButton.classList.toggle('d-none', hasUser);
  }

  if (logoutButton) {
    logoutButton.classList.toggle('d-none', !hasUser);
  }
}

function showMessage(type, text) {
  if (!authMessage) return;
  authMessage.textContent = text;
  authMessage.classList.remove('d-none', 'alert-success', 'alert-warning');
  authMessage.classList.add(type === 'success' ? 'alert-success' : 'alert-warning');
}

function openAuthModal(mode = 'login') {
  if (!authModal) return;

  authModal.classList.add('active');
  authModal.setAttribute('aria-hidden', 'false');

  if (mode === 'register') {
    if (loginForm) loginForm.classList.add('d-none');
    if (registerForm) registerForm.classList.remove('d-none');
    if (authTitle) authTitle.textContent = 'Registro';
  } else {
    if (loginForm) loginForm.classList.remove('d-none');
    if (registerForm) registerForm.classList.add('d-none');
    if (authTitle) authTitle.textContent = 'Inicio de sesión';
  }

  if (authMessage) {
    authMessage.classList.add('d-none');
    authMessage.textContent = '';
  }
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.remove('active');
  authModal.setAttribute('aria-hidden', 'true');
}

if (loginButton) {
  loginButton.addEventListener('click', () => openAuthModal('login'));
}

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    clearStoredUser();
    closeAuthModal();
  });
}

if (modalClose) {
  modalClose.addEventListener('click', closeAuthModal);
}

if (backdrop) {
  backdrop.addEventListener('click', closeAuthModal);
}

if (showRegisterLink) {
  showRegisterLink.addEventListener('click', (event) => {
    event.preventDefault();
    openAuthModal('register');
  });
}

if (showLoginLink) {
  showLoginLink.addEventListener('click', (event) => {
    event.preventDefault();
    openAuthModal('login');
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && authModal && authModal.classList.contains('active')) {
    closeAuthModal();
  }
});

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = loginForm.querySelector('#login-email');
    const passwordInput = loginForm.querySelector('#login-password');
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!email || !password) {
      showMessage('warning', 'Completa tu correo y contraseña para iniciar sesión.');
      return;
    }

    const user = getStoredUser();
    const userName = user && user.name ? user.name : email.split('@')[0];
    setStoredUser(userName);
    showMessage('success', `Bienvenido, ${userName}. Has iniciado sesión correctamente.`);

    setTimeout(() => {
      closeAuthModal();
    }, 900);
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = registerForm.querySelector('#register-name');
    const emailInput = registerForm.querySelector('#register-email');
    const passwordInput = registerForm.querySelector('#register-password');
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!name || !email || !password) {
      showMessage('warning', 'Completa todos los campos para crear tu cuenta.');
      return;
    }

    setStoredUser(name);
    showMessage('success', `¡Cuenta creada correctamente, ${name}!`);

    setTimeout(() => {
      closeAuthModal();
    }, 900);
  });
}

function filterGallery() {
  if (!searchInput || !galleryGrid) return;

  const query = searchInput.value.trim().toLocaleLowerCase();
  const cards = galleryGrid.querySelectorAll(':scope > .col');
  let visibleCards = 0;

  cards.forEach((card) => {
    const matches = !query || card.textContent.toLocaleLowerCase().includes(query);
    card.classList.toggle('d-none', !matches);
    if (matches) visibleCards += 1;
  });

  if (searchEmpty) {
    searchEmpty.classList.toggle('d-none', visibleCards > 0);
  }
}

if (searchInput) {
  searchInput.addEventListener('input', filterGallery);
}

if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    filterGallery();
  });
}

adoptButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const pet = button.dataset.pet || 'el gato que elegiste';
    window.location.href = `formulario-pqr.html?mascota=${encodeURIComponent(pet)}`;
  });
});

infoButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.album-card');
    const details = card ? card.querySelector('.pet-details') : null;
    if (!card || !details) return;

    const isExpanded = card.classList.toggle('is-expanded');
    button.setAttribute('aria-expanded', String(isExpanded));
    button.textContent = isExpanded ? 'Ocultar información' : 'Ver información';
    details.setAttribute('aria-hidden', String(!isExpanded));
  });
});

document.querySelectorAll('.album-card').forEach((card) => {
  const infoButton = card.querySelector('.info-button');
  const cardBody = card.querySelector('.card-body');
  const details = document.createElement('div');
  details.className = 'pet-details';

  if (infoButton) {
    infoButton.textContent = 'Ver información';
    infoButton.setAttribute('aria-expanded', 'false');
    infoButton.setAttribute('aria-label', 'Ver información del gato');
    details.id = `pet-details-${Math.random().toString(36).slice(2, 9)}`;
    details.setAttribute('aria-hidden', 'true');
    infoButton.setAttribute('aria-controls', details.id);
  }

  [
    ['Edad', infoButton ? infoButton.dataset.age : 'No disponible'],
    ['Vacunas', infoButton ? infoButton.dataset.vaccines : 'No disponible'],
    ['Rescate', infoButton ? infoButton.dataset.rescue : 'No disponible']
  ].forEach(([label, value]) => {
    const paragraph = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    paragraph.append(strong, value);
    details.append(paragraph);
  });

  if (cardBody) {
    cardBody.append(details);
  }
});

if (rescueForm) {
  rescueForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!rescueForm.checkValidity()) {
      rescueForm.reportValidity();
      return;
    }

    rescueMessage.textContent = '¡Reporte recibido! Nos pondremos en contacto para coordinar la ayuda.';
    rescueMessage.classList.remove('d-none');
    rescueForm.reset();
  });
}

updateAuthUI();
