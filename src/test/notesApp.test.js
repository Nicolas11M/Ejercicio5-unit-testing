const request = require('supertest');
const { app, resetContacts } = require('../app');

beforeEach(() => {
  resetContacts();
});

describe('Exercise 6 API', () => {

  describe('Email validation', () => {

    it('rejects invalid email', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Test',
          email: '@'
        });

      expect(res.status).toBe(400);
    });

    it('accepts valid email', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Test',
          email: 'test@example.com'
        });

      expect(res.status).toBe(201);
    });

  });

  describe('Duplicate email', () => {

    it('rejects duplicated email', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Otro',
          email: 'ana@example.com'
        });

      expect(res.status).toBe(409);
    });

    it('duplicate email is case insensitive', async () => {

      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Otro',
          email: 'ANA@EXAMPLE.COM'
        });

      expect(res.status).toBe(409);
    });

  });

  describe('Search and filters', () => {

    it('filters by search query', async () => {

      const res = await request(app)
        .get('/api/contacts?search=ana');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('search is case insensitive', async () => {

      const res = await request(app)
        .get('/api/contacts?search=ANA');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('filters favorites', async () => {

      const res = await request(app)
        .get('/api/contacts?favorite=true');

      expect(res.status).toBe(200);

      expect(
        res.body.every(c => c.favorite === true)
      ).toBe(true);
    });

  });

  describe('PATCH favorite', () => {

    it('toggles favorite to true', async () => {

      const res = await request(app)
        .patch('/api/contacts/1/favorite');

      expect(res.status).toBe(200);
      expect(res.body.favorite).toBe(true);
    });

    it('toggles favorite back to false', async () => {

      await request(app)
        .patch('/api/contacts/2/favorite');

      const res = await request(app)
        .patch('/api/contacts/2/favorite');

      expect(res.body.favorite).toBe(true);
    });

    it('returns 404 for invalid id', async () => {

      const res = await request(app)
        .patch('/api/contacts/999/favorite');

      expect(res.status).toBe(404);
    });

  });

  describe('PUT improved', () => {

    it('updates contact name', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          name: 'Nuevo Nombre'
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Nuevo Nombre');
    });

    it('rejects invalid email on update', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          email: 'correo-malo'
        });

      expect(res.status).toBe(400);
    });

    it('rejects duplicated email on update', async () => {

      const res = await request(app)
        .put('/api/contacts/1')
        .send({
          email: 'luis@example.com'
        });

      expect(res.status).toBe(409);
    });

  });

  describe('Error middleware', () => {

    it('returns json 404', async () => {

      const res = await request(app)
        .get('/api/ruta-que-no-existe');

      expect(res.status).toBe(404);

      expect(
        res.headers['content-type']
      ).toMatch(/json/);

      expect(res.body).toHaveProperty('error');
    });

  });

});