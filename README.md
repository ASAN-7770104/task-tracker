# Student Task Tracker

Homework Assignment 2, Web Development 2. Express + EJS, every check is a middleware.

## How to run

```
npm install
node index.js
```

(or `npm start`). Open http://localhost:3000

## Test accounts

| Username | Password   | Role    |
|----------|------------|---------|
| student  | Backend123 | student |
| admin    | Admin2026  | admin   |

## Files

- `index.js` - connects the global middleware and the routers, nothing else
- `middleware/` - one file per middleware
- `routes/` - `auth.js`, `tasks.js`, `admin.js` (each one is an `express.Router()`)
- `lib/store.js` - reads and writes the JSON files in `data/` (I put it here so the three routers do not repeat the same code)
- `views/` - EJS pages, `views/partials/` - header, nav, footer
- `logs/access.log` - written by the request logger

## Middleware in the order they are registered

Global, in `index.js`:

1. **requestLogger** - the first thing, so every request is logged, including static files and 404s. It writes the line in `res.on('finish')`, so the status code and the duration are already known.
2. **express.static** - serves `public/` before any session work, so the CSS does not create sessions or go through the login checks.
3. **express.urlencoded** - has to be before the routes that read `req.body` (login and the task form).
4. **express-session** - creates `req.session`. It is after the static files on purpose, so static files do not start a session.
5. **setLocals** - after the session, because it reads `req.session.user` and the flash message. It puts `currentUser`, `currentYear` and `flash` into `res.locals` before any view is rendered.

Routers, in the order they are mounted:

6. **auth router (`/`)**
   - `GET /` - no middleware, it only redirects to `/tasks` if the user is already logged in.
   - **validateLogin** on `POST /login` - it checks the form first, so the handler does not need to check empty fields.
   - **requireAuth** on `POST /logout` - you can only log out if you are logged in.
7. **tasks router (`/tasks`)**
   - **requireAuth** on every route - it goes first so that an anonymous user never reaches the validation or the database.
   - **validateTask** on `POST /tasks` - it runs after requireAuth, because the error page needs the logged-in user's task list.
   - **loadTask** on `/:id` and `/:id/done` - it runs after requireAuth, because it checks the owner of the task against the session.
8. **admin router (`/admin`)**
   - **requireAuth** then **requireRole('admin')** - first "is anyone logged in", then "is this an admin". The order is important, because `requireRole` reads `req.session.user`.
   - **loadTask** on `/tasks/:id/delete` - after both checks, so no task is looked at before the role check.

Route and error handling, last:

9. **/crash-test** - a route that throws on purpose, to show that the error handler works. It is before the 404 handler, otherwise it would never be reached.
10. **notFound** - runs only when no route matched the URL, so it has to be after all the routes.
11. **errorHandler** - the last middleware, so it catches errors from everything above it. It has four arguments, which is how Express knows it is an error handler.

## Notes

- The flash message is saved in the session by one request and removed by `setLocals` in the next one, so it is shown once.
- After logout the session is gone, so the log line for `POST /logout` gets the username from `res.locals.currentUser`. Without this it would say `guest`.
- Passwords are stored in plain text, as the assignment says.
