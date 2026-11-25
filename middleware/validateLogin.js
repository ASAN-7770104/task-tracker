// M5: checks the login form before the handler sees it
function validateLogin(req, res, next) {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  let error = null;
  if (!username || !password) {
    error = 'Username and password are required.';
  } else if (username.length < 3) {
    error = 'Username must be at least 3 characters.';
  }

  if (error) {
    return res.status(400).render('login', { title: 'Login', error, username });
  }

  req.body.username = username;
  next();
}

module.exports = validateLogin;
