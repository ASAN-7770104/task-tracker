const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const validateTask = require('../middleware/validateTask');
const loadTask = require('../middleware/loadTask');
const { getTasks, saveTasks, tasksForUser } = require('../lib/store');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const statusFilter = req.query.status || '';

  res.render('tasks', {
    title: 'Tasks',
    tasks: tasksForUser(req.session.user, statusFilter),
    statusFilter,
    errors: [],
    input: { title: '', priority: 'medium', due: '' }
  });
});

router.post('/', requireAuth, validateTask, (req, res) => {
  const tasks = getTasks();
  const newId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

  tasks.push({
    id: newId,
    title: req.newTask.title,
    priority: req.newTask.priority,
    due: req.newTask.due,
    status: 'open',
    owner: req.session.user.username
  });
  saveTasks(tasks);

  req.session.flash = 'Task added';
  res.redirect('/tasks');
});

router.get('/:id', requireAuth, loadTask, (req, res) => {
  res.render('task', { title: req.task.title, task: req.task });
});

router.post('/:id/done', requireAuth, loadTask, (req, res) => {
  const tasks = getTasks();
  tasks.find((task) => task.id === req.task.id).status = 'done';
  saveTasks(tasks);

  req.session.flash = 'Task marked as done';
  res.redirect('/tasks');
});

module.exports = router;
