import { auth, db, ADMIN_UID } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc,
  setDoc,
  collection,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Salva (ou atualiza) os dados do usuário na coleção "usuarios", usada pelo painel de admin
function saveProfile(user) {
  return setDoc(doc(db, 'usuarios', user.uid), {
    nome: user.displayName || '',
    email: user.email,
    criadoEm: user.metadata.creationTime
  }, { merge: true });
}

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

// Área de membros: só mostra o conteúdo para quem está logado
const memberArea = document.getElementById('memberArea');
if (memberArea) {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.replace('login.html');
      return;
    }
    document.getElementById('memberName').textContent = user.displayName || user.email;
    document.getElementById('memberEmail').textContent = user.email;
    document.getElementById('adminLink').hidden = user.uid !== ADMIN_UID;
    memberArea.hidden = false;
    // Garante que contas criadas antes do painel de admin também apareçam na lista
    saveProfile(user).catch(() => {});
  });
}

// Painel de admin: a lista só é liberada pelas regras do Firestore para o ADMIN_UID
const adminArea = document.getElementById('adminArea');
if (adminArea) {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location.replace('login.html');
      return;
    }
    if (user.uid !== ADMIN_UID) {
      window.location.replace('area.html');
      return;
    }
    adminArea.hidden = false;
    const tableBody = document.getElementById('usersTable');
    try {
      const snapshot = await getDocs(collection(db, 'usuarios'));
      const users = snapshot.docs.map(item => item.data())
        .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
      document.getElementById('usersCount').textContent = users.length;
      tableBody.replaceChildren(...users.map(item => {
        const row = document.createElement('tr');
        [item.nome || '—', item.email, new Date(item.criadoEm).toLocaleDateString('pt-BR')].forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        });
        return row;
      }));
    } catch (error) {
      showNotice('Não foi possível carregar os usuários. Confira as regras do Firestore.', true);
    }
  });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});
