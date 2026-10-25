// Funções usadas por várias páginas de conta (cadastro, login, área de membros...)
import { db } from '../firebase.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Para onde o link de confirmação de e-mail leva depois de confirmar
export const verifySettings = { url: new URL('area.html', window.location.href).href };

export const errorMessages = {
  'auth/email-already-in-use': 'Este e-mail já está cadastrado. Tente entrar.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/missing-email': 'Digite seu e-mail.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
  'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
  'auth/expired-action-code': 'Este link expirou. Peça um novo.',
  'auth/invalid-action-code': 'Este link é inválido ou já foi usado. Peça um novo.',
  'auth/requires-recent-login': 'Por segurança, saia e entre de novo antes de fazer isso.',
  'senha-atual': 'A senha atual está incorreta.'
};

// Salva (ou atualiza) os dados do usuário na coleção "usuarios", usada pelo painel de admin
export function saveProfile(user) {
  return setDoc(
    doc(db, 'usuarios', user.uid),
    {
      nome: user.displayName || '',
      email: user.email,
      criadoEm: user.metadata.creationTime,
      emailConfirmado: user.emailVerified
    },
    { merge: true }
  );
}

export function showNotice(message, isError, noticeId = 'authNotice') {
  const notice = document.getElementById(noticeId);
  notice.textContent = message;
  notice.classList.toggle('error', isError);
  notice.style.display = 'block';
}

export function showError(error, noticeId) {
  showNotice(errorMessages[error.code] || 'Algo deu errado. Tente novamente.', true, noticeId);
}

// Envia um formulário de entrada/cadastro: trava o botão, executa a ação e leva para a área de membros
export async function handleSubmit(form, action) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const label = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Aguarde...';
  try {
    await action(new FormData(form));
    window.location.href = 'area.html';
  } catch (error) {
    showError(error);
    submitBtn.disabled = false;
    submitBtn.textContent = label;
  }
}
