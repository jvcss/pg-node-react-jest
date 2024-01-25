const request = require('supertest');
const { app, server } = require('../app');
const { Pool } = require('pg');

describe('ADD 20 FAKE CLIENTS', () => {
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

    it('should add 20 fake clients to the database', async () => {
        const clients = [];

        for (let i = 0; i < 20; i++) {
            clients.push({
                fullName: `Mr Client ${i}`,
                email: `client${i}@example.com`,
                telefone: `037772041${i + 10}`,
                coordinates: [`${i}.000000`, `${i}.000000`],
            });

            await pool.query(
                'INSERT INTO clients (full_name, email, telefone, coordinates) VALUES ($1, $2, $3, POINT($4, $5))',
                [clients[i].fullName, clients[i].email, clients[i].telefone, clients[i].coordinates[0], clients[i].coordinates[1] ]
            );
        }

        // Verify that the clients were added successfully
        const response = await request(app).get('/clients');

        expect(response.status).toBe(200);
        //expect(response.body.clients.length).toBe(20);

        // Clean up: Delete the added clients from the database
        for (let i = 0; i < 20; i++) {
            await pool.query('DELETE FROM clients  WHERE telefone = $1;', [clients[i].telefone]);
        }
    });

    afterAll((done) => {
        server.close(done);
    });
});
