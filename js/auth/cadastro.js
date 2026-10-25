// Página cadastro.html: cria a conta, salva o nome e envia o e-mail de confirmação
import { auth } from '../firebase.js';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { handleSubmit, saveProfile, showNotice, verifySettings } from './shared.js';

const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(signupForm);
  if (data.get('senha') !== data.get('confirmar')) {
    showNotice('As senhas não são iguais.', true);
    return;
  }
  handleSubmit(signupForm, async data => {
    const { user } = await createUserWithEmailAndPassword(auth, data.get('email').trim(), data.get('senha'));
    await updateProfile(user, { displayName: data.get('nome').trim() });
    await sendEmailVerification(user, verifySettings).catch(() => {});
    await saveProfile(user).catch(() => {});
  });
});
