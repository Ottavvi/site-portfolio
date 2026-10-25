// Página recuperar.html: envia o link de redefinição de senha para o e-mail
import { auth } from '../firebase.js';
import { sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { showError, showNotice } from './shared.js';

const recoverForm = document.getElementById('recoverForm');
recoverForm.email.value = new URLSearchParams(window.location.search).get('email') || '';

recoverForm.addEventListener('submit', async event => {
  event.preventDefault();
  const submitBtn = recoverForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  try {
    await sendPasswordResetEmail(auth, recoverForm.email.value.trim());
    showNotice(
      'Pronto! Se este e-mail estiver cadastrado, você vai receber um link para criar uma nova senha. Confira também o spam.',
      false
    );
  } catch (error) {
    showError(error);
  }
  submitBtn.disabled = false;
});
