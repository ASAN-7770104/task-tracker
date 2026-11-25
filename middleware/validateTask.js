const { tasksForUser } = require('../lib/store');

const PRIORITIES = ['low', 'medium', 'high'];

// true only for a real calendar date written as YYYY-MM-DD (rejects 2026-02-30)
function isRealDate(text) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const date = new Date(text);
  return !isNaN(date) && date.toISOString().slice(0, 10) === text;
}

function validateTask(req, res, next) {
  const input = {
    title: (req.body.title || '').trim(),
    priority: req.body.priority || '',
    due: (req.body.due || '').trim()
  };
  const today = new Date().toLocaleDateString('en-CA'); // local date as YYYY-MM-DD
  const errors = [];

  if (input.title.length < 3 || input.title.length > 60) {
    errors.push('Title must be between 3 and 60 characters');
  }

  if (!PRIORITIES.includes(input.priority)) {
    errors.push('Priority must be low, medium or high');
  }

  if (!isRealDate(input.due)) {
    errors.push('Due date must be a real date in the format YYYY-MM-DD');
  } else if (input.due < today) {
    errors.push('Due date cannot be in the past');
  }

  if (errors.length > 0) {
    return res.status(400).render('tasks', {
      title: 'Tasks',
      tasks: tasksForUser(req.session.user, ''),
      statusFilter: '',
      errors,
      input
    });
  }

  req.newTask = input;
  next();
}

module.exports = validateTask;
