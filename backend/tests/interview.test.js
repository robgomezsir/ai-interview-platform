const request = require('supertest');
const { app } = require('../src/index');

describe('Interview API', () => {
  let interviewId;

  describe('POST /api/interviews/start', () => {
    it('should start a new interview with valid data', async () => {
      const candidateData = {
        name: 'João Silva',
        email: 'joao@example.com',
        jobProfile: 'Atendente de Suporte'
      };

      const response = await request(app)
        .post('/api/interviews/start')
        .send(candidateData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('interviewId');
      expect(response.body.data).toHaveProperty('initialMessage');
      expect(response.body.data).toHaveProperty('candidate');

      interviewId = response.body.data.interviewId;
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        jobProfile: ''
      };

      const response = await request(app)
        .post('/api/interviews/start')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('POST /api/interviews/:id/message', () => {
    it('should send a message to an interview', async () => {
      const messageData = {
        message: 'Olá, como posso ajudar?'
      };

      const response = await request(app)
        .post(`/api/interviews/${interviewId}/message`)
        .send(messageData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('reply');
    });

    it('should return 404 for non-existent interview', async () => {
      const messageData = {
        message: 'Test message'
      };

      const response = await request(app)
        .post('/api/interviews/00000000-0000-0000-0000-000000000000/message')
        .send(messageData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/interviews/:id', () => {
    it('should get interview details', async () => {
      const response = await request(app)
        .get(`/api/interviews/${interviewId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('candidate');
    });

    it('should return 404 for non-existent interview', async () => {
      const response = await request(app)
        .get('/api/interviews/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/interviews/:id/complete', () => {
    it('should complete an interview and generate evaluation', async () => {
      const response = await request(app)
        .post(`/api/interviews/${interviewId}/complete`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('evaluation');
      expect(response.body.data).toHaveProperty('overallScore');
    });
  });
});
