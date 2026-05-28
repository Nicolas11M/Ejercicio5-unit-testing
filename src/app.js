const express = require('express');

const app = express();

app.use(express.json());

let contacts = [
  {
    id: 1,
    name: 'Nicolas',
    email: 'nicolas@gmail.com',
    phone: '123456789'
  }
];

let nextId = 2;

// GET todos los contactos
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

// GET contacto por ID
app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(
    c => c.id === Number(req.params.id)
  );

  if (!contact) {
    return res.status(404).json({
      error: 'Contacto no encontrado.'
    });
  }

  res.json(contact);
});

// POST crear contacto
app.post('/api/contacts', (req, res) => {

  const { name, email, phone } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      error: 'El nombre es requerido.'
    });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      error: 'Email inválido.'
    });
  }

  const newContact = {
    id: nextId++,
    name,
    email,
    phone: phone || ''
  };

  contacts.push(newContact);

  res.status(201).json(newContact);
});

// PUT actualizar contacto
app.put('/api/contacts/:id', (req, res) => {

  const contact = contacts.find(
    c => c.id === Number(req.params.id)
  );

  if (!contact) {
    return res.status(404).json({
      error: 'Contacto no encontrado.'
    });
  }

  Object.assign(contact, req.body);

  res.json(contact);
});

// DELETE contacto
app.delete('/api/contacts/:id', (req, res) => {

  const index = contacts.findIndex(
    c => c.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      error: 'Contacto no encontrado.'
    });
  }

  contacts.splice(index, 1);

  res.status(200).json({
    message: 'Contacto eliminado.'
  });
});

module.exports = app;