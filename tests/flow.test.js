const request = require('supertest');
const { app, server } = require('../app');
const { Pool } = require('pg');

// CREATE 
// client and common errors
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

    let existingClient;
    beforeAll(async () => {
        await pool.query('DELETE FROM clients;');
        existingClient = {
            fullName: 'John Doe',
            email: 'johnbee@example.com',
            telefone: '1234567890',
            coordinates: [10.12345, 20.54321], // Assuming coordinates are provided as an array [latitude, longitude]
        };

        const result = await pool.query(
            'INSERT INTO clients (full_name, email, telefone, coordinates) VALUES ($1, $2, $3, POINT($4, $5)) RETURNING *',
            [existingClient.fullName, existingClient.email, existingClient.telefone, existingClient.coordinates[0], existingClient.coordinates[1]]
        );

        existingClient.id = result.rows[0].id;
    });

    it('should return an error if a required field is missing', async () => {
        const newClient = {
            fullName: 'John Doe',
            // Missing email field
            telefone: '1234567890',
            coordinates: [10.12345, 20.54321],
        };

        const response = await request(app)
            .post('/clients')
            .send(newClient)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Missing required fields');
    });

    it('should show error for a new client with existing telefone or email', async () => {
        const newClient = {
            fullName: 'Jane Doe',
            email: existingClient.email,
            telefone: '9876543210',
            coordinates: [30.98765, 40.12345],
        };

        const response = await request(app)
            .post('/clients')
            .send(newClient)
            .set('Accept', 'application/json');

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Client with the given email already exists');
    });

    it('should create a new client', async () => {
        const newClient = {
            fullName: 'Johntoe',
            email: 'johneow@example.com',
            telefone: '5555555555',
            coordinates: [50.54321, 60.98765],
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
        //conversao explicitada.
        expect([response.body.client.coordinates.x, response.body.client.coordinates.y]).toEqual(newClient.coordinates);
    });

    afterEach(async () => {
        if (client) {
            // Delete the client created in beforeEach
            await pool.query('DELETE FROM clients WHERE id = $1', [client.id]);
        }
    });

    afterAll(async () => {
        await pool.query('DELETE FROM clients;');
        server.close();
    });
});


// DELETE
// client and common errors
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
            ['Tester Um', 'tester@test.com', '22325678905', 10.12345, 20.54321]
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

    afterAll(async () => {
        await pool.query('DELETE FROM clients');
        server.close();
    });
});

// EDIT
// client and common error
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
            coordinates: [10.12345, 20.54321],
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
                telefone: '123456789', // Add the telefone field to the update payload
                coordinates: [30.12345, 40.54321], // Add the coordinates field to the update payload
            })
            .expect(200);

        expect(res.body.message).toBe('Client updated successfully');
        expect(res.body.client.full_name).toBe('Jane Doe');
        expect(res.body.client.email).toBe('janedoe@example.com');
        expect(res.body.client.telefone).toBe('123456789'); // Check the updated telefone field
        expect([res.body.client.coordinates.x, res.body.client.coordinates.y]).toEqual([30.12345, 40.54321]); // Check the updated coordinates field
    });

    it('should return an error if the client does not exist', async () => {
        const res = await request(app)
            .put('/clients/999')
            .send({
                fullName: 'Jane Doe',
                email: 'janedoe@example.com',
                telefone: '123456789',
                coordinates: [30.12345, 40.54321],
            })
            .expect(404);

        expect(res.body.message).toBe('Client with ID 999 not found');
    });

    afterAll(async () => {
        await pool.query('DELETE FROM clients');
        server.close();
    });
});

// LIST
// clients and common errors
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
                telefone: `${i}123456789`,
                coordinates: [30.12345, 40.54321],
            });
            await pool
                .query('INSERT INTO clients (full_name, email, telefone, coordinates) VALUES ($1, $2, $3, POINT($4, $5))',
                    [clients[i]['fullName'], clients[i]['email'], clients[i]['telefone'], clients[i]['coordinates'][0], clients[i]['coordinates'][1]]);
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
    afterAll((done) => {
        server.close(done);
    });
});

// READ
// client and common error
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
            ['Johni Doe', 'johnssoe@example.com', '123456789', 30.12345, 40.54321]
        );
        client = res.rows[0];
    });

    afterAll(async () => {
        // delete the client created for the test
        await pool.query('DELETE FROM clients WHERE id = $1', [client.id]);
        await pool.end();
    });

    it('should return a client by ID', async () => {
        const res = await request(app).get(`/clients/${client.id}`).expect(200);

        expect(res.body.client.full_name).toEqual('Johni Doe');
        expect(res.body.client.email).toEqual('johnssoe@example.com');
        expect(res.body.client.telefone).toEqual('123456789'); // Check the telefone field
        expect([res.body.client.coordinates.x, res.body.client.coordinates.y]).toEqual([30.12345, 40.54321]); // Check the coordinates field
    });

    it('should return 404 if client not found', async () => {
        const res = await request(app).get('/clients/9999').expect(404);

        expect(res.body.message).toEqual('Client not found');
    });

    afterAll(() => {
        server.close();
    });
});


// UPLOAD
// many clients
describe('POST /clients/import', () => {
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
            ['Johni Doe', 'johnssoe@example.com', '123456789', 30.12345, 40.54321]
        );
        client = res.rows[0];
    });

    afterAll(async () => {
        // delete the client created for the test
        await pool.query('DELETE FROM clients;');
        await pool.end();
    });
    
    beforeEach(async () => {
        // Delete all clients before each test
        await pool.query('DELETE FROM clients');
    });

    it('should import a file with clients successfully', async () => {
        const res = await request(app)
            .post('/clients/import')
            .attach('file', `${__dirname}\\a_default.txt`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('File imported successfully');
        expect(res.body.data.length).toBe(2);

        // Validate imported clients in the database
        const clientsInDatabase = await pool.query('SELECT * FROM clients');
        expect(clientsInDatabase.rows.length).toBe(2);
        expect(clientsInDatabase.rows[0].full_name).toBe('John Doe'); // Update with actual values from your file
        expect(clientsInDatabase.rows[1].email).toBe('jane.doe@example.com'); // Update with actual values from your file
    });

    afterAll(() => {
        server.close();
    });
});
/**/