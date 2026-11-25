const fs = require('fs');
const path = require('path');
const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const loadTask = require('../middleware/loadTask');
const { getUsers, getTasks, saveTasks } = require('../lib/store');

const router = express.Router();
const LOG_FILE = path.join(__dirname, '..', 'logs', 'access.log');

// router-level: requireAuth first, then the role check
router.use(requireAuth, requireRole('admin'));

router.get('/', (req, res) => {
  const tasks = getTasks();
  const counts = getUsers().map((u) => ({
    username: u.username,
    total: tasks.filter((t) => t.owner === u.username).length
  }));

  let logLines = [];
  if (fs.existsSync(LOG_FILE)) {
    logLines = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(Boolean).slice(-10);
  }

  res.render('admin', { title: 'Admin', counts, logLines });
});

router.post('/tasks/:id/delete', loadTask, (req, res) => {
  const tasks = getTasks().filter((t) => t.id !== req.task.id);
  saveTasks(tasks);

  req.session.flash = 'Task deleted';
  res.redirect('/admin');
});

module.exports = router;
