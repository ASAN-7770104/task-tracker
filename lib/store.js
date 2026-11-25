const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, '..', 'data', 'tasks.json');
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function getUsers() {
  return readJson(USERS_FILE);
}

function getTasks() {
  return readJson(TASKS_FILE);
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function findTask(id) {
  return getTasks().find((t) => t.id === id);
}

// students see their own tasks, admin sees everything
function tasksForUser(user, status) {
  let tasks = getTasks();
  if (user.role !== 'admin') {
    tasks = tasks.filter((t) => t.owner === user.username);
  }
  if (status === 'open' || status === 'done') {
    tasks = tasks.filter((t) => t.status === status);
  }
  return tasks;
}

module.exports = { getUsers, getTasks, saveTasks, findTask, tasksForUser };
