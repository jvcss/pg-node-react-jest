const { Pool } = require('pg');

// // Check if required environment variables are defined
// const requiredEnvVars = ['PGHOST', 'PGPORT', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];
// const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

// if (missingEnvVars.length > 0) {
//     throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
// }

const pool = new Pool({
    host: (process.env.PGHOST || 'localhost'),
    port: (process.env.PGPORT || 5432),
    database: (process.env.PGDATABASE || 'clients'),
    user: (process.env.PGUSER || 'postgres'),
    password: (process.env.PGPASSWORD || 'postgres')
});


module.exports = pool;