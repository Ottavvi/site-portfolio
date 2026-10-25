// Página acao.html: abre os links enviados por e-mail (nova senha e confirmação de e-mail)
import { auth } from '../firebase.js';
import {
  applyActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { errorMessages, showError, showNotice } from './shared.js';

const params = new URLSearchParams(window.location.search);
const code = params.get('oobCode');
const title = document.getElementById('actionTitle');
const text = document.getElementById('actionText');
const nextLink = document.getElementById('actionNext');

function finish(heading, message, linkText, linkHref) {
  title.textContent = heading;
  text.textContent = message;
  nextLink.textContent = linkText;
  nextLink.href = linkHref;
  nextLink.hidden = false;
}

function fail(error) {
  finish(
    'Link inválido',
    errorMessages[error.code] || 'Não foi possível abrir este link. Peça um novo.',
    'Pedir novo link',
    'recuperar.html'
  );
}

// Criar nova senha: confere o link e mostra o formulário
function resetPassword() {
  const resetForm = document.getElementById('resetForm');
  verifyPasswordResetCode(auth, code)
    .then(email => {
      title.textContent = 'Criar nova senha';
      text.textContent = `Escolha uma nova senha para ${email}.`;
      resetForm.hidden = false;
      resetForm.addEventListener('submit', async event => {
        event.preventDefault();
        const data = new FormData(resetForm);
        if (data.get('senha') !== data.get('confirmar')) {
          showNotice('As senhas não são iguais.', true);
          return;
        }
        try {
          await confirmPasswordReset(auth, code, data.get('senha'));
          resetForm.hidden = true;
          finish('Senha alterada!', 'Sua nova senha já está valendo. Agora é só entrar.', 'Entrar', 'login.html');
        } catch (error) {
          showError(error);
        }
      });
    })
    .catch(fail);
}

function verifyEmail() {
  applyActionCode(auth, code)
    .then(async () => {
      if (auth.currentUser) await auth.currentUser.reload();
      finish(
        'E-mail confirmado!',
        'Tudo certo. Sua área de membros já está liberada.',
        'Ir para minha área',
        'area.html'
      );
    })
    .catch(fail);
}

function recoverEmail() {
  applyActionCode(auth, code)
    .then(() => {
      finish(
        'E-mail restaurado',
        'O e-mail da sua conta voltou a ser o anterior. Por segurança, crie uma nova senha.',
        'Criar nova senha',
        'recuperar.html'
      );
    })
    .catch(fail);
}

const actions = { resetPassword, verifyEmail, recoverEmail };
const action = actions[params.get('mode')];
if (action) action();
else finish('Link inválido', 'Este endereço não contém nenhuma ação.', 'Página inicial', 'index.html');
