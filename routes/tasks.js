const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const validateTask = require('../middleware/validateTask');
const loadTask = require('../middleware/loadTask');
const { getTasks, saveTasks, tasksForUser } = require('../lib/store');

const router = express.Router();

// router-level: every route below needs a logged-in user
router.use(requireAuth);

router.get('/', (req, res) => {
  const statusFilter = req.query.status || '';
  res.render('tasks', {
    title: 'Tasks',
    tasks: tasksForUser(req.session.user, statusFilter),
    statusFilter,
    errors: [],
    input: { title: '', priority: 'medium', due: '' }
  });
});

router.post('/', validateTask, (req, res) => {
  const tasks = getTasks();
  const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;

  tasks.push({
    id: nextId,
    title: req.validTask.title,
    priority: req.validTask.priority,
    due: req.validTask.due,
    status: 'open',
    owner: req.session.user.username
  });
  saveTasks(tasks);

  req.session.flash = 'Task added';
  res.redirect('/tasks');
});

router.get('/:id', loadTask, (req, res) => {
  res.render('task', { title: req.task.title, task: req.task });
});

router.post('/:id/done', loadTask, (req, res) => {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === req.task.id);
  task.status = 'done';
  saveTasks(tasks);

  req.session.flash = 'Task marked as done';
  res.redirect('/tasks');
});

module.exports = router;
