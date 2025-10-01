import { Router, Request, Response, NextFunction } from 'express';
import ProjectService from '../services/ProjectService';
import { CreateProjectRequest } from '../models/Project';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/projects - Get all projects
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const project = await ProjectService.getProjectById(id);
    
    if (!project) {
      throw createError('Project not found', 404);
    }
    
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Create new project
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectData: CreateProjectRequest = req.body;
    
    // Basic validation
    if (!projectData.name || !projectData.repository || !projectData.framework) {
      throw createError('Missing required fields: name, repository, framework', 400);
    }
    
    // Validate project name (alphanumeric and hyphens only)
    if (!/^[a-zA-Z0-9-]+$/.test(projectData.name)) {
      throw createError('Project name can only contain letters, numbers, and hyphens', 400);
    }
    
    const project = await ProjectService.createProject(projectData);
    
    // Trigger initial deployment
    const deployment = await ProjectService.createDeployment(project.id);
    
    res.status(201).json({
      project,
      deployment
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const project = await ProjectService.updateProject(id, updates);
    
    if (!project) {
      throw createError('Project not found', 404);
    }
    
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await ProjectService.deleteProject(id);
    
    if (!deleted) {
      throw createError('Project not found', 404);
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id/deployments - Get project deployments
router.get('/:id/deployments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Check if project exists
    const project = await ProjectService.getProjectById(id);
    if (!project) {
      throw createError('Project not found', 404);
    }
    
    const deployments = await ProjectService.getProjectDeployments(id);
    res.json(deployments);
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/deployments - Create new deployment
router.post('/:id/deployments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { commit, branch } = req.body;
    
    // Check if project exists
    const project = await ProjectService.getProjectById(id);
    if (!project) {
      throw createError('Project not found', 404);
    }
    
    const deployment = await ProjectService.createDeployment(id, commit, branch);
    res.status(201).json(deployment);
  } catch (error) {
    next(error);
  }
});

export default router;