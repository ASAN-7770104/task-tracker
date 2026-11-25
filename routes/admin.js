const fs = require('fs');
const path = require('path');
const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const loadTask = require('../middleware/loadTask');
const { getUsers, getTasks, saveTasks } = require('../lib/store');

const router = express.Router();
const logFile = path.join(__dirname, '..', 'logs', 'access.log');

router.get('/', requireAuth, requireRole('admin'), (req, res) => {
  const tasks = getTasks();
  const counts = getUsers().map((user) => ({
    username: user.username,
    total: tasks.filter((task) => task.owner === user.username).length
  }));

  let logLines = [];
  if (fs.existsSync(logFile)) {
    logLines = fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean).slice(-10);
  }

  res.render('admin', { title: 'Admin', counts, tasks, logLines });
});

router.post('/tasks/:id/delete', requireAuth, requireRole('admin'), loadTask, (req, res) => {
  saveTasks(getTasks().filter((task) => task.id !== req.task.id));

  req.session.flash = 'Task deleted';
  res.redirect('/admin');
});

module.exports = router;
