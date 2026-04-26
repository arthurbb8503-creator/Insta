const CHANNEL = 'fila-sorvete-na-chapa-v1';
const STORAGE_KEY = 'filaSorveteState';
let memoryStateCache = null;

const flavorsData = [
  { id: 'f1', name: 'Morango Cremoso', photo: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=300&q=60' },
  { id: 'f2', name: 'Chocolate Belga', photo: 'https://images.unsplash.com/photo-1561845730-208ad5910553?auto=format&fit=crop&w=300&q=60' },
  { id: 'f3', name: 'Doce de Leite Crocante', photo: 'https://images.unsplash.com/photo-1514849302-984523450cf4?auto=format&fit=crop&w=300&q=60' },
  { id: 'f4', name: 'Banana com Canela', photo: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=300&q=60' },
  { id: 'f5', name: 'Maracujá Tropical', photo: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=300&q=60' },
  { id: 'f6', name: 'Oreo na Chapa', photo: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=60' },
  { id: 'f7', name: 'Ninho com Nutella', photo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=60' },
  { id: 'f8', name: 'Pistache Premium', photo: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=60' },
  { id: 'f9', name: 'Coco Queimado', photo: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=300&q=60' },
  { id: 'f10', name: 'Limão Siciliano', photo: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=300&q=60' }
];

const initialState = { queue: [], lastUpdated: Date.now() };
let selectedFlavor = null;
let selectedTicket = null;
let state = loadState();
let previousClientStatus = '';

const bc = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null;
if (bc) bc.onmessage = ({ data }) => { if (data?.type === 'state') { state = data.payload; renderAll(); } };
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY && e.newValue) {
    state = JSON.parse(e.newValue);
    renderAll();
  }
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneInitialState();
    return JSON.parse(raw);
  } catch {
    return memoryStateCache ? JSON.parse(memoryStateCache) : cloneInitialState();
  }
}

function saveState() {
  state.lastUpdated = Date.now();
  const serialized = JSON.stringify(state);
  memoryStateCache = serialized;
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Em modo privado ou com storage bloqueado, segue com cache em memória.
  }
  if (bc) bc.postMessage({ type: 'state', payload: state });
  renderAll();
}

function cloneInitialState() {
  if (typeof structuredClone === 'function') return structuredClone(initialState);
  return JSON.parse(JSON.stringify(initialState));
}

function ticketBusy(ticket) {
  return state.queue.some((item) => item.ticket === ticket && item.status !== 'done');
}

function recomputeStatuses() {
  const active = state.queue.filter((i) => i.status !== 'done');
  active.forEach((item, index) => {
    item.status = index === 0 ? 'preparing' : 'waiting';
  });
}

function addOrder() {
  if (!selectedFlavor || !selectedTicket) {
    alert('Selecione sabor e ficha.');
    return;
  }
  if (ticketBusy(selectedTicket)) {
    alert('Essa ficha já está ocupada. Escolha outra.');
    return;
  }

  state.queue.push({
    id: safeId(),
    flavorId: selectedFlavor,
    ticket: Number(selectedTicket),
    status: 'waiting',
    createdAt: Date.now()
  });

  recomputeStatuses();
  saveState();
}

function safeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `pedido-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function markDelivered(id) {
  const item = state.queue.find((i) => i.id === id);
  if (!item) return;
  item.status = 'done';
  recomputeStatuses();
  saveState();
}

function clearDone() {
  state.queue = state.queue.filter((i) => i.status !== 'done');
  recomputeStatuses();
  saveState();
}

function flavorById(id) {
  return flavorsData.find((f) => f.id === id);
}

function renderFlavors() {
  const el = document.getElementById('flavors');
  el.innerHTML = flavorsData.map((f) => `
    <div class="flavor ${selectedFlavor === f.id ? 'selected' : ''}" data-flavor="${f.id}">
      <img src="${f.photo}" alt="${f.name}" loading="lazy" />
      <div><strong>${f.name}</strong></div>
    </div>
  `).join('');

  el.querySelectorAll('[data-flavor]').forEach((node) => {
    node.addEventListener('click', () => {
      selectedFlavor = node.dataset.flavor;
      renderFlavors();
    });
  });
}

function renderTickets() {
  const el = document.getElementById('tickets');
  el.innerHTML = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
    const busy = ticketBusy(n);
    return `<div class="ticket ${selectedTicket === n ? 'selected' : ''} ${busy ? 'busy' : ''}" data-ticket="${n}">#${n}</div>`;
  }).join('');

  el.querySelectorAll('[data-ticket]').forEach((node) => {
    node.addEventListener('click', () => {
      if (node.classList.contains('busy')) return;
      selectedTicket = Number(node.dataset.ticket);
      renderTickets();
    });
  });
}

function queueItemHtml(item) {
  const flavor = flavorById(item.flavorId);
  const label = item.status === 'preparing' ? 'Em preparo' : item.status === 'waiting' ? 'Na fila' : 'Entregue';
  return `
    <div class="queue-item">
      <div>
        <div><strong>Ficha #${item.ticket}</strong> • ${flavor?.name || 'Sabor removido'}</div>
        <div class="note">${new Date(item.createdAt).toLocaleTimeString('pt-BR')}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="pill ${item.status}">${label}</span>
        ${item.status !== 'done' ? `<button data-deliver="${item.id}">Entregue</button>` : ''}
      </div>
    </div>
  `;
}

function renderQueue() {
  const el = document.getElementById('queue');
  if (!state.queue.length) {
    el.innerHTML = '<p class="note">Fila vazia.</p>';
    return;
  }

  el.innerHTML = state.queue.map(queueItemHtml).join('');
  el.querySelectorAll('[data-deliver]').forEach((btn) => btn.addEventListener('click', () => markDelivered(btn.dataset.deliver)));
}

function getClientTicket() {
  const select = document.getElementById('clientTicket');
  return Number(select.value || 0);
}

function notifyClient(message) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Fila do Sorvete', { body: message });
  }
}

function renderClientQueue() {
  const el = document.getElementById('clientQueue');
  const active = state.queue.filter((i) => i.status !== 'done');
  el.innerHTML = active.length ? active.map(queueItemHtml).join('') : '<p class="note">Sem pedidos na fila agora.</p>';

  const ticket = getClientTicket();
  const number = document.getElementById('ticketNumber');
  const alert = document.getElementById('clientAlert');
  number.textContent = ticket ? `#${ticket}` : '--';

  if (!ticket) {
    alert.textContent = 'Aguardando seleção da sua ficha.';
    return;
  }

  const myOrder = active.find((i) => i.ticket === ticket);
  if (!myOrder) {
    const msg = 'Sua ficha está livre ou já foi entregue.';
    alert.textContent = msg;
    previousClientStatus = msg;
    return;
  }

  const pos = active.findIndex((i) => i.id === myOrder.id) + 1;
  let message = `Você está na posição ${pos}.`;

  if (myOrder.status === 'preparing') {
    message = 'Seu sorvete está em preparação agora!';
  }

  if (message !== previousClientStatus) {
    notifyClient(message);
    previousClientStatus = message;
  }

  alert.textContent = message;
}

function renderClientTicketSelect() {
  const select = document.getElementById('clientTicket');
  select.innerHTML = `<option value="">Selecione</option>${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}`;
  const params = new URLSearchParams(location.search);
  const ticket = params.get('ficha');
  if (ticket && Number(ticket) >= 1 && Number(ticket) <= 10) {
    select.value = ticket;
  }
  select.addEventListener('change', renderClientQueue);
}

function renderQrLinks() {
  const base = `${location.origin}${location.pathname}`;
  const el = document.getElementById('qrLinks');
  el.innerHTML = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
    const url = `${base}?modo=cliente&ficha=${n}`;
    return `<div class="qr-card"><strong>Ficha ${n}</strong><br/><small>${url}</small></div>`;
  }).join('');
}

function setMode(mode) {
  const att = document.getElementById('attendantView');
  const cli = document.getElementById('clientView');
  const launch = document.getElementById('launchView');
  launch.classList.add('hidden');

  if (mode === 'cliente') {
    att.classList.add('hidden');
    cli.classList.remove('hidden');
  } else {
    cli.classList.add('hidden');
    att.classList.remove('hidden');
  }

  const params = new URLSearchParams(location.search);
  params.set('modo', mode);
  history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
  renderAll();
}

function renderAll() {
  renderFlavors();
  renderTickets();
  renderQueue();
  renderClientQueue();
}

document.getElementById('addToQueue').addEventListener('click', addOrder);
document.getElementById('clearDone').addEventListener('click', clearDone);
document.getElementById('goAttendant').addEventListener('click', () => setMode('atendente'));
document.getElementById('goClient').addEventListener('click', () => setMode('cliente'));
document.getElementById('launchAttendant').addEventListener('click', () => setMode('atendente'));
document.getElementById('launchClient').addEventListener('click', () => setMode('cliente'));

renderClientTicketSelect();
renderQrLinks();

const params = new URLSearchParams(location.search);
const mode = params.get('modo');
if (mode) {
  setMode(mode);
} else {
  document.getElementById('attendantView').classList.add('hidden');
  document.getElementById('clientView').classList.add('hidden');
  document.getElementById('launchView').classList.remove('hidden');
}

setInterval(() => {
  const fresh = loadState();
  if (fresh.lastUpdated !== state.lastUpdated) {
    state = fresh;
    renderAll();
  }
}, 1200);

const logo = params.get('logo');
const logoImg = document.getElementById('logoImg');
if (logo) {
  logoImg.src = logo;
} else {
  logoImg.alt = 'Adicione sua logo com ?logo=https://...';
}
