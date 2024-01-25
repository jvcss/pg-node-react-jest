const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const clientsRouter = require('./routes/clients');
const { createHealthCheckRouter } = require('./routes/middleware');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/clients', clientsRouter);
app.use('/healthz', createHealthCheckRouter);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}/`);
});

module.exports = { app, server };