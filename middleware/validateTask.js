const { tasksForUser } = require('../lib/store');

const PRIORITIES = ['low', 'medium', 'high'];

function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// real calendar date in YYYY-MM-DD format? (rejects 2026-02-31)
function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// M8: title 3-60 chars, priority low/medium/high, due is a valid date not in the past
function validateTask(req, res, next) {
  const input = {
    title: String(req.body.title || '').trim(),
    priority: String(req.body.priority || ''),
    due: String(req.body.due || '')
  };
  const errors = [];

  if (input.title.length < 3 || input.title.length > 60) {
    errors.push('Title must be between 3 and 60 characters.');
  }
  if (!PRIORITIES.includes(input.priority)) {
    errors.push('Priority must be low, medium or high.');
  }
  if (!isValidDate(input.due)) {
    errors.push('Due date must be a valid date (YYYY-MM-DD).');
  } else if (input.due < todayString()) {
    errors.push('Due date cannot be in the past.');
  }

  if (errors.length > 0) {
    return res.status(400).render('tasks', {
      title: 'Tasks',
      tasks: tasksForUser(req.session.user),
      statusFilter: '',
      errors,
      input
    });
  }

  req.validTask = input;
  next();
}

module.exports = validateTask;
