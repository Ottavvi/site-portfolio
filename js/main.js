// Script comum a todas as páginas do portfólio (menu, ano do rodapé, animações e campo de senha)

// Menu no celular
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  })
);

// Botão de tema: alterna entre claro e escuro e guarda a escolha
const themeBtn = document.getElementById('themeBtn');
const isEnglish = document.documentElement.lang === 'en';
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const next = theme === 'light' ? 'dark' : 'light';
  const label = isEnglish ? `Switch to ${next} theme` : `Mudar para tema ${next === 'light' ? 'claro' : 'escuro'}`;
  themeBtn.setAttribute('aria-label', label);
  themeBtn.title = label;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--site-background').trim());
}
applyTheme(document.documentElement.dataset.theme || 'dark');
themeBtn.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(theme);
  try {
    localStorage.setItem('tema', theme);
  } catch {}
});

// Ano atual no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Cabeçalho: sombra depois de rolar e barra fina com o progresso da leitura
const header = document.querySelector('header');
const progress = document.createElement('div');
progress.className = 'scroll-progress';
header.append(progress);
let scrollQueued = false;
function updateScroll() {
  scrollQueued = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle('scrolled', scrollY > 8);
  progress.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
}
addEventListener(
  'scroll',
  () => {
    if (!scrollQueued) requestAnimationFrame(updateScroll);
    scrollQueued = true;
  },
  { passive: true }
);
updateScroll();

// Menu: destaca o link da seção que está na tela (só nos links para a própria página, como #projetos)
const spyLinks = [...navLinks.querySelectorAll('a[href^="#"]')];
const spySections = spyLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
if ('IntersectionObserver' in window && spySections.length) {
  const spy = new IntersectionObserver(
    entries =>
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        spyLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      }),
    { rootMargin: '-45% 0px -50% 0px' }
  );
  spySections.forEach(section => spy.observe(section));
}

// Botão de copiar o e-mail (seção de contato)
document.querySelectorAll('.copy-email').forEach(button => {
  const label = button.querySelector('.copy-email-label');
  const original = label.textContent;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.email);
      label.textContent = isEnglish ? 'Copied!' : 'Copiado!';
    } catch {
      location.href = `mailto:${button.dataset.email}`;
      return;
    }
    setTimeout(() => (label.textContent = original), 2000);
  });
});

// Animação ao rolar: cada bloco aparece quando entra na tela (desligada para quem prefere menos movimento)
const revealSelector =
  'section:not(.hero, .auth-page) :is(.section-kicker, h2, .section-intro, .project, .skill-box, .about-copy, .contact-box)';
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    entries =>
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
        // Depois de aparecer, tira o atraso para o hover responder na hora
        entry.target.addEventListener('transitionend', () => (entry.target.style.transitionDelay = ''), {
          once: true
        });
      }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(revealSelector).forEach(element => {
    // Elementos lado a lado entram em sequência (até 4 degraus de atraso)
    const siblings = [...element.parentElement.children].filter(item => item.classList.contains(element.classList[0]));
    element.style.transitionDelay = `${Math.min(Math.max(siblings.indexOf(element), 0), 3) * 0.1}s`;
    element.classList.add('reveal');
    observer.observe(element);
  });
}

// Brilho que acompanha o mouse nos cartões (o CSS lê --mx e --my)
document.querySelectorAll('.project, .skill-box').forEach(card =>
  card.addEventListener('pointermove', event => {
    const box = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - box.left}px`);
    card.style.setProperty('--my', `${event.clientY - box.top}px`);
  })
);

// Filtro de projetos por categoria (data-cat em cada projeto, data-filter em cada botão)
const filterButtons = document.querySelectorAll('.filter');
const projects = [...document.querySelectorAll('.project[data-cat]')];
// Nome próprio para cada cartão: na troca, eles deslizam até a nova posição em vez de piscar
projects.forEach((project, index) => (project.style.viewTransitionName = `projeto-${index}`));
filterButtons.forEach(button => {
  const { filter } = button.dataset;
  button.querySelector('.filter-count').textContent =
    filter === 'todos' ? projects.length : projects.filter(project => project.dataset.cat === filter).length;
  button.addEventListener('click', () => {
    const apply = () => {
      filterButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      projects.forEach(project => (project.hidden = filter !== 'todos' && project.dataset.cat !== filter));
      // O subtítulo "Projetos de prática" some quando nenhum deles passa no filtro
      const practiceTitle = document.querySelector('.projects-sub');
      if (practiceTitle) practiceTitle.hidden = !document.querySelector('.project--compact:not([hidden])');
    };
    // Troca animada nos navegadores com View Transitions
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(apply);
    } else apply();
  });
});

// Botão de olho: mostra ou esconde a senha
document.querySelectorAll('.toggle-password').forEach(button =>
  button.addEventListener('click', () => {
    const input = button.parentElement.querySelector('input');
    const isVisible = input.type === 'text';
    input.type = isVisible ? 'password' : 'text';
    button.setAttribute('aria-pressed', String(!isVisible));
    button.setAttribute('aria-label', isVisible ? 'Mostrar senha' : 'Esconder senha');
    button.querySelector('.icon-eye').hidden = !isVisible;
    button.querySelector('.icon-eye-off').hidden = isVisible;
  })
);
