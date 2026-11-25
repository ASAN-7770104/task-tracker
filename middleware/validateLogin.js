function validateLogin(req, res, next) {
  const username = (req.body.username || '').trim();
  const password = req.body.password || '';

  if (!username || !password) {
    return res.status(400).render('login', {
      title: 'Login',
      error: 'Username and password are required',
      username
    });
  }

  if (username.length < 3) {
    return res.status(400).render('login', {
      title: 'Login',
      error: 'Username must be at least 3 characters',
      username
    });
  }

  req.body.username = username;
  next();
}

module.exports = validateLogin;
