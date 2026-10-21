import { auth, db, ADMIN_UID } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Para onde o link de confirmação de e-mail leva depois de confirmar
const verifySettings = { url: new URL('area.html', window.location.href).href };

// Salva (ou atualiza) os dados do usuário na coleção "usuarios", usada pelo painel de admin
function saveProfile(user) {
  return setDoc(doc(db, 'usuarios', user.uid), {
    nome: user.displayName || '',
    email: user.email,
    criadoEm: user.metadata.creationTime,
    emailConfirmado: user.emailVerified
  }, { merge: true });
}

// Menu: troca "Entrar" por "Minha área" quando a pessoa já está logada
const authLink = document.getElementById('authLink');
if (authLink) onAuthStateChanged(auth, user => {
  authLink.textContent = user ? 'Minha área' : 'Entrar';
  authLink.href = user ? 'area.html' : 'login.html';
});

const errorMessages = {
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

function showNotice(message, isError, noticeId = 'authNotice') {
  const notice = document.getElementById(noticeId);
  notice.textContent = message;
  notice.classList.toggle('error', isError);
  notice.style.display = 'block';
}

function showError(error, noticeId) {
  showNotice(errorMessages[error.code] || 'Algo deu errado. Tente novamente.', true, noticeId);
}

async function handleSubmit(form, action) {
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

const signupForm = document.getElementById('signupForm');
if (signupForm) signupForm.addEventListener('submit', event => {
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

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    handleSubmit(loginForm, data => signInWithEmailAndPassword(auth, data.get('email').trim(), data.get('senha')));
  });
  // Leva o e-mail já digitado para a página de recuperação
  document.getElementById('resetLink').addEventListener('click', event => {
    const email = loginForm.email.value.trim();
    if (email) event.currentTarget.href = `recuperar.html?email=${encodeURIComponent(email)}`;
  });
}

// Recuperar senha: envia o link de redefinição para o e-mail
const recoverForm = document.getElementById('recoverForm');
if (recoverForm) {
  recoverForm.email.value = new URLSearchParams(window.location.search).get('email') || '';
  recoverForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submitBtn = recoverForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      await sendPasswordResetEmail(auth, recoverForm.email.value.trim());
      showNotice('Pronto! Se este e-mail estiver cadastrado, você vai receber um link para criar uma nova senha. Confira também o spam.', false);
    } catch (error) {
      showError(error);
    }
    submitBtn.disabled = false;
  });
}

// Página de ação: abre os links enviados por e-mail (nova senha e confirmação de e-mail)
const actionArea = document.getElementById('actionArea');
if (actionArea) {
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
    finish('Link inválido', errorMessages[error.code] || 'Não foi possível abrir este link. Peça um novo.', 'Pedir novo link', 'recuperar.html');
  }

  const mode = params.get('mode');
  if (mode === 'resetPassword') {
    const resetForm = document.getElementById('resetForm');
    verifyPasswordResetCode(auth, code).then(email => {
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
    }).catch(fail);
  } else if (mode === 'verifyEmail') {
    applyActionCode(auth, code).then(async () => {
      if (auth.currentUser) await auth.currentUser.reload();
      finish('E-mail confirmado!', 'Tudo certo. Sua área de membros já está liberada.', 'Ir para minha área', 'area.html');
    }).catch(fail);
  } else if (mode === 'recoverEmail') {
    applyActionCode(auth, code).then(() => {
      finish('E-mail restaurado', 'O e-mail da sua conta voltou a ser o anterior. Por segurança, crie uma nova senha.', 'Criar nova senha', 'recuperar.html');
    }).catch(fail);
  } else {
    finish('Link inválido', 'Este endereço não contém nenhuma ação.', 'Página inicial', 'index.html');
  }
}

// Área de membros: só mostra o conteúdo para quem está logado e confirmou o e-mail
const memberArea = document.getElementById('memberArea');
if (memberArea) {
  const verifyBox = document.getElementById('verifyBox');
  const memberContent = document.getElementById('memberContent');

  function showMember(user) {
    document.getElementById('memberName').textContent = user.displayName || user.email;
    document.getElementById('nameForm').nome.value = user.displayName || '';
    document.querySelectorAll('.member-email').forEach(item => { item.textContent = user.email; });
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
}

function formatDate(value) {
  return value ? value.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
}

// Painel de admin: os dados só são liberados pelas regras do Firestore para o ADMIN_UID
const adminArea = document.getElementById('adminArea');
if (adminArea) {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.replace('login.html');
      return;
    }
    if (user.uid !== ADMIN_UID) {
      window.location.replace('area.html');
      return;
    }
    adminArea.hidden = false;
    loadUsers();
    loadMessages();
  });
}

async function loadUsers() {
  const tableBody = document.getElementById('usersTable');
  try {
    const snapshot = await getDocs(collection(db, 'usuarios'));
    const users = snapshot.docs.map(item => item.data())
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    document.getElementById('usersCount').textContent = users.length;
    tableBody.replaceChildren(...users.map(item => {
      const row = document.createElement('tr');
      const confirmed = item.emailConfirmado ? 'Sim' : 'Não';
      [item.nome || '—', item.email, new Date(item.criadoEm).toLocaleDateString('pt-BR'), confirmed].forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      });
      return row;
    }));
  } catch (error) {
    showNotice(`Não foi possível carregar os usuários. Confira as regras do Firestore. (${error.code || error.message})`, true);
  }
}

async function loadMessages() {
  const list = document.getElementById('messagesList');
  const count = document.getElementById('messagesCount');
  try {
    const snapshot = await getDocs(query(collection(db, 'mensagens'), orderBy('enviadaEm', 'desc')));
    count.textContent = snapshot.size;
    if (snapshot.empty) {
      list.textContent = 'Nenhuma mensagem ainda.';
      return;
    }
    list.replaceChildren(...snapshot.docs.map(item => {
      const data = item.data();
      const card = document.createElement('article');
      card.className = 'message-card';

      const head = document.createElement('div');
      head.className = 'message-head';
      const from = document.createElement('strong');
      from.textContent = data.nome;
      const email = document.createElement('a');
      email.href = `mailto:${data.email}`;
      email.textContent = data.email;
      const date = document.createElement('span');
      date.textContent = formatDate(data.enviadaEm?.toDate());
      head.append(from, email, date);

      const text = document.createElement('p');
      text.textContent = data.mensagem;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'link-btn';
      removeBtn.textContent = 'Excluir mensagem';
      removeBtn.addEventListener('click', async () => {
        if (removeBtn.dataset.confirm !== 'sim') {
          removeBtn.dataset.confirm = 'sim';
          removeBtn.textContent = 'Clique de novo para confirmar';
          return;
        }
        try {
          await deleteDoc(item.ref);
          card.remove();
          count.textContent = Number(count.textContent) - 1;
        } catch (error) {
          showNotice(`Não foi possível excluir. (${error.code || error.message})`, true);
        }
      });

      card.append(head, text, removeBtn);
      return card;
    }));
  } catch (error) {
    list.textContent = '';
    showNotice(`Não foi possível carregar as mensagens. Confira as regras do Firestore. (${error.code || error.message})`, true);
  }
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});
