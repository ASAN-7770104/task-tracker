const express = require('express');
const validateLogin = require('../middleware/validateLogin');
const requireAuth = require('../middleware/requireAuth');
const { getUsers } = require('../lib/store');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/tasks');
  }
  res.render('login', { title: 'Login', error: null, username: '' });
});

router.post('/login', validateLogin, (req, res) => {
  const { username, password } = req.body;
  const user = getUsers().find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).render('login', {
      title: 'Login',
      error: 'Invalid credentials',
      username
    });
  }

  req.session.user = { username: user.username, role: user.role };
  res.redirect('/tasks');
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
