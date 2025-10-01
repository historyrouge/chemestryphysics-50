const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDeployments, addDeployment } = require('../lib/db.cjs');

module.exports = function(createBuild) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({ deployments: getDeployments() });
  });

  router.post('/', async (req, res) => {
    const { projectId } = req.body || {};
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }
    const deployment = {
      id: uuidv4(),
      projectId,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };
    addDeployment(deployment);

    setImmediate(() => createBuild(deployment));

    res.status(201).json({ deployment });
  });

  return router;
};

