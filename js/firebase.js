// Configuração do Firebase: copie estes valores do Console do Firebase
// (Configurações do projeto > Seus apps > App da Web > Configuração do SDK).
// Esses dados podem ficar públicos: a segurança fica por conta do Firebase.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// UID da conta de administrador (Authentication > Usuários > coluna "UID do usuário").
// O mesmo UID precisa estar nas regras do Firestore, que é o que protege os dados de verdade.
export const ADMIN_UID = 'Z3NkKJ7tPATCvGtk1WEYCMwLcgU2';

const firebaseConfig = {
  apiKey: 'AIzaSyBMKxkhuOCtb81uiS7WmcuiywBEAaD_Omc',
  authDomain: 'site-otavio.firebaseapp.com',
  projectId: 'site-otavio',
  storageBucket: 'site-otavio.firebasestorage.app',
  messagingSenderId: '435813961538',
  appId: '1:435813961538:web:753f306561ecab560ac2db'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
auth.languageCode = 'pt';
