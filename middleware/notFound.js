function notFound(req, res) {
  res.status(404).render('404', { title: 'Not found', url: req.originalUrl });
}

module.exports = notFound;
