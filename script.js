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
// Animação ao rolar: cada bloco aparece quando entra na tela (desligada para quem prefere menos movimento)
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }), { threshold: 0.15 });
  document.querySelectorAll('section:not(.hero, .auth-page) :is(.section-kicker, h2, .section-intro, .project, .skill-box, .about-copy, .contact-box)').forEach(element => {
    const siblings = [...element.parentElement.children].filter(item => item.classList.contains(element.classList[0]));
    element.style.transitionDelay = `${Math.min(Math.max(siblings.indexOf(element), 0), 3) * 0.1}s`;
    element.classList.add('reveal');
    observer.observe(element);
  });
}
// Botão de olho: mostra ou esconde a senha
document.querySelectorAll('.toggle-password').forEach(button => button.addEventListener('click', () => {
  const input = button.parentElement.querySelector('input');
  const isVisible = input.type === 'text';
  input.type = isVisible ? 'password' : 'text';
  button.setAttribute('aria-pressed', String(!isVisible));
  button.setAttribute('aria-label', isVisible ? 'Mostrar senha' : 'Esconder senha');
  button.querySelector('.icon-eye').hidden = !isVisible;
  button.querySelector('.icon-eye-off').hidden = isVisible;
}));
