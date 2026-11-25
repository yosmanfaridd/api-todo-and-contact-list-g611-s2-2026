const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let tareas = [
  { id: 1, titulo: 'Aprender Express', fecha: '', completada: false },
  { id: 2, titulo: 'Crear una API REST', fecha: '', completada: false },
  { id: 3, titulo: 'Probar la API', fecha: '', completada: false }
];

let contactos = [
  { id: 1, nombre: 'Felipe Arias', telefono: '3001234567', correo: 'felipe@correo.com' }
];

// --- RUTAS DE TAREAS ---
app.get('/tareas', (req, res) => {
  res.json(tareas);
});

app.post('/tareas', (req, res) => {
  const { titulo, fecha } = req.body;
  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  const nuevaTarea = {
    id: Date.now(),
    titulo: titulo.trim(),
    fecha: fecha || '',
    completada: false
  };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  if (typeof req.body.titulo === 'string' && req.body.titulo.trim()) {
    tarea.titulo = req.body.titulo.trim();
  }
  if (typeof req.body.fecha === 'string') {
    tarea.fecha = req.body.fecha;
  }
  if (typeof req.body.completada === 'boolean') {
    tarea.completada = req.body.completada;
  }

  res.json(tarea);
});

app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = tareas.findIndex(t => t.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  tareas.splice(indice, 1);
  res.status(204).send();
});

// --- RUTAS DE CONTACTOS ---
app.get('/contactos', (req, res) => {
  res.json(contactos);
});

app.post('/contactos', (req, res) => {
  const { nombre, telefono, correo } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  const nuevoContacto = {
    id: Date.now(),
    nombre: nombre.trim(),
    telefono: telefono ? telefono.trim() : '',
    correo: correo ? correo.trim() : ''
  };
  contactos.push(nuevoContacto);
  res.status(201).json(nuevoContacto);
});

app.put('/contactos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contacto = contactos.find(c => c.id === id);

  if (!contacto) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }

  if (typeof req.body.nombre === 'string' && req.body.nombre.trim()) {
    contacto.nombre = req.body.nombre.trim();
  }
  if (typeof req.body.telefono === 'string') {
    contacto.telefono = req.body.telefono.trim();
  }
  if (typeof req.body.correo === 'string') {
    contacto.correo = req.body.correo.trim();
  }

  res.json(contacto);
});

app.delete('/contactos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = contactos.findIndex(c => c.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }

  contactos.splice(indice, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});