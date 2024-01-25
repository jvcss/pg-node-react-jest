const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const clientsRouter = require('./routes/clients');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/clients', clientsRouter);
app.use('/healthz', express.Router().get('/', (req, res) => res.sendStatus(200)));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}/`);
});

module.exports = { app, server };