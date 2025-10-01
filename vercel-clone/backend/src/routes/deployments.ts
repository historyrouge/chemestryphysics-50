import { Router, Request, Response, NextFunction } from 'express';
import ProjectService from '../services/ProjectService';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/deployments/:id - Get deployment by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deployment = await ProjectService.getDeploymentById(id);
    
    if (!deployment) {
      throw createError('Deployment not found', 404);
    }
    
    res.json(deployment);
  } catch (error) {
    next(error);
  }
});

// GET /api/deployments/:id/logs - Get deployment logs
router.get('/:id/logs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deployment = await ProjectService.getDeploymentById(id);
    
    if (!deployment) {
      throw createError('Deployment not found', 404);
    }
    
    // Generate mock logs based on deployment status
    let logs = '';
    
    if (deployment.status === 'building') {
      logs = `[${new Date().toISOString()}] Starting deployment...
[${new Date().toISOString()}] Cloning repository...
[${new Date().toISOString()}] Installing dependencies...
[${new Date().toISOString()}] Running build command...
[${new Date().toISOString()}] Build in progress...`;
    } else if (deployment.status === 'ready') {
      logs = `[${deployment.createdAt.toISOString()}] Starting deployment...
[${deployment.createdAt.toISOString()}] Cloning repository...
[${new Date(deployment.createdAt.getTime() + 5000).toISOString()}] Installing dependencies...
[${new Date(deployment.createdAt.getTime() + 15000).toISOString()}] Running build command: npm run build
[${new Date(deployment.createdAt.getTime() + 30000).toISOString()}] Build completed successfully
[${new Date(deployment.createdAt.getTime() + 31000).toISOString()}] Deploying to CDN...
[${deployment.completedAt?.toISOString()}] Deployment completed successfully
[${deployment.completedAt?.toISOString()}] Available at: ${deployment.url}`;
    } else if (deployment.status === 'error') {
      logs = `[${deployment.createdAt.toISOString()}] Starting deployment...
[${deployment.createdAt.toISOString()}] Cloning repository...
[${new Date(deployment.createdAt.getTime() + 5000).toISOString()}] Installing dependencies...
[${new Date(deployment.createdAt.getTime() + 15000).toISOString()}] Running build command: npm run build
[${new Date(deployment.createdAt.getTime() + 20000).toISOString()}] ERROR: ${deployment.buildLogs || 'Build failed'}
[${deployment.completedAt?.toISOString()}] Deployment failed`;
    } else {
      logs = `[${deployment.createdAt.toISOString()}] Deployment queued...`;
    }
    
    res.json({ logs });
  } catch (error) {
    next(error);
  }
});

// POST /api/deployments/:id/redeploy - Redeploy
router.post('/:id/redeploy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deployment = await ProjectService.getDeploymentById(id);
    
    if (!deployment) {
      throw createError('Deployment not found', 404);
    }
    
    // Create new deployment with same parameters
    const newDeployment = await ProjectService.createDeployment(
      deployment.projectId,
      deployment.commit,
      deployment.branch
    );
    
    res.status(201).json(newDeployment);
  } catch (error) {
    next(error);
  }
});

export default router;