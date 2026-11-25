# Student Task Tracker (Express middleware + EJS)

**English** · [Русский](README.ru.md)

Homework Assignment 2, Web Development 2.

## How to run

```bash
npm install
node index.js      # or: npm start
```

Then open http://localhost:3000

## Test logins

| Username | Password   | Role    |
|----------|------------|---------|
| student  | Backend123 | student |
| admin    | Admin2026  | admin   |

Extra routes to try: `/admin` (admin only), `/tasks/4` as student (403), `/tasks/999` (404),
`/crash-test` (500), any unknown URL (404 page).

## Project structure

```
index.js              only wires everything together
middleware/           one file per middleware
routes/               auth.js, tasks.js, admin.js (express.Router)
lib/store.js          small helper that reads / writes data/*.json
views/ + partials/    EJS pages and header / nav / footer
logs/access.log       written by requestLogger
```

I added `lib/store.js` (no new npm packages). It is only a few helper functions for reading and
writing the JSON files, so the same code is not copied into three routers.

## Middleware in the order they are registered

1. **requestLogger** (M1, app level) - first, so it sees every request, including static files, 404s and
   crashes. It waits for `res.on('finish')`, so the status code and duration are known when it logs.
2. **express.static('public')** (M2) - before the session and the routes, so CSS files are served
   directly and do not create sessions or run the auth checks.
3. **express.urlencoded** (M2) - must run before any route that reads `req.body` (login and task forms).
4. **express-session** (M3) - creates `req.session`. It has to be before `setLocals` and before every
   route that checks the user.
5. **setLocals** (M4) - needs `req.session`, so it comes right after it. It puts `currentUser`,
   `currentYear` and the one-time `flash` in `res.locals` before any route renders a view.
6. **routes/auth.js** at `/` - `GET /` and `POST /login` (uses **validateLogin**, M5, only on this route
   because only the login form needs it) and `POST /logout` (uses **requireAuth**, M6).
7. **routes/tasks.js** at `/tasks` - `router.use(requireAuth)` protects the whole router. Inside it
   **validateTask** (M8) is only on `POST /tasks` and **loadTask** (M9) only on routes with `:id`,
   after requireAuth because it reads `req.session.user` for the ownership check.
8. **routes/admin.js** at `/admin` - `router.use(requireAuth, requireRole('admin'))`: first "are you
   logged in", then "are you an admin". `loadTask` is last, on the delete route only.
   **requireRole** (M7) is a factory, `requireRole('admin')` returns the real middleware.
9. **/crash-test** route - just throws an error to show the error handler works. It is placed before
   the two handlers below so it can be reached.
10. **notFound** (M10) - registered after all routes: if nothing matched, the URL is unknown.
11. **errorHandler** (M11) - very last, it has 4 arguments and catches everything passed with
    `next(err)` or thrown above (404/403 from loadTask, the crash test). It logs the stack in the
    console and shows only a safe message in the page.

## Notes

- The flash message is saved in the session by one request and removed by `setLocals` in the next
  one, so it is displayed once in `header.ejs`.
- Logout: the session is destroyed, so the logger would see "guest". The logout route puts the name
  in `res.locals.loggedOutUser` so the log still shows who logged out.
- Static file requests are logged as `guest` because `express.static` is before the session
  middleware (see item 2).
- Passwords are plain text only because the assignment says so.
