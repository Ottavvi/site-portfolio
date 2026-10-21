// Configuração do Firebase: copie estes valores do Console do Firebase
// (Configurações do projeto > Seus apps > App da Web > Configuração do SDK).
// Esses dados podem ficar públicos: a segurança fica por conta do Firebase.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBMKxkhuOCtb81uiS7WmcuiywBEAaD_Omc',
  authDomain: 'site-otavio.firebaseapp.com',
  projectId: 'site-otavio',
  storageBucket: 'site-otavio.firebasestorage.app',
  messagingSenderId: '435813961538',
  appId: '1:435813961538:web:753f306561ecab560ac2db'
};

export const auth = getAuth(initializeApp(firebaseConfig));
auth.languageCode = 'pt';
