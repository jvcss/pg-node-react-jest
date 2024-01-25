const request = require('supertest');
const { app, server } = require('../app'); 
const { Pool } = require('pg');

// test for list clients and common errors
describe('GET /clients', () => {
    let pool;
    beforeAll(() => {
        // Create a new connection pool
        pool = new Pool({
            user: 'postgres',
            password: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'clients',
        });
    });

    afterAll(async () => {
        // Close the pool after all tests are done
        await pool.end();
    });

    beforeEach(async () => {
        // Insert 20 clients to the database before each test
        const clients = [];

        for (let i = 0; i < 20; i++) {
            clients.push({
                fullName: `Mr Client ${i}`,
                email: `client${i}@example.com`,
                telefone: `1199999999${i}`,
                coordinates: ['0.000000', '0.000000'],
            });
            await pool
                .query('INSERT INTO clients (full_name, email, telefone, coordinates) VALUES ($1, $2, $3, POINT($4, $5))',
                    [clients[i].fullName, clients[i].email, clients[i].telefone, clients[i].coordinates[0], clients[i].coordinates[1]]);
        }
    });

    afterEach(async () => {
        // Delete all clients from the database after each test
        await pool.query('DELETE FROM clients');
    });

    it('should return a list of 10 clients', async () => {
        const response = await request(app).get('/clients');
        expect(response.status).toBe(200);
        expect(response.body.clients).toHaveLength(10);
    });

    it('should return the second page of clients', async () => {
        const response = await request(app).get('/clients?page=2');
        expect(response.status).toBe(200);
        expect(response.body.clients).toHaveLength(10);
        expect(response.body.clients[0].full_name).toBe('Mr Client 10');
    });

    it('should return no clients for an invalid page number', async () => {
        const response = await request(app).get('/clients?page=3');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No clients found in this page.');
    });

    afterAll(() => {
        server.close();
    });
});