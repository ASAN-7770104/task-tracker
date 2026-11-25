const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'access.log');

fs.mkdirSync(LOG_DIR, { recursive: true });

// M1: logs every request AFTER the response has been sent,
// so the real status code and the duration are known.
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    const user = req.session && req.session.user;
    // after logout the session is already destroyed, the logout route leaves the name in res.locals
    const who = user ? user.username : (res.locals.loggedOutUser || 'guest');
    const line = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms - ${who}`;

    console.log(line);
    fs.appendFile(LOG_FILE, line + '\n', (err) => {
      if (err) console.error('Could not write access.log:', err.message);
    });
  });

  next();
}

module.exports = requestLogger;
