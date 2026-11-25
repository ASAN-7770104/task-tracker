// four arguments, so Express treats this as an error handler
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err.stack);

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong. Please try again later.' : err.message;

  res.status(status).render('error', { title: 'Error', status, message });
}

module.exports = errorHandler;
