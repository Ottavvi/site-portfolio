// Menu no celular
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

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

// Agendamento: os serviços vêm dos cartões da página
const serviceSelect = document.getElementById('serviceSelect');
document.querySelectorAll('.service').forEach(card => {
  const name = card.querySelector('h3').textContent;
  const price = card.querySelector('.price').textContent;
  serviceSelect.add(new Option(`${name} — ${price}`, name));
});

// Só permite datas a partir de hoje
const dateInput = document.getElementById('dateInput');
const timeSelect = document.getElementById('timeSelect');
const toInputDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
dateInput.min = toInputDate(now);

// Monta os horários disponíveis (de 30 em 30 minutos) conforme o dia escolhido
function updateTimes() {
  timeSelect.replaceChildren();
  if (!dateInput.value) {
    timeSelect.add(new Option('Escolha o dia primeiro', ''));
    return;
  }
  const chosen = new Date(`${dateInput.value}T00:00`);
  const hours = openingHours[chosen.getDay()];
  if (!hours) {
    timeSelect.add(new Option('Fechado neste dia', ''));
    return;
  }
  const isToday = dateInput.value === toInputDate(new Date());
  for (let time = hours[0]; time < hours[1]; time += 0.5) {
    if (isToday && time <= new Date().getHours() + new Date().getMinutes() / 60) continue;
    const label = `${Math.floor(time)}h${time % 1 ? '30' : '00'}`;
    timeSelect.add(new Option(label, label));
  }
  if (!timeSelect.options.length) timeSelect.add(new Option('Sem horários hoje', ''));
}
dateInput.addEventListener('change', updateTimes);
updateTimes();

// Como é um projeto de portfólio, o agendamento só mostra um resumo (não envia para lugar nenhum)
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const day = new Date(`${data.get('dia')}T00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const result = document.getElementById('bookingResult');
  result.textContent = `Prontinho, ${data.get('nome').trim()}! ${data.get('servico')} agendado para ${day}, às ${data.get('hora')}. (Demonstração: nenhum agendamento real foi feito.)`;
  result.classList.add('visible');
  bookingForm.reset();
  updateTimes();
});
