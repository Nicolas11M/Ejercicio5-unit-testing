const request = require('supertest');

const app = require('../notesApp');

describe('Notes API', () => {

  describe('GET /api/notes', () => {

    it('devuelve status 200 y un array', async () => {

      const res = await request(app).get('/api/notes');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

    });

  });

  describe('GET /api/notes/:id', () => {

    it('devuelve la nota correcta', async () => {

      const res = await request(app).get('/api/notes/1');

      expect(res.status).toBe(200);

      expect(res.body).toMatchObject({
        id: 1,
        text: 'Comprar leche'
      });

    });

    it('devuelve 404 si no existe', async () => {

      const res = await request(app).get('/api/notes/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');

    });

  });

  describe('POST /api/notes', () => {

    it('crea una nota correctamente', async () => {

      const res = await request(app)
        .post('/api/notes')
        .send({
          text: 'Nueva nota'
        });

      expect(res.status).toBe(201);

      expect(res.body).toMatchObject({
        text: 'Nueva nota',
        done: false
      });

    });

    it('devuelve 400 si text está vacío', async () => {

      const res = await request(app)
        .post('/api/notes')
        .send({
          text: ''
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/text/i);

    });

  });

});