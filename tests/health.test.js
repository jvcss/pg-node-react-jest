const http = require("http");
const { createDbConnection } = require("./setup"); // Replace with the correct path

describe('Health Check', () => {
    // Test the server health
    it('should return a 200 status for server health check', (done) => {
        const options = {
            timeout: 2000,
            host: "localhost",
            port: process.env.PORT || 3000,
            path: "/healthz/", // must be the same as HEALTHCHECK in Dockerfile
        };

        const request = http.request(options, res => {
            expect(res.statusCode).toBe(200);
            done();
        });

        request.on("error", function(err) {
            done.fail(err);
        });

        request.end();
    });

    // Test the database integrity
    it('should connect to the database and query successfully', async () => {
        try {
            const { client, pool } = await createDbConnection();

            // Check a sample query (you can replace it with your own query)
            const result = await client.query('SELECT 1');

            expect(result.rows[0]['?column?']).toBe(1);

            // Close the database connections
            await client.release();
            await pool.end();
        } catch (error) {
            throw error;
        }
    });
});
