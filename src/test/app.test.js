const request = require('supertest');

const app = require('../app');

describe('Contacts API', () => {

  describe('GET /api/contacts', () => {

    it('devuelve status 200 y un array', async () => {

      const res = await request(app)
        .get('/api/contacts');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

    });

  });

  describe('GET /api/contacts/:id', () => {

    it('devuelve el contacto correcto', async () => {

      const res = await request(app)
        .get('/api/contacts/1');

      expect(res.status).toBe(200);

      expect(res.body).toMatchObject({
        id: 1,
        name: 'Nicolas'
      });

    });

    it('devuelve 404 si el ID no existe', async () => {

      const res = await request(app)
        .get('/api/contacts/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');

    });

  });

  describe('POST /api/contacts', () => {

    it('crea un contacto correctamente', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Juan',
          email: 'juan@gmail.com',
          phone: '111111'
        });

      expect(res.status).toBe(201);

      expect(res.body).toMatchObject({
        name: 'Juan',
        email: 'juan@gmail.com'
      });

    });

    it('devuelve 400 si falta el nombre', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          email: 'correo@gmail.com'
        });

      expect(res.status).toBe(400);

    });

    it('devuelve 400 si el email no tiene @', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Carlos',
          email: 'correo-invalido'
        });

      expect(res.status).toBe(400);

    });

  });

  describe('PUT /api/contacts/:id', () => {

    it('actualiza correctamente el contacto', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          phone: '999999'
        });

      expect(res.status).toBe(200);
      expect(res.body.phone).toBe('999999');

    });

  });

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

});