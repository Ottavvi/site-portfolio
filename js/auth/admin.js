// Página admin.html: os dados só são liberados pelas regras do Firestore para o ADMIN_UID
import { auth, db, ADMIN_UID } from '../firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { showNotice } from './shared.js';

const adminArea = document.getElementById('adminArea');

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

function formatDate(value) {
  return value ? value.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
}

// Tabela de usuários cadastrados, do mais novo para o mais antigo
async function loadUsers() {
  const tableBody = document.getElementById('usersTable');
  try {
    const snapshot = await getDocs(collection(db, 'usuarios'));
    const users = snapshot.docs.map(item => item.data()).sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    document.getElementById('usersCount').textContent = users.length;
    tableBody.replaceChildren(
      ...users.map(item => {
        const row = document.createElement('tr');
        const confirmed = item.emailConfirmado ? 'Sim' : 'Não';
        [item.nome || '—', item.email, new Date(item.criadoEm).toLocaleDateString('pt-BR'), confirmed].forEach(
          value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.append(cell);
          }
        );
        return row;
      })
    );
  } catch (error) {
    showNotice(
      `Não foi possível carregar os usuários. Confira as regras do Firestore. (${error.code || error.message})`,
      true
    );
  }
}

// Mensagens do formulário de contato, da mais recente para a mais antiga
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
    list.replaceChildren(...snapshot.docs.map(item => createMessageCard(item, count)));
  } catch (error) {
    list.textContent = '';
    showNotice(
      `Não foi possível carregar as mensagens. Confira as regras do Firestore. (${error.code || error.message})`,
      true
    );
  }
}

function createMessageCard(item, count) {
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

  // Excluir pede um segundo clique para confirmar
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
}
