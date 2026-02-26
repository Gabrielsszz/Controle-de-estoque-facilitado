const express = require('express');
const app = express();

app.use(express.json());

const stockRoutes = require('./src/routes/stock.routes');

app.use('/api/stock', stockRoutes);

module.exports = app; 