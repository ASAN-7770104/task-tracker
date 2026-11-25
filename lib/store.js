const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(value, null, 2));
}

function getUsers() {
  return readJson('users.json');
}

function getTasks() {
  return readJson('tasks.json');
}

function saveTasks(tasks) {
  writeJson('tasks.json', tasks);
}

function findTask(id) {
  return getTasks().find((task) => task.id === id);
}

// students get their own tasks, admin gets all of them
function tasksForUser(user, status) {
  let tasks = getTasks();

  if (user.role !== 'admin') {
    tasks = tasks.filter((task) => task.owner === user.username);
  }
  if (status === 'open' || status === 'done') {
    tasks = tasks.filter((task) => task.status === status);
  }

  return tasks;
}

module.exports = { getUsers, getTasks, saveTasks, findTask, tasksForUser };
