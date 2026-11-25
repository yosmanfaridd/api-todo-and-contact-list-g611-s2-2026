const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('todo-title');
const datePickerInput = document.getElementById('date-picker');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const emptyTasks = document.getElementById('empty-tasks');

const contactForm = document.getElementById('contact-form');
const contactNameInput = document.getElementById('contact-name');
const contactPhoneInput = document.getElementById('contact-phone');
const contactEmailInput = document.getElementById('contact-email');
const contactList = document.getElementById('contact-list');
const contactCount = document.getElementById('contact-count');
const emptyContacts = document.getElementById('empty-contacts');

const themeToggle = document.getElementById('theme-toggle');
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
const pageTitle = document.querySelector('h1');

// Cambiar pestaña entre Tareas y Contactos
tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabButtons.forEach((b) => b.classList.toggle('active', b === btn));
    tabPanels.forEach((p) => p.classList.toggle('active', p.id === `panel-${target}`));
    pageTitle.textContent = target === 'tareas' ? 'Mis tareas' : 'Contactos';
  });
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.remove('dark');
  themeToggle.textContent = '☾';
} else {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀' : '☾';
});

// --- TAREAS (API /tareas) ---
async function loadTasks() {
  const res = await fetch('/tareas');
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  const pending = tasks.filter((t) => !t.completada).length;
  taskCount.textContent = `${pending}${pending === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
  emptyTasks.classList.toggle('hidden', tasks.length > 0);

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completada ? 'completed' : ''}`;  const checkBtn = document.createElement('button'); checkBtn.className = 'check-button'; checkBtn.textContent = task.completada ? '✓' : ''; checkBtn.addEventListener('click', async () => { await fetch(`/tareas/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completada: !task.completada })
      });
      loadTasks();
    });

    const content = document.createElement('div');
    content.className = 'task-content';
    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = task.titulo;
    content.appendChild(titleSpan);

    if (task.fecha) {
      const dateSpan = document.createElement('span');
      dateSpan.className = 'task-date';
      dateSpan.textContent = task.fecha;
      content.appendChild(dateSpan);
    }

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-button';
    editBtn.textContent = '✎';
    editBtn.title = 'Editar';
    editBtn.addEventListener('click', async () => {
      const nuevoTitulo = prompt('Editar tarea:', task.titulo);
      if (nuevoTitulo && nuevoTitulo.trim()) {
        await fetch(`/tareas/${task.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: nuevoTitulo.trim() }) }); loadTasks(); } });  const delBtn = document.createElement('button'); delBtn.className = 'icon-button delete'; delBtn.textContent = '✕'; delBtn.title = 'Eliminar'; delBtn.addEventListener('click', async () => { await fetch(`/tareas/${task.id}`, { method: 'DELETE' });
      loadTasks();
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(checkBtn);
    li.appendChild(content);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = taskTitleInput.value.trim();
  const fecha = datePickerInput.value;
  if (!titulo) return;

  await fetch('/tareas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, fecha })
  });

  taskTitleInput.value = '';
  datePickerInput.value = '';
  taskTitleInput.focus();
  loadTasks();
});

// --- CONTACTOS (API /contactos) ---
async function loadContacts() {
  const res = await fetch('/contactos');
  const contacts = await res.json();
  renderContacts(contacts);
}

function renderContacts(contacts) {
  contactList.innerHTML = '';
  contactCount.textContent = `${contacts.length}${contacts.length === 1 ? 'contacto' : 'contactos'}`;
  emptyContacts.classList.toggle('hidden', contacts.length > 0);

  contacts.forEach((contact) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const avatar = document.createElement('span');
    avatar.className = 'check-button';
    avatar.style.display = 'grid';
    avatar.style.placeItems = 'center';
    avatar.textContent = contact.nombre.charAt(0).toUpperCase();

    const content = document.createElement('div');
    content.className = 'task-content';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'task-title';
    nameSpan.textContent = contact.nombre;

    const infoSpan = document.createElement('span');
    infoSpan.className = 'task-date';
    infoSpan.textContent = [contact.telefono, contact.correo].filter(Boolean).join(' · ') || 'Sin datos extra';

    content.appendChild(nameSpan);
    content.appendChild(infoSpan);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-button';
    editBtn.textContent = '✎';
    editBtn.title = 'Editar contacto';
    editBtn.addEventListener('click', async () => {
      const nombre = prompt('Nombre:', contact.nombre);
      if (!nombre || !nombre.trim()) return;
      const telefono = prompt('Teléfono:', contact.telefono || '') ?? contact.telefono;
      const correo = prompt('Correo:', contact.correo || '') ?? contact.correo;

      await fetch(`/contactos/${contact.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: nombre.trim(), telefono, correo }) }); loadContacts(); });  const delBtn = document.createElement('button'); delBtn.className = 'icon-button delete'; delBtn.textContent = '✕'; delBtn.title = 'Eliminar contacto'; delBtn.addEventListener('click', async () => { await fetch(`/contactos/${contact.id}`, { method: 'DELETE' });
      loadContacts();
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(avatar);
    li.appendChild(content);
    li.appendChild(actions);
    contactList.appendChild(li);
  });
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = contactNameInput.value.trim();
  const telefono = contactPhoneInput.value.trim();
  const correo = contactEmailInput.value.trim();
  if (!nombre) return;

  await fetch('/contactos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, telefono, correo })
  });

  contactNameInput.value = '';
  contactPhoneInput.value = '';
  contactEmailInput.value = '';
  contactNameInput.focus();
  loadContacts();
});

loadTasks();
loadContacts();