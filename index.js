const path = require('path');
const express = require('express');
const session = require('express-session');

const requestLogger = require('./middleware/requestLogger');
const setLocals = require('./middleware/setLocals');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/tasks');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = 3000;
const SESSION_SECRET = 'tasktracker-secret';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// global middleware, order matters
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }
}));
app.use(setLocals);

// routers
app.use('/', authRouter);
app.use('/tasks', tasksRouter);
app.use('/admin', adminRouter);

// used to check that errorHandler works
app.get('/crash-test', () => {
  throw new Error('Test crash');
});

// must be last
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Task Tracker is running on http://localhost:${PORT}`);
});
