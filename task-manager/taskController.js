const fs = require("fs");

const DB = "tasks.json";

function readTasks() {
  if (!fs.existsSync(DB)) return [];
  return JSON.parse(fs.readFileSync(DB, "utf8"));
}

function saveTasks(tasks) {
  fs.writeFileSync(DB, JSON.stringify(tasks, null, 2));
}

let tasks = readTasks();
let nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

function getAll() {
  return [...tasks].sort((a, b) => a.time.localeCompare(b.time));
}

function create(body) {
  const { title, category, time, completed } = body;
  if (!title || !title.trim()) return { error: "title requerido" };
  const newTask = {
    id: nextId++,
    title: title.trim(),
    category: category?.trim() || "general",
    time: time || "00:00",
    completed: completed ?? false
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

function update(id, body) {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  if (body.completed !== undefined) task.completed = body.completed;
  saveTasks(tasks);
  return task;
}

function remove(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  const deleted = tasks.splice(index, 1)[0];
  saveTasks(tasks);
  return deleted;
}

module.exports = { getAll, create, update, remove };