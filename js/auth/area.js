// Página area.html: só mostra o conteúdo para quem está logado e confirmou o e-mail
import { auth, db, ADMIN_UID } from '../firebase.js';
import {
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  updatePassword,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { saveProfile, showError, showNotice, verifySettings } from './shared.js';

const memberArea = document.getElementById('memberArea');
const verifyBox = document.getElementById('verifyBox');
const memberContent = document.getElementById('memberContent');

function showMember(user) {
  document.getElementById('memberName').textContent = user.displayName || user.email;
  document.getElementById('nameForm').nome.value = user.displayName || '';
  document.querySelectorAll('.member-email').forEach(item => {
    item.textContent = user.email;
  });
  document.getElementById('adminLink').hidden = user.uid !== ADMIN_UID;
  verifyBox.hidden = user.emailVerified;
  memberContent.hidden = !user.emailVerified;
  memberArea.hidden = false;
  // Garante que contas criadas antes do painel de admin também apareçam na lista
  saveProfile(user).catch(() => {});
}

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.replace('login.html');
    return;
  }
  showMember(user);
});

// Confirmação de e-mail
document.getElementById('resendBtn').addEventListener('click', async () => {
  try {
    await sendEmailVerification(auth.currentUser, verifySettings);
    showNotice('Enviamos um novo link. Confira sua caixa de entrada e o spam.', false);
  } catch (error) {
    showError(error);
  }
});

document.getElementById('checkBtn').addEventListener('click', async () => {
  await auth.currentUser.reload();
  showMember(auth.currentUser);
  if (!auth.currentUser.emailVerified) {
    showNotice('Ainda não identificamos a confirmação. Clique no link do e-mail e tente de novo.', true);
  }
});

// Confirma a senha atual antes de ações sensíveis (trocar senha, excluir conta)
function confirmCurrentPassword(password) {
  const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
  return reauthenticateWithCredential(auth.currentUser, credential).catch(error => {
    throw error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password'
      ? { code: 'senha-atual' }
      : error;
  });
}

// Meu perfil: trocar nome
const nameForm = document.getElementById('nameForm');
nameForm.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await updateProfile(auth.currentUser, { displayName: nameForm.nome.value.trim() });
    await saveProfile(auth.currentUser);
    document.getElementById('memberName').textContent = auth.currentUser.displayName;
    showNotice('Nome atualizado!', false, 'nameNotice');
  } catch (error) {
    showError(error, 'nameNotice');
  }
});

// Meu perfil: trocar senha
const passwordForm = document.getElementById('passwordForm');
passwordForm.addEventListener('submit', async event => {
  event.preventDefault();
  const data = new FormData(passwordForm);
  if (data.get('nova') !== data.get('confirmar')) {
    showNotice('As senhas novas não são iguais.', true, 'passwordNotice');
    return;
  }
  try {
    await confirmCurrentPassword(data.get('atual'));
    await updatePassword(auth.currentUser, data.get('nova'));
    passwordForm.reset();
    showNotice('Senha alterada!', false, 'passwordNotice');
  } catch (error) {
    showError(error, 'passwordNotice');
  }
});

// Meu perfil: excluir conta (pede um segundo clique para confirmar)
const deleteForm = document.getElementById('deleteForm');
deleteForm.addEventListener('submit', async event => {
  event.preventDefault();
  const submitBtn = deleteForm.querySelector('button[type="submit"]');
  if (submitBtn.dataset.confirm !== 'sim') {
    submitBtn.dataset.confirm = 'sim';
    submitBtn.textContent = 'Tem certeza? Clique de novo para excluir';
    return;
  }
  submitBtn.disabled = true;
  try {
    const user = auth.currentUser;
    await confirmCurrentPassword(deleteForm.atual.value);
    await deleteDoc(doc(db, 'usuarios', user.uid)).catch(() => {});
    await deleteUser(user);
    window.location.href = 'index.html';
  } catch (error) {
    showError(error, 'deleteNotice');
    submitBtn.disabled = false;
  }
});
