const request = require('supertest');
const { app, resetContacts } = require('../app');

describe('Contacts API', () => {

  beforeEach(() => {
    resetContacts();
  });

  // ─────────────────────────────
  // GET /api/contacts
  // ─────────────────────────────
  describe('GET /api/contacts', () => {

    it('devuelve status 200 y un array', async () => {

      const res = await request(app)
        .get('/api/contacts');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('filtra contactos por search', async () => {

      const res = await request(app)
        .get('/api/contacts?search=ana');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toMatch(/Ana/i);
    });

    it('filtra contactos favoritos', async () => {

      const res = await request(app)
        .get('/api/contacts?favorite=true');

      expect(res.status).toBe(200);

      expect(
        res.body.every(c => c.favorite === true)
      ).toBe(true);
    });

  });

  // ─────────────────────────────
  // GET /api/contacts/:id
  // ─────────────────────────────
  describe('GET /api/contacts/:id', () => {

    it('devuelve el contacto correcto', async () => {

      const res = await request(app)
        .get('/api/contacts/1');

      expect(res.status).toBe(200);

      expect(res.body).toMatchObject({
        id: 1,
        name: 'Ana García'
      });
    });

    it('devuelve 404 si el contacto no existe', async () => {

      const res = await request(app)
        .get('/api/contacts/999');

      expect(res.status).toBe(404);

      expect(res.body).toMatchObject({
        status: 404
      });
    });

  });

  // ─────────────────────────────
  // POST /api/contacts
  // ─────────────────────────────
  describe('POST /api/contacts', () => {

    it('crea un contacto correctamente', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Carlos',
          email: 'carlos@gmail.com',
          phone: '123456'
        });

      expect(res.status).toBe(201);

      expect(res.body).toMatchObject({
        name: 'Carlos',
        email: 'carlos@gmail.com'
      });
    });

    it('devuelve 400 si el nombre está vacío', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: '',
          email: 'correo@gmail.com'
        });

      expect(res.status).toBe(400);
    });

    it('devuelve 400 si el email es inválido', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Pedro',
          email: 'correo-invalido'
        });

      expect(res.status).toBe(400);
    });

    it('devuelve 409 si el email ya existe', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Otro',
          email: 'ana@example.com'
        });

      expect(res.status).toBe(409);
    });

  });

  // ─────────────────────────────
  // PUT /api/contacts/:id
  // ─────────────────────────────
  describe('PUT /api/contacts/:id', () => {

    it('actualiza un contacto correctamente', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          phone: '999999'
        });

      expect(res.status).toBe(200);

      expect(res.body.phone).toBe('999999');
    });

    it('devuelve 400 si el email es inválido', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          email: 'correo-mal'
        });

      expect(res.status).toBe(400);
    });

    it('devuelve 409 si el email ya pertenece a otro contacto', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          email: 'luis@example.com'
        });

      expect(res.status).toBe(409);
    });

  });

  // ─────────────────────────────
  // PATCH favorite
  // ─────────────────────────────
  describe('PATCH /api/contacts/:id/favorite', () => {

    it('cambia favorite de false a true', async () => {

      const res = await request(app)
        .patch('/api/contacts/1/favorite');

      expect(res.status).toBe(200);
      expect(res.body.favorite).toBe(true);
    });

    it('devuelve 404 si el contacto no existe', async () => {

      const res = await request(app)
        .patch('/api/contacts/999/favorite');

      expect(res.status).toBe(404);
    });

  });

  // ─────────────────────────────
  // DELETE
  // ─────────────────────────────
  describe('DELETE /api/contacts/:id', () => {

    it('elimina un contacto correctamente', async () => {

      const res = await request(app)
        .delete('/api/contacts/1');

      expect(res.status).toBe(200);

      expect(res.body).toMatchObject({
        message: 'Contacto eliminado.'
      });
    });

    it('devuelve 404 si el contacto no existe', async () => {

      const res = await request(app)
        .delete('/api/contacts/999');

      expect(res.status).toBe(404);
    });

  });

  // ─────────────────────────────
  // Ruta inexistente
  // ─────────────────────────────
  describe('Rutas inexistentes', () => {

    it('devuelve 404 para rutas no existentes', async () => {

      const res = await request(app)
        .get('/ruta-falsa');

      expect(res.status).toBe(404);

      expect(res.body).toMatchObject({
        status: 404,
        error: 'Ruta no encontrada.'
      });
    });

  });

});

