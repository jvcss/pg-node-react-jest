const express = require('express');
const router = express.Router();
const handleError = require('../utils/handleError');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const pool = require('../database/index');
const fs = require('fs');
const { parse } = require('csv-parse');
const haversine = require('../utils/simple_math');
// Create a client
router.post('/', async (req, res, next) => {
    try {
        const { fullName, email, telefone, coordinates } = req.body;

        const client = await pool.query(
            'INSERT INTO clients (full_name, email, telefone, coordinates) VALUES ($1, $2, $3, POINT($4, $5)) RETURNING *',
            [fullName, email, telefone, coordinates[0], coordinates[1]]
        );

        res.status(201).json({ message: 'Client created successfully', client: client.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            // Unique key violation
            res.status(409).json({ message: 'Client with the given email already exists' });
        } else if (err.code === '23502') {
            // Not null violation
            res.status(400).json({ message: 'Missing required fields' });
        } else {
            next(err);
        }
    }
});

// Edit a client
router.put('/:clientId', async (req, res, next) => {
    try {
        const { fullName, email, telefone, coordinates } = req.body;
        const clientId = req.params.clientId;
        cx = (coordinates.x, coordinates.y || coordinates[0])
        cy = (coordinates.x, coordinates.y || coordinates[1])
        const client = await pool.query(
            'UPDATE clients SET full_name = $1, email = $2, telefone = $3, coordinates = POINT($4, $5) WHERE id = $6 RETURNING *',
            [fullName, email, telefone, cx, cy, clientId]
        );

        if (!client.rows[0]) {
            res.status(404).json({ message: `Client with ID ${clientId} not found` });
        } else {
            res.status(200).json({ message: 'Client updated successfully', client: client.rows[0] });
        }
    } catch (err) {
        next(err);
    }
});


// List clients with pagination
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const clients = await pool.query('SELECT * FROM clients LIMIT $1 OFFSET $2', [limit, offset]);

        if (clients.rows.length === 0) {
            res.status(404).json({ message: 'No clients found in this page.' });
        } else {
            res.json({ clients: clients.rows });
        }
    } catch (err) {
        next(err);
    }
});

// Delete a client
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const client = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);

        if (client.rows.length === 0) {
            return res.status(404).json({ error: `Client with ID ${id} does not exist` });
        }

        res.json({ message: 'Client deleted successfully', client: client.rows[0] });
    } catch (err) {
        next(err);
    }
});

// Get a specific client
router.get('/:clientId', async (req, res, next) => {
    try {
        const clientId = req.params.clientId;
        const client = await pool.query('SELECT * FROM clients WHERE id = $1', [clientId]);

        if (client.rows.length === 0) {
            res.status(404).json({ message: 'Client not found' });
        } else {
            res.json({ client: client.rows[0] });
        }
    } catch (err) {
        next(err);
    }
});

// Import clients through file upload
router.post('/import', upload.single('file'), async (req, res, next) => {
    const client = await pool.connect(); // Start a transaction
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const clients = [];
        console.log(req.file, req.body)

        const parsedData = [];
        const fileContent = await fs.promises.readFile(req.file.path, { encoding: 'utf-8' });

        const lines = fileContent.split('\n');


        for (const line of lines) {
            const [fn, em, tl, cx, cy] = line.split(',');
            const fullName = fn.trim()
            const email = em.trim()
            const telefone = tl.trim()
            const coordinates0 = cx.trim()
            const coordinates1 = cy.trim()
            parsedData.push({ fullName, email, telefone, coordinates0, coordinates1 });
        }

        // Loop through rows and insert into the database
        for (const row of parsedData) {
            try {
                const { fullName, email, telefone, coordinates0, coordinates1 } = row;
                const result = await client.query(
                    'INSERT INTO clients (full_name, email, telefone, coordinates) VALUES ($1, $2, $3, POINT($4, $5)) RETURNING *',
                    [fullName, email, telefone, coordinates0, coordinates1]
                );
                clients.push(result.rows[0]);
            } catch (error) {
                // Handle individual client creation error if needed
                console.error(`Error creating client: ${error.message}`);
                // Rollback the transaction on any error
                await client.query('ROLLBACK');
                res.status(500).json({ message: `Internal Server Error: ${error.message}` });
                return;
            }
        }

        // Commit the transaction if all rows are inserted successfully
        await client.query('COMMIT');

        // Remove the temporary file
        fs.promises.unlink(req.file.path)
        //fs.unlink(req.file.path);

        res.json({ data: clients, message: 'File imported successfully' });
    } catch (err) {
        // Handle any other unexpected errors
        res.json({ data: null, message: 'File imported successfully' });
        await client.query('ROLLBACK');
        next(err);
    } finally {
        // Release the client back to the pool
        client.release();
    }
});

// Get clients close to a given position
router.get('/:latitude/:longitude/:radius', async (req, res, next) => {
    try {
        const { latitude, longitude, radius = 1 } = req.params;

        // Convert latitude, longitude, and radius to numbers
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const rad = parseFloat(radius);

        // Check if conversion was successful
        if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
            return res.status(400).json({ message: 'Invalid numeric values for latitude, longitude, or radius' });
        }
        const nearbyClients = await pool.query(
            'SELECT * FROM clients;',
        );
        // Calculate distances and sort the clients based on proximity
        const sortedClients = nearbyClients.rows.sort((a, b) => {
            const distanceA = haversine(lat, lon, a.coordinates.x, a.coordinates.y);
            const distanceB = haversine(lat, lon, b.coordinates.x, b.coordinates.y);
            return distanceA - distanceB;
        });
        res.json({ nearbyClients: sortedClients });
    } catch (err) {
        next(err);
    }
});


router.use(handleError);

module.exports = router;
