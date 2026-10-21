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
