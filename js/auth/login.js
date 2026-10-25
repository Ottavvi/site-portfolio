// Página login.html: entra com e-mail e senha
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { handleSubmit } from './shared.js';

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', event => {
  event.preventDefault();
  handleSubmit(loginForm, data => signInWithEmailAndPassword(auth, data.get('email').trim(), data.get('senha')));
});

// Leva o e-mail já digitado para a página de recuperação
document.getElementById('resetLink').addEventListener('click', event => {
  const email = loginForm.email.value.trim();
  if (email) event.currentTarget.href = `recuperar.html?email=${encodeURIComponent(email)}`;
});
