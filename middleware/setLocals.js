// values that every view needs
function setLocals(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentYear = new Date().getFullYear();

  // the flash message is shown once and then removed from the session
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;

  next();
}

module.exports = setLocals;
