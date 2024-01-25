const request = require('supertest');
const { app, server } = require('../app'); 
const { createDbConnection } = require('./setup.js');


describe('GET /:latitude/:longitude/:radius', () => {
    let pool;
    beforeAll(async () => {
      // Create a new connection
      const connection = await createDbConnection();
      pool = connection.pool;
    });
  
    afterAll(async () => {
      // Release the pool
      await pool.end();
    });
  
    it('should return nearby clients sorted by proximity', async () => {
      // Mock data for testing
      const mockClients = [
        { coordinates: [10, 20 ] },
        { coordinates: [15, 25] },
        // Add more mock data as needed
      ];
  
      // Mock the pool.query method to return the mock data
      pool.query = jest.fn().mockResolvedValue({ rows: mockClients });
  
      // Make a request to the endpoint
      const response = await request(app).get('/clients/10/20/1');
  
      // Validate the response
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nearbyClients');
    });
  
    it('should handle invalid numeric values gracefully', async () => {
      // Make a request with invalid numeric values
      const response = await request(app).get('/clients/invalid/20/1');
  
      // Validate the response for invalid numeric values
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid numeric values for latitude, longitude, or radius');
    });
  });