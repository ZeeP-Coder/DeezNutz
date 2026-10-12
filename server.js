const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const loginUsername = process.env.LOGIN_USERNAME || 'kyren';
const loginPassword = process.env.LOGIN_PASSWORD || 'marble-orbit-583!';

const loginPage = path.join(__dirname, 'frontend', 'pages', 'login.html');
const landingPage = path.join(__dirname, 'frontend', 'pages', 'landing.html');
const letterPage = path.join(__dirname, 'frontend', 'pages', 'letter.html');

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req, res) => {
  res.sendFile(loginPage);
});

app.post('/login', (req, res) => {
  const isValid = req.body.username === loginUsername && req.body.password === loginPassword;

  if (!isValid) {
    res.redirect('/?error=1');
    return;
  }

  res.setHeader(
    'Set-Cookie',
    'birthday_auth=1; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600'
  );
  res.redirect('/landing');
});

const isAuthenticated = (req) => req.headers.cookie?.includes('birthday_auth=1');

app.get('/landing', (req, res) => {
  if (!isAuthenticated(req)) {
    res.redirect('/');
    return;
  }

  res.sendFile(landingPage);
});

app.get('/letter', (req, res) => {
  if (!isAuthenticated(req)) {
    res.redirect('/');
    return;
  }

  res.sendFile(letterPage);
});

app.get('*', (_req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Birthday app running at http://localhost:${port}`);
});
