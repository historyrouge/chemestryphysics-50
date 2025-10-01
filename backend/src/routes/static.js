const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

// Serve static files for deployed projects
router.get('/:projectId/*', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const filePath = req.params[0] || 'index.html';
    
    // Security check - prevent directory traversal
    if (filePath.includes('..') || filePath.includes('~')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const fullPath = path.join(__dirname, '../../deployments', projectId, filePath);
    
    try {
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        // If it's a directory, try to serve index.html
        const indexPath = path.join(fullPath, 'index.html');
        try {
          await fs.access(indexPath);
          return res.sendFile(path.resolve(indexPath));
        } catch {
          return res.status(404).json({ message: 'Directory listing not allowed' });
        }
      }
      
      // Serve the file
      res.sendFile(path.resolve(fullPath));
    } catch (error) {
      // File not found, try to serve index.html as fallback
      const indexPath = path.join(__dirname, '../../deployments', projectId, 'index.html');
      try {
        await fs.access(indexPath);
        res.sendFile(path.resolve(indexPath));
      } catch {
        res.status(404).json({ message: 'File not found' });
      }
    }
  } catch (error) {
    console.error('Static file serving error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Serve project root
router.get('/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const indexPath = path.join(__dirname, '../../deployments', projectId, 'index.html');
    
    try {
      await fs.access(indexPath);
      res.sendFile(path.resolve(indexPath));
    } catch {
      res.status(404).json({ message: 'Project not found or no index.html' });
    }
  } catch (error) {
    console.error('Project serving error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;