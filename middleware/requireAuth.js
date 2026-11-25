function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.flash = 'Please log in first';
    return res.redirect('/');
  }
  next();
}

module.exports = requireAuth;
