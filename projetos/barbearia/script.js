document.documentElement.classList.add('js');

// Número da barbearia no WhatsApp (só dígitos, com DDI e DDD). Vazio = o WhatsApp pede para escolher o contato.
const whatsappNumber = '';
const whatsappLink = text => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
document.getElementById('whatsappFloat').href = whatsappLink('Olá, Prime Barber! Gostaria de tirar uma dúvida.');

// Perfil da barbearia no Instagram (sem o @). Vazio = abre a página inicial do Instagram.
const instagramUser = '';
document.getElementById('instagramFloat').href = `https://www.instagram.com/${instagramUser}`;

// Menu no celular
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
function setMenu(open) {
  menu.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) {
    setMenu(false);
    menuToggle.focus();
  }
});

// Elementos aparecem suavemente ao entrar na tela
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }), { threshold: .15 });
  revealItems.forEach((item, i) => {
    item.style.transitionDelay = `${(i % 3) * 90}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Horário de funcionamento: [abre, fecha] em horas, por dia da semana (0 = domingo)
const openingHours = { 0: null, 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [8, 18] };

// Mostra se a barbearia está aberta agora e destaca o dia de hoje na tabela
const now = new Date();
const today = openingHours[now.getDay()];
const hour = now.getHours() + now.getMinutes() / 60;
const status = document.getElementById('openStatus');
const isOpen = today && hour >= today[0] && hour < today[1];
status.textContent = isOpen ? `Aberto agora · fecha às ${today[1]}h` : 'Fechado agora';
status.classList.add(isOpen ? 'open' : 'closed');
document.querySelectorAll('.hours tr').forEach(row => {
  if (row.dataset.days.split(',').includes(String(now.getDay()))) row.classList.add('today');
});

// Galeria com foto ampliada
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
let currentPhoto = 0;
function showPhoto(index) {
  currentPhoto = (index + galleryItems.length) % galleryItems.length;
  const img = galleryItems[currentPhoto].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = galleryItems[currentPhoto].querySelector('span').textContent;
}
galleryItems.forEach((item, i) => item.addEventListener('click', () => {
  showPhoto(i);
  lightbox.showModal();
}));
document.getElementById('lightboxPrev').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.getElementById('lightboxNext').addEventListener('click', () => showPhoto(currentPhoto + 1));
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
});
lightbox.addEventListener('close', () => galleryItems[currentPhoto].focus());

// Barbeiros e os dias da semana em que cada um atende
const barbers = {
  rafael: { name: 'Rafael', days: [1, 2, 3, 4, 5] },
  bruno: { name: 'Bruno', days: [2, 3, 4, 5, 6] },
  diego: { name: 'Diego', days: [1, 3, 4, 5, 6] }
};
const barberOptions = document.getElementById('barberOptions');
Object.entries(barbers).forEach(([id, barber]) => {
  barberOptions.insertAdjacentHTML('beforeend', `<label class="chip"><input type="radio" name="barbeiro" value="${id}"><span>${barber.name}</span></label>`);
});

// Agendamento: os serviços vêm dos cartões da página
const serviceSelect = document.getElementById('serviceSelect');
const serviceInfo = document.getElementById('serviceInfo');
const serviceDetails = {};
document.querySelectorAll('.service').forEach(card => {
  const name = card.querySelector('h3').textContent;
  const price = card.querySelector('.price').textContent;
  serviceDetails[name] = { price, duration: card.querySelector('.duration').textContent };
  serviceSelect.add(new Option(name, name));
  // Link "Agendar" em cada cartão já escolhe o serviço no formulário
  card.insertAdjacentHTML('beforeend', `<a class="service-book" href="#agendar">Agendar →</a>`);
  card.querySelector('.service-book').addEventListener('click', () => {
    serviceSelect.value = name;
    updateServiceInfo();
  });
});
// Mostra preço e duração do serviço escolhido logo abaixo do seletor
function updateServiceInfo() {
  const { price, duration } = serviceDetails[serviceSelect.value];
  serviceInfo.innerHTML = `<span>${price}</span><span>⏱ ${duration}</span>`;
}
serviceSelect.addEventListener('change', updateServiceInfo);
updateServiceInfo();

// Cabeçalho ganha sombra ao rolar e o menu destaca a seção que está na tela
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
if ('IntersectionObserver' in window) {
  const menuLinks = [...menu.querySelectorAll('a:not(.menu-cta)')];
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    menuLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

const bookingForm = document.getElementById('bookingForm');
const dateInput = document.getElementById('dateInput');
const slots = document.getElementById('slots');
const toInputDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const timeLabel = time => `${Math.floor(time)}h${time % 1 ? '30' : '00'}`;
const selectedBarber = () => bookingForm.elements.barbeiro.value;

// Só permite datas a partir de hoje e já começa no próximo dia aberto
dateInput.min = toInputDate(now);
const firstDay = new Date(now);
while (!openingHours[firstDay.getDay()] || (toInputDate(firstDay) === toInputDate(now) && hour >= today[1] - .5)) firstDay.setDate(firstDay.getDate() + 1);
dateInput.value = toInputDate(firstDay);

// Simula horários já ocupados. O "sorteio" depende do dia, do barbeiro e da hora,
// então o mesmo horário aparece sempre igual. Agendamentos feitos na página também ocupam o horário.
const booked = new Set();
function isBusy(date, barberId, time) {
  if (booked.has(`${date}|${barberId}|${time}`)) return true;
  let hash = 0;
  for (const char of `${date}|${barberId}|${time}`) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 100 < 55;
}
// Barbeiros que atendem no dia e estão livres no horário
function freeBarbers(date, time) {
  const weekday = new Date(`${date}T00:00`).getDay();
  const chosen = selectedBarber();
  return Object.keys(barbers).filter(id =>
    (!chosen || id === chosen) && barbers[id].days.includes(weekday) && !isBusy(date, id, time));
}

// Monta os botões de horário (de 30 em 30 minutos) conforme o dia e o barbeiro
function updateSlots() {
  slots.replaceChildren();
  const empty = text => slots.insertAdjacentHTML('beforeend', `<p class="slots-empty">${text}</p>`);
  if (!dateInput.value) return empty('Escolha o dia primeiro.');
  const weekday = new Date(`${dateInput.value}T00:00`).getDay();
  const hours = openingHours[weekday];
  if (!hours) return empty('Fechado neste dia. Que tal outro?');
  const chosen = selectedBarber();
  if (chosen && !barbers[chosen].days.includes(weekday)) return empty(`${barbers[chosen].name} não atende neste dia da semana.`);

  const isToday = dateInput.value === toInputDate(new Date());
  const nowHour = new Date().getHours() + new Date().getMinutes() / 60;
  for (let time = hours[0]; time < hours[1]; time += 0.5) {
    if (isToday && time <= nowHour) continue;
    const busy = freeBarbers(dateInput.value, time).length === 0;
    slots.insertAdjacentHTML('beforeend', `<label class="slot"><input type="radio" name="hora" value="${time}" ${busy ? 'disabled' : ''}><span>${timeLabel(time)}</span></label>`);
  }
  if (!slots.children.length) empty('Não há mais horários hoje.');
}
dateInput.addEventListener('change', updateSlots);
barberOptions.addEventListener('change', updateSlots);
updateSlots();

// Botões "Agendar com..." da seção Equipe já escolhem o barbeiro (e um dia em que ele atende)
document.querySelectorAll('[data-pick-barber]').forEach(link => link.addEventListener('click', () => {
  const id = link.dataset.pickBarber;
  bookingForm.querySelector(`input[name="barbeiro"][value="${id}"]`).checked = true;
  const day = new Date(`${dateInput.value || dateInput.min}T00:00`);
  while (!barbers[id].days.includes(day.getDay())) day.setDate(day.getDate() + 1);
  dateInput.value = toInputDate(day);
  updateSlots();
}));

// Como é um projeto de portfólio, o agendamento só mostra um resumo (não envia para lugar nenhum)
const formError = document.getElementById('formError');
const result = document.getElementById('bookingResult');
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const name = data.get('nome').trim();
  const missing = !name ? 'Digite seu nome.' : !data.get('dia') ? 'Escolha o dia.' : !data.get('hora') ? 'Escolha um horário livre.' : '';
  formError.textContent = missing;
  formError.classList.toggle('visible', Boolean(missing));
  if (missing) return;

  const date = data.get('dia');
  const time = Number(data.get('hora'));
  const barberId = freeBarbers(date, time)[0];
  booked.add(`${date}|${barberId}|${time}`);

  const day = new Date(`${date}T00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const summary = `${data.get('servico')} com ${barbers[barberId].name}, ${day}, às ${timeLabel(time)}`;
  result.innerHTML = `<p><strong>Prontinho, ${name.replace(/[<>&]/g, '')}!</strong> ${summary}.</p>
    <p>(Demonstração: nenhum agendamento real foi feito.)</p>
    <a class="button button-small" href="${whatsappLink(`Olá! Sou ${name} e gostaria de confirmar: ${summary}.`)}" target="_blank" rel="noreferrer"><svg aria-hidden="true"><use href="#i-whatsapp"/></svg>Confirmar pelo WhatsApp</a>`;
  result.classList.add('visible');
  bookingForm.elements.nome.value = '';
  updateSlots();
});
