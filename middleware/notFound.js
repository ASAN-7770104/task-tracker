// M10: nothing above matched the URL
function notFound(req, res) {
  res.status(404).render('404', { title: 'Not found', url: req.originalUrl });
}

module.exports = notFound;
