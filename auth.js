import { auth, db, ADMIN_UID } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
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
  'auth/network-request-failed': 'Sem conexão. Verifique sua internet.'
};

function showNotice(message, isError) {
  const notice = document.getElementById('authNotice');
  notice.textContent = message;
  notice.classList.toggle('error', isError);
  notice.style.display = 'block';
}

function showError(error) {
  showNotice(errorMessages[error.code] || 'Algo deu errado. Tente novamente.', true);
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
    const { user } = await createUserWithEmailAndPassword(auth, data.get('email'), data.get('senha'));
    await updateProfile(user, { displayName: data.get('nome').trim() });
    await sendEmailVerification(user, verifySettings).catch(() => {});
    await saveProfile(user).catch(() => {});
  });
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    handleSubmit(loginForm, data => signInWithEmailAndPassword(auth, data.get('email'), data.get('senha')));
  });
  document.getElementById('resetBtn').addEventListener('click', async () => {
    try {
      await sendPasswordResetEmail(auth, loginForm.email.value);
      showNotice('Enviamos um link para redefinir sua senha. Confira seu e-mail (e o spam).', false);
    } catch (error) {
      showError(error);
    }
  });
}

// Área de membros: só mostra o conteúdo para quem está logado e confirmou o e-mail
const memberArea = document.getElementById('memberArea');
if (memberArea) {
  const verifyBox = document.getElementById('verifyBox');
  const memberContent = document.getElementById('memberContent');

  function showMember(user) {
    document.getElementById('memberName').textContent = user.displayName || user.email;
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
