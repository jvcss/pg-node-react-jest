const request = require('supertest');
const { app, server } = require('../app');
const { Pool } = require('pg');

// Test delete client and common errors
describe('DELETE /clients/:id', () => {
    let client;
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
        // Insert a client into the database to be deleted
        const result = await pool.query(
            'INSERT INTO clients (full_name, email, telefone, coordinates) VALUES ($1, $2, $3, POINT($4, $5)) RETURNING *',
            ['Tester Um', 'tester@test.com', '123456789', '40.7128', '-74.0060']
        );
        client = result.rows[0];
    });

    afterEach(async () => {
        // Delete all clients from the database after each test
        await pool.query('DELETE FROM clients');
    });

    it('should delete a client', async () => {
        const response = await request(app).delete(`/clients/${client.id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Client deleted successfully');
        expect(response.body.client.id).toBe(client.id);

        // Check that the client no longer exists in the database
        const { rows } = await pool.query('SELECT * FROM clients WHERE id = $1', [client.id]);
        expect(rows.length).toBe(0);
    });

    it('should return an error if the client does not exist', async () => {
        const response = await request(app).delete('/clients/999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Client with ID 999 does not exist');
    });

    afterAll((done) => {
        server.close(done);
    });
});
