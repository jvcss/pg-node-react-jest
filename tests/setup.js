const { Pool } = require('pg');

const createDbConnection = async () => {
  const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'clients',
  });

  const client = await pool.connect();

  return {
    pool,
    client,
  };
};

module.exports = { createDbConnection };
