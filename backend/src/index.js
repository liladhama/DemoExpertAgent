require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000; // можно оставить 5000, любой дефолт, главное process.env.PORT

app.use(express.json());
app.use(cors());

// Проверочный route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Express сервер работает!' });
});

// ------
// Здесь добавляй свои API-роуты, например:
// app.post('/api/dialog', (req, res) => { ... });
// ------

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});