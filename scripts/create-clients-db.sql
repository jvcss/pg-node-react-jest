SELECT 'CREATE DATABASE clients' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'clients');

CREATE SCHEMA IF NOT EXISTS clients;
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT, -- Add the telephone field, assuming it can be optional
  coordinates POINT -- Assuming you want to store coordinates as a point type
);