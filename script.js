const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();
const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  const notice = document.getElementById('formNotice');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  try {
    const response = await fetch(contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm)
    });
    if (!response.ok) throw new Error();
    contactForm.reset();
    notice.textContent = 'Mensagem enviada! Responderei assim que possível.';
    notice.classList.remove('error');
  } catch {
    notice.textContent = 'Não foi possível enviar agora. Tente novamente ou escreva para otaviosvlom@gmail.com.';
    notice.classList.add('error');
  }
  notice.style.display = 'block';
  submitBtn.disabled = false;
  submitBtn.textContent = 'Enviar mensagem ↗';
});
