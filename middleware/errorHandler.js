// M11: four arguments - that is how Express knows this is an error handler
function errorHandler(err, req, res, next) {
  console.error(err.stack || err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  // 4xx messages are written by us and safe to show, 5xx are hidden
  const message = status < 500 ? err.message : 'Something went wrong on our side. Please try again later.';

  res.status(status).render('error', { title: 'Error', status, message });
}

module.exports = errorHandler;
