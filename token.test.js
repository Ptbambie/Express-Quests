const request = require('supertest');
const app = require('./app');

describe('Your test suite description', () => {
  it('Your test description', async () => {
    const response = await request(app)
      .get('/your/protected/route')
      .set('Authorization', 'Bearer your_valid_token');

      expect(response.status).toBe(200);  // Vérifie que le statut de la réponse est OK
      expect(response.body).toHaveProperty('token');  // Vérifie que la réponse contient une propriété 'token'
      expect(response.body).toHaveProperty('user');   // Vérifie que la réponse contient une propriété 'user'
  
  });
});
