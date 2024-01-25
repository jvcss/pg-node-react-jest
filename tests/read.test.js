/**
 * @jest-environment node
 */
// my-broken-node-only-test.js
const request = require('supertest');
const { app, server } = require('../app');
const { Pool } = require('pg');

// DONE
describe('GET /clients/:clientId', () => {
  let client;
  let pool;

  beforeAll(async () => {
    // Create a new connection pool
    pool = new Pool({
      user: 'postgres',
      password: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'clients',
    });
    // create a client to retrieve
    const res = await pool.query(
      'INSERT INTO clients (full_name, email, telefone, coordinates) VALUES ($1, $2, $3, POINT($4, $5)) RETURNING *',
      ['Johni Doe', 'johnssoe@example.com', '22325678900', 10.12345, 20.54321]
    );
    client = res.rows[0];
  });

  afterAll(async () => {
    // delete the client created for the test
    await pool.query('DELETE FROM clients WHERE id = $1', [client.id]);
    // Close the pool after all tests are done
    await pool.end();
  });

  it('should return a client by ID', async () => {
    const res = await request(app).get(`/clients/${client.id}`).expect(200);

    expect(res.body.client.full_name).toEqual('Johni Doe');
    expect(res.body.client.email).toEqual('johnssoe@example.com');
    expect(res.body.client.telefone).toEqual('22325678900');
    expect([res.body.client.coordinates.x, res.body.client.coordinates.y]).toEqual([10.12345, 20.54321]);
  });

  it('should return 404 if client not found', async () => {
    const res = await request(app).get('/clients/9999').expect(404);

    expect(res.body.message).toEqual('Client not found');
  });
});
