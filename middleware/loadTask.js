const { findTask } = require('../lib/store');

// M9: finds the task by :id and attaches it as req.task
function loadTask(req, res, next) {
  const task = findTask(Number(req.params.id));

  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    return next(err);
  }

  const user = req.session.user;
  if (user.role !== 'admin' && task.owner !== user.username) {
    const err = new Error('You are not allowed to open this task');
    err.status = 403;
    return next(err);
  }

  req.task = task;
  next();
}

module.exports = loadTask;
