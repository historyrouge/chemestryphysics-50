const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'db.json');

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ projects: [], deployments: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getProjects() {
  return readDb().projects;
}

function getProjectById(id) {
  return readDb().projects.find((p) => p.id === id);
}

function addProject(project) {
  const db = readDb();
  db.projects.push(project);
  writeDb(db);
  return project;
}

function getDeployments() {
  return readDb().deployments;
}

function getDeploymentById(id) {
  return readDb().deployments.find((d) => d.id === id);
}

function addDeployment(deployment) {
  const db = readDb();
  db.deployments.push(deployment);
  writeDb(db);
  return deployment;
}

function updateDeployment(id, patch) {
  const db = readDb();
  const idx = db.deployments.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  db.deployments[idx] = { ...db.deployments[idx], ...patch };
  writeDb(db);
  return db.deployments[idx];
}

module.exports = {
  getProjects,
  getProjectById,
  addProject,
  getDeployments,
  getDeploymentById,
  addDeployment,
  updateDeployment,
};

