const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getProjects, addProject } = require('../lib/db.cjs');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ projects: getProjects() });
});

router.post('/', (req, res) => {
  const { name, repoUrl } = req.body || {};
  if (!name || !repoUrl) {
    return res.status(400).json({ error: 'name and repoUrl are required' });
  }
  const project = { id: uuidv4(), name, repoUrl, createdAt: new Date().toISOString() };
  addProject(project);
  res.status(201).json({ project });
});

module.exports = router;

