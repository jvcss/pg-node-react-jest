const request = require('supertest');
const { app, server } = require('../app'); 
const { Pool } = require('pg');

describe('POST /clients/import', () => {
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
    // Delete the clients created in beforeEach
    await pool.query('DELETE FROM clients;');
  });

  afterEach(async () => {
    // Delete the clients created in beforeEach
    await pool.query('DELETE FROM clients;');
  });

  it('should import a file with clients successfully', async () => {
    // Assuming your file contains data in the format: 
    //
    // Full Name,Email,Telefone,Coordinates\n
    //
    //John Doe,john.doe@example.com,11999999999,POINT(0 0)\nJane Doe,jane.doe@example.com,11999999998,POINT(1 1)"
    const res = await request(app)
      .post('/clients/import')
      .attach('file', `${__dirname}/a_default.txt`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('File imported successfully');
    expect(res.body.data.length).toBe(2);

    // Verify the details of the first imported client
    expect(res.body.data[0].full_name).toBe('John Doe');
    expect(res.body.data[0].email).toBe('john.doe@example.com');
    expect(res.body.data[0].telefone).toBe('11999999999');
    expect([res.body.data[0].coordinates.x, res.body.data[0].coordinates.y]).toEqual([16.6869, 49.2648]);

    // Verify the details of the second imported client
    expect(res.body.data[1].full_name).toBe('Jane Doe');
    expect(res.body.data[1].email).toBe('jane.doe@example.com');
    expect(res.body.data[1].telefone).toBe('11999999998');
    expect([res.body.data[1].coordinates.x, res.body.data[1].coordinates.y]).toEqual([22.9068, 43.1729]);
  });
});
