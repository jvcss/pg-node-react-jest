const request = require('supertest');
const { app, server } = require('../app');
const { Pool } = require('pg');

// Test create client and common errors
describe('POST /clients', () => {
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

    it('should return an error if a required field is missing', async () => {
        const newClient = {
            fullName: 'John Doe',
            //email: 'john@example.com', // email field (assuming it's the only required field)
            coordinates: { x: 40.7128, y: -74.0060 }, // Include coordinates field
        };
        const response = await request(app)
            .post('/clients')
            .send(newClient)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Missing required fields');
    });

    it('should show error for a new client with duplicate email', async () => {
        const existingClient = {
            fullName: 'Existing Client',
            email: 'existing@example.com',
        };
        // Insert an existing client to the database
        await pool.query(
            'INSERT INTO clients (full_name, email) VALUES ($1, $2)',
            [existingClient.fullName, existingClient.email]
        );

        const newClient = {
            fullName: 'John Doe',
            email: existingClient.email, // Use the same email as the existing client
            coordinates: { x: 40.7128, y: -74.0060 }, // Include coordinates field
        };

        const response = await request(app)
            .post('/clients')
            .send(newClient)
            .set('Accept', 'application/json');

        // Clean up: Remove the existing client from the database
        await pool.query('DELETE FROM clients WHERE email = $1', [existingClient.email]);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Client with the given email already exists');
    });

    it('should create a new client', async () => {
        const newClient = {
            fullName: 'John Doe',
            email: 'john@example.com',
            telefone: '123456789', // Include telefone field (assuming it's optional)
            coordinates: { x: 40.7128, y: -74.0060 }, // Include coordinates field
        };

        const response = await request(app)
            .post('/clients')
            .send(newClient)
            .set('Accept', 'application/json');

        client = response.body.client;

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Client created successfully');
        expect(response.body.client).toHaveProperty('id');
        expect(response.body.client.full_name).toBe(newClient.fullName);
        expect(response.body.client.email).toBe(newClient.email);
        expect(response.body.client.telefone).toBe(newClient.telefone);
        //expect([response.body.client.coordinates.x, response.body.client.coordinates.y]).toEqual([newClient.coordinates.x, newClient.coordinates.y]);
    });

    afterEach(async () => {
        if (client) {
            // Delete the client created in beforeEach
            await pool.query('DELETE FROM clients WHERE id = $1', [client.id]);
        }
    });

    afterAll((done) => {
        server.close(done);
    });
});
