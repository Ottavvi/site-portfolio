import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Formulário de contato: envia para o e-mail (FormSubmit) e salva no painel de admin (Firestore)
const contactForm = document.getElementById('contactForm');

// Textos no idioma da página (o portfólio tem versão em inglês na pasta en/)
const TEXTOS = document.documentElement.lang.startsWith('en')
  ? {
      enviando: 'Sending...',
      enviada: "Message sent! I'll get back to you as soon as possible.",
      erro: "Couldn't send it right now. Please try again or write to otaviosvlom@gmail.com.",
      botao: 'Send message ↗'
    }
  : {
      enviando: 'Enviando...',
      enviada: 'Mensagem enviada! Responderei assim que possível.',
      erro: 'Não foi possível enviar agora. Tente novamente ou escreva para otaviosvlom@gmail.com.',
      botao: 'Enviar mensagem ↗'
    };
if (contactForm)
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const notice = document.getElementById('formNotice');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const data = new FormData(contactForm);
    // Campo invisível preenchido = robô de spam: ignora sem salvar nada
    if (data.get('_honey')) return;
    submitBtn.disabled = true;
    submitBtn.textContent = TEXTOS.enviando;

    const sendEmail = fetch(contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data
    }).then(response => {
      if (!response.ok) throw new Error();
    });
    const saveMessage = addDoc(collection(db, 'mensagens'), {
      nome: data.get('nome').trim(),
      email: data.get('email').trim(),
      mensagem: data.get('mensagem').trim(),
      enviadaEm: serverTimestamp()
    });

    // Basta um dos dois dar certo para a mensagem chegar até você
    const results = await Promise.allSettled([sendEmail, saveMessage]);
    if (results.some(result => result.status === 'fulfilled')) {
      contactForm.reset();
      notice.textContent = TEXTOS.enviada;
      notice.classList.remove('error');
    } else {
      notice.textContent = TEXTOS.erro;
      notice.classList.add('error');
    }
    notice.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = TEXTOS.botao;
  });
