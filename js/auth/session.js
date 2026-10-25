// Carregado em todas as páginas: ajusta o menu conforme a pessoa está logada ou não
import { auth } from '../firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// Troca "Entrar" por "Minha área" quando a pessoa já está logada
const authLink = document.getElementById('authLink');
if (authLink) {
  onAuthStateChanged(auth, user => {
    authLink.textContent = user ? 'Minha área' : 'Entrar';
    authLink.href = user ? 'area.html' : 'login.html';
  });
}

// Botão "Sair" (área de membros e painel de admin)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
  });
}
