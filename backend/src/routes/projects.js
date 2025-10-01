const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');

const router = express.Router();

// In-memory project storage (in production, use a database)
const projects = [];

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common web file types
    const allowedTypes = /jpeg|jpg|png|gif|svg|css|js|html|json|txt|md|ts|tsx|jsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

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

// Get all projects for user
router.get('/', verifyToken, (req, res) => {
  const userProjects = projects.filter(project => project.userId === req.user.userId);
  res.json(userProjects);
});

// Create new project
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, framework } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    // Check if project name already exists for this user
    const existingProject = projects.find(
      project => project.name === name && project.userId === req.user.userId
    );
    
    if (existingProject) {
      return res.status(400).json({ message: 'Project name already exists' });
    }

    const project = {
      id: uuidv4(),
      name,
      description: description || '',
      framework: framework || 'Static',
      userId: req.user.userId,
      status: 'building',
      url: `https://${name}.vercel-clone.com`,
      createdAt: new Date().toISOString(),
      lastDeployed: new Date().toISOString()
    };

    projects.push(project);

    // Simulate build process
    setTimeout(() => {
      const projectIndex = projects.findIndex(p => p.id === project.id);
      if (projectIndex !== -1) {
        projects[projectIndex].status = 'ready';
      }
    }, 3000);

    res.status(201).json(project);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get project by ID
router.get('/:id', verifyToken, (req, res) => {
  const project = projects.find(
    p => p.id === req.params.id && p.userId === req.user.userId
  );

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json(project);
});

// Update project
router.put('/:id', verifyToken, (req, res) => {
  const projectIndex = projects.findIndex(
    p => p.id === req.params.id && p.userId === req.user.userId
  );

  if (projectIndex === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const { name, description, framework } = req.body;
  
  if (name) projects[projectIndex].name = name;
  if (description !== undefined) projects[projectIndex].description = description;
  if (framework) projects[projectIndex].framework = framework;

  res.json(projects[projectIndex]);
});

// Delete project
router.delete('/:id', verifyToken, (req, res) => {
  const projectIndex = projects.findIndex(
    p => p.id === req.params.id && p.userId === req.user.userId
  );

  if (projectIndex === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  projects.splice(projectIndex, 1);
  res.json({ message: 'Project deleted successfully' });
});

// Upload files to project
router.post('/:id/upload', verifyToken, upload.array('files', 10), async (req, res) => {
  try {
    const project = projects.find(
      p => p.id === req.params.id && p.userId === req.user.userId
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Create project directory
    const projectDir = path.join(__dirname, '../../deployments', project.id);
    await fs.mkdir(projectDir, { recursive: true });

    // Move uploaded files to project directory
    for (const file of req.files) {
      const destPath = path.join(projectDir, file.originalname);
      await fs.rename(file.path, destPath);
    }

    // Update project status
    project.status = 'building';
    project.lastDeployed = new Date().toISOString();

    // Simulate build process
    setTimeout(() => {
      project.status = 'ready';
    }, 2000);

    res.json({ 
      message: 'Files uploaded successfully',
      project 
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Download project as ZIP
router.get('/:id/download', verifyToken, async (req, res) => {
  try {
    const project = projects.find(
      p => p.id === req.params.id && p.userId === req.user.userId
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const projectDir = path.join(__dirname, '../../deployments', project.id);
    
    try {
      await fs.access(projectDir);
    } catch {
      return res.status(404).json({ message: 'Project files not found' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    archive.directory(projectDir, false);
    await archive.finalize();
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;