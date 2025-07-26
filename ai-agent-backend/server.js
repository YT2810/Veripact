process.env.GOOGLE_APPLICATION_CREDENTIALS = './service-account.json';
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const verifyRoute = require('./routes/verify');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/verify-transaction', verifyRoute);

app.listen(PORT, () => {
  console.log(`AI Agent backend running on http://localhost:${PORT}`);
});

