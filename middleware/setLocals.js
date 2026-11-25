// M4: data that every view needs, so we don't pass it in each res.render()
function setLocals(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentYear = new Date().getFullYear();

  // flash message lives in the session until the next page reads it once
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;

  next();
}

module.exports = setLocals;
