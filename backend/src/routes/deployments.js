const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// In-memory deployment storage (in production, use a database)
const deployments = [];

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all deployments for user
router.get('/', verifyToken, (req, res) => {
  const userDeployments = deployments.filter(
    deployment => deployment.userId === req.user.userId
  );
  res.json(userDeployments);
});

// Get deployments for a specific project
router.get('/project/:projectId', verifyToken, (req, res) => {
  const projectDeployments = deployments.filter(
    deployment => 
      deployment.projectId === req.params.projectId && 
      deployment.userId === req.user.userId
  );
  res.json(projectDeployments);
});

// Create new deployment
router.post('/', verifyToken, async (req, res) => {
  try {
    const { projectId, branch = 'main', commitMessage = 'Manual deployment' } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const deployment = {
      id: uuidv4(),
      projectId,
      userId: req.user.userId,
      branch,
      commitMessage,
      status: 'building',
      url: `https://${projectId}-${Date.now()}.vercel-clone.com`,
      createdAt: new Date().toISOString(),
      completedAt: null,
      logs: []
    };

    deployments.push(deployment);

    // Simulate build process with logs
    const buildLogs = [
      'Starting deployment...',
      'Installing dependencies...',
      'Building project...',
      'Optimizing assets...',
      'Deploying to edge...',
      'Deployment complete!'
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < buildLogs.length) {
        deployment.logs.push({
          timestamp: new Date().toISOString(),
          message: buildLogs[logIndex],
          level: 'info'
        });
        logIndex++;
      } else {
        clearInterval(logInterval);
        deployment.status = 'ready';
        deployment.completedAt = new Date().toISOString();
      }
    }, 1000);

    res.status(201).json(deployment);
  } catch (error) {
    console.error('Deployment creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get deployment by ID
router.get('/:id', verifyToken, (req, res) => {
  const deployment = deployments.find(
    d => d.id === req.params.id && d.userId === req.user.userId
  );

  if (!deployment) {
    return res.status(404).json({ message: 'Deployment not found' });
  }

  res.json(deployment);
});

// Get deployment logs
router.get('/:id/logs', verifyToken, (req, res) => {
  const deployment = deployments.find(
    d => d.id === req.params.id && d.userId === req.user.userId
  );

  if (!deployment) {
    return res.status(404).json({ message: 'Deployment not found' });
  }

  res.json({ logs: deployment.logs });
});

// Cancel deployment
router.post('/:id/cancel', verifyToken, (req, res) => {
  const deployment = deployments.find(
    d => d.id === req.params.id && d.userId === req.user.userId
  );

  if (!deployment) {
    return res.status(404).json({ message: 'Deployment not found' });
  }

  if (deployment.status === 'ready' || deployment.status === 'error') {
    return res.status(400).json({ message: 'Deployment cannot be cancelled' });
  }

  deployment.status = 'cancelled';
  deployment.completedAt = new Date().toISOString();
  deployment.logs.push({
    timestamp: new Date().toISOString(),
    message: 'Deployment cancelled by user',
    level: 'warning'
  });

  res.json(deployment);
});

// Redeploy
router.post('/:id/redeploy', verifyToken, async (req, res) => {
  try {
    const originalDeployment = deployments.find(
      d => d.id === req.params.id && d.userId === req.user.userId
    );

    if (!originalDeployment) {
      return res.status(404).json({ message: 'Deployment not found' });
    }

    const newDeployment = {
      id: uuidv4(),
      projectId: originalDeployment.projectId,
      userId: req.user.userId,
      branch: originalDeployment.branch,
      commitMessage: `Redeploy of ${originalDeployment.commitMessage}`,
      status: 'building',
      url: `https://${originalDeployment.projectId}-${Date.now()}.vercel-clone.com`,
      createdAt: new Date().toISOString(),
      completedAt: null,
      logs: []
    };

    deployments.push(newDeployment);

    // Simulate build process
    setTimeout(() => {
      newDeployment.status = 'ready';
      newDeployment.completedAt = new Date().toISOString();
    }, 3000);

    res.status(201).json(newDeployment);
  } catch (error) {
    console.error('Redeploy error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete deployment
router.delete('/:id', verifyToken, (req, res) => {
  const deploymentIndex = deployments.findIndex(
    d => d.id === req.params.id && d.userId === req.user.userId
  );

  if (deploymentIndex === -1) {
    return res.status(404).json({ message: 'Deployment not found' });
  }

  deployments.splice(deploymentIndex, 1);
  res.json({ message: 'Deployment deleted successfully' });
});

module.exports = router;