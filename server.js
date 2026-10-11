const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'landing.html'));
});

app.get('/letter', (_req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'letter.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'pages', 'landing.html'));
});

app.listen(port, () => {
  console.log(`Birthday app running at http://localhost:${port}`);
});
