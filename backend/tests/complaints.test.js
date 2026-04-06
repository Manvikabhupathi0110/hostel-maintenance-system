const request = require('supertest');
const app = require('../src/server');

describe('Complaints API', () => {
  describe('GET /api/complaints/:id', () => {
    it('should return 401 without auth token', async () => {
      const response = await request(app).get('/api/complaints/1');
      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/complaints/1')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/complaints/student/my-complaints', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/complaints/student/my-complaints');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/complaints', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/complaints')
        .send({
          room_id: 1,
          hostel_id: 1,
          issue_description: 'Test issue',
          category: 'general',
          priority: 'medium'
        });
      expect(response.status).toBe(401);
    });
  });
});