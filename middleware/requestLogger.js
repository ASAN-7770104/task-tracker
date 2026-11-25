const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDir, 'access.log');

fs.mkdirSync(logDir, { recursive: true });

// writes one line per request once the response has been sent
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    // after logout the session is already destroyed, so fall back to res.locals
    const user = (req.session && req.session.user) || res.locals.currentUser;
    const who = user ? user.username : 'guest';
    const line = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms - ${who}`;

    console.log(line);
    fs.appendFile(logFile, line + '\n', (err) => {
      if (err) console.error(err);
    });
  });

  next();
}

module.exports = requestLogger;
