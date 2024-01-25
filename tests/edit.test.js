const request = require('supertest');
const { app, server } = require('../app');
const { Pool } = require('pg');

// Test update client and common error
describe('PUT /clients/:clientId', () => {
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
        // Create a client to be updated
        const newClient = {
            fullName: 'John Doe',
            email: 'johnbdf@example.com',
            telefone: '12545608900',
            coordinates: { x: 10.7128, y: -700060 },
        };
        const res = await request(app)
            .post('/clients')
            .send(newClient)
            .set('Accept', 'application/json');
        client = res.body.client;
    });

    afterEach(async () => {
        // Delete the client created in beforeEach
        await pool.query('DELETE FROM clients WHERE id = $1', [client.id]);
    });

    it('should update a client', async () => {
        const res = await request(app)
            .put(`/clients/${client.id}`)
            .send({
                fullName: 'Jane Doe',
                email: 'janedoe@example.com',
                telefone: '987654321', // Include telefone field (assuming it's optional)
                coordinates: [40.7128, -74.0060]  , // Include coordinates field
            })
            .expect(200);

        expect(res.body.message).toBe('Client updated successfully');
        expect(res.body.client.full_name).toBe('Jane Doe');
        expect(res.body.client.email).toBe('janedoe@example.com');
        expect(res.body.client.telefone).toBe('987654321');
        expect(res.body.client.coordinates).toEqual({ x: 40.7128, y: -74.0060 });
    });

    it('should return an error if the client does not exist', async () => {
        const res = await request(app)
            .put('/clients/999')
            .send({
                fullName: 'Jane Doe',
                cpf: '98765432101',
                birthDate: '1990-02-02',
                email: 'janedoe@example.com',
                telefone: '987654321',
                coordinates: { latitude: 40.7128, longitude: -74.0060 },
            })
            .expect(404);

        expect(res.body.message).toBe('Client with ID 999 not found');
    });
});
