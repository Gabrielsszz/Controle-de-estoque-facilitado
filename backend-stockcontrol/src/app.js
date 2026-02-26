console.log('Iniciando aplicação...');
require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/auth.routes');
const medicinesRoutes = require('./routes/medicines.routes');
const stockRoutes = require('./routes/stock.routes'); 

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/medicines', medicinesRoutes);
app.use('/stock', stockRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});