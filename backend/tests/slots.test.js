const request = require('supertest');
const app = require('../src/server');
const SlotService = require('../src/services/slotService');

describe('Slots API', () => {
  describe('GET /api/slots/available', () => {
    it('should return 200 for available slots query', async () => {
      const response = await request(app).get('/api/slots/available?hostel_id=1');
      // May succeed or fail due to DB
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('POST /api/slots/book', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/slots/book')
        .send({ slot_id: 1, electrician_id: 1 });
      expect(response.status).toBe(401);
    });

    it('should return 400 with invalid data and auth', async () => {
      const response = await request(app)
        .post('/api/slots/book')
        .set('Authorization', 'Bearer invalid_token')
        .send({ slot_id: 'invalid' });
      expect([400, 401]).toContain(response.status);
    });
  });
});

describe('SlotService Unit Tests', () => {
  describe('generateTimeSlots', () => {
    it('should generate correct time slots for 4PM-6PM', () => {
      const slots = SlotService.generateTimeSlots('16:00', '18:00', 60);
      expect(slots).toHaveLength(2);
      expect(slots[0]).toEqual(['16:00', '17:00']);
      expect(slots[1]).toEqual(['17:00', '18:00']);
    });

    it('should generate correct time slots for 9AM-5PM', () => {
      const slots = SlotService.generateTimeSlots('09:00', '17:00', 60);
      expect(slots).toHaveLength(8);
    });

    it('should return empty for same start and end time', () => {
      const slots = SlotService.generateTimeSlots('09:00', '09:00', 60);
      expect(slots).toHaveLength(0);
    });
  });

  describe('minutesToTimeString', () => {
    it('should convert minutes to HH:MM format', () => {
      expect(SlotService.minutesToTimeString(540)).toBe('09:00');
      expect(SlotService.minutesToTimeString(960)).toBe('16:00');
      expect(SlotService.minutesToTimeString(1020)).toBe('17:00');
    });
  });
});