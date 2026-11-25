const path = require('path');
const express = require('express');
const session = require('express-session');

const requestLogger = require('./middleware/requestLogger');
const setLocals = require('./middleware/setLocals');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
// Set SESSION_SECRET in production; the fallback is for local development only.
const SESSION_SECRET = process.env.SESSION_SECRET || 'task-tracker-dev-secret';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// global middleware - the order matters, see README
app.use(requestLogger);                                        // M1
app.use(express.static(path.join(__dirname, 'public')));       // M2
app.use(express.urlencoded({ extended: false }));              // M2
app.use(session({                                              // M3
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }
}));
app.use(setLocals);                                            // M4

// routers
app.use('/', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/admin', adminRoutes);

// deliberately broken route to prove that errorHandler works
app.get('/crash-test', () => {
  throw new Error('Test crash');
});

// must stay last
app.use(notFound);        // M10
app.use(errorHandler);    // M11

app.listen(PORT, () => {
  console.log(`Task Tracker running on http://localhost:${PORT}`);
});
