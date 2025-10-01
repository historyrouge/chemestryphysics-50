import Docker from 'dockerode';
import simpleGit from 'simple-git';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import tar from 'tar-fs';

export interface DeploymentConfig {
  id: string;
  projectName: string;
  repository: string;
  branch: string;
  commit?: string;
  framework: string;
  buildCommand: string;
  outputDirectory: string;
  installCommand: string;
  rootDirectory: string;
}

export interface DeploymentResult {
  success: boolean;
  deploymentUrl?: string;
  error?: string;
  buildLogs: string[];
  duration: number;
}

export class DeploymentEngine {
  private docker: Docker;
  private workspaceDir: string;
  private deploymentsDir: string;

  constructor() {
    this.docker = new Docker();
    this.workspaceDir = process.env.WORKSPACE_DIR || '/tmp/deployments';
    this.deploymentsDir = process.env.DEPLOYMENTS_DIR || './deployments';
    
    // Ensure directories exist
    fs.ensureDirSync(this.workspaceDir);
    fs.ensureDirSync(this.deploymentsDir);
  }

  async deploy(config: DeploymentConfig): Promise<DeploymentResult> {
    const startTime = Date.now();
    const buildLogs: string[] = [];
    
    const log = (message: string) => {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ${message}`;
      buildLogs.push(logMessage);
      console.log(logMessage);
    };

    try {
      log('Starting deployment...');
      
      // Create unique workspace for this deployment
      const workspaceId = uuidv4();
      const workspacePath = path.join(this.workspaceDir, workspaceId);
      
      log(`Created workspace: ${workspaceId}`);
      
      // Clone repository
      await this.cloneRepository(config, workspacePath, log);
      
      // Build application using Docker
      const buildResult = await this.buildApplication(config, workspacePath, log);
      
      if (!buildResult.success) {
        throw new Error(buildResult.error || 'Build failed');
      }
      
      // Deploy built application
      const deploymentUrl = await this.deployApplication(config, workspacePath, log);
      
      // Cleanup workspace
      await fs.remove(workspacePath);
      log('Cleaned up workspace');
      
      const duration = Math.round((Date.now() - startTime) / 1000);
      log(`Deployment completed successfully in ${duration}s`);
      
      return {
        success: true,
        deploymentUrl,
        buildLogs,
        duration
      };
      
    } catch (error) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log(`Deployment failed: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
        buildLogs,
        duration
      };
    }
  }

  private async cloneRepository(
    config: DeploymentConfig,
    workspacePath: string,
    log: (message: string) => void
  ): Promise<void> {
    log(`Cloning repository: ${config.repository}`);
    
    const git = simpleGit();
    
    try {
      await git.clone(config.repository, workspacePath, [
        '--depth', '1',
        '--branch', config.branch || 'main'
      ]);
      
      if (config.commit) {
        const repoGit = simpleGit(workspacePath);
        await repoGit.checkout(config.commit);
        log(`Checked out commit: ${config.commit}`);
      }
      
      log('Repository cloned successfully');
    } catch (error) {
      throw new Error(`Failed to clone repository: ${error}`);
    }
  }

  private async buildApplication(
    config: DeploymentConfig,
    workspacePath: string,
    log: (message: string) => void
  ): Promise<{ success: boolean; error?: string }> {
    log('Building application...');
    
    try {
      // Create Dockerfile based on framework
      const dockerfile = this.generateDockerfile(config);
      const dockerfilePath = path.join(workspacePath, 'Dockerfile.build');
      await fs.writeFile(dockerfilePath, dockerfile);
      
      // Build Docker image
      const imageName = `vercel-clone-build-${config.id}`;
      log(`Building Docker image: ${imageName}`);
      
      const tarStream = tar.pack(workspacePath);
      const buildStream = await this.docker.buildImage(tarStream, {
        t: imageName,
        dockerfile: 'Dockerfile.build'
      });
      
      // Wait for build to complete
      await new Promise((resolve, reject) => {
        this.docker.modem.followProgress(buildStream, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }, (event) => {
          if (event.stream) {
            log(event.stream.trim());
          }
        });
      });
      
      // Extract built files from container
      const container = await this.docker.createContainer({
        Image: imageName,
        Cmd: ['echo', 'Build complete']
      });
      
      const outputPath = path.join(workspacePath, 'build-output');
      await fs.ensureDir(outputPath);
      
      // Copy built files from container
      const archive = await container.getArchive({
        path: `/app/${config.outputDirectory}`
      });
      
      const extractStream = tar.extract(outputPath);
      archive.pipe(extractStream);
      
      await new Promise((resolve, reject) => {
        extractStream.on('finish', resolve);
        extractStream.on('error', reject);
      });
      
      // Clean up container and image
      await container.remove();
      await this.docker.getImage(imageName).remove();
      
      log('Build completed successfully');
      return { success: true };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Build failed';
      return { success: false, error: errorMessage };
    }
  }

  private async deployApplication(
    config: DeploymentConfig,
    workspacePath: string,
    log: (message: string) => void
  ): Promise<string> {
    log('Deploying application...');
    
    const deploymentId = `${config.projectName}-${config.id}`;
    const deploymentPath = path.join(this.deploymentsDir, deploymentId);
    
    // Copy built files to deployment directory
    const buildOutputPath = path.join(workspacePath, 'build-output', config.outputDirectory);
    await fs.copy(buildOutputPath, deploymentPath);
    
    // Generate deployment URL
    const deploymentUrl = `https://${deploymentId}.vercel-clone.app`;
    
    log(`Application deployed to: ${deploymentUrl}`);
    return deploymentUrl;
  }

  private generateDockerfile(config: DeploymentConfig): string {
    const baseImages: Record<string, string> = {
      'react': 'node:18-alpine',
      'nextjs': 'node:18-alpine',
      'vue': 'node:18-alpine',
      'angular': 'node:18-alpine',
      'svelte': 'node:18-alpine',
      'static': 'nginx:alpine'
    };

    const baseImage = baseImages[config.framework] || 'node:18-alpine';
    
    if (config.framework === 'static') {
      return `
FROM ${baseImage}
WORKDIR /app
COPY . .
RUN mkdir -p /app/${config.outputDirectory}
      `.trim();
    }

    return `
FROM ${baseImage}

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN ${config.installCommand || 'npm install'}

# Copy source code
COPY . .

# Build application
RUN ${config.buildCommand || 'npm run build'}

# Ensure output directory exists
RUN mkdir -p /app/${config.outputDirectory}
    `.trim();
  }

  async getDeploymentLogs(deploymentId: string): Promise<string[]> {
    // In a real implementation, this would fetch logs from a database or log storage
    return [
      `[${new Date().toISOString()}] Deployment logs for ${deploymentId}`,
      `[${new Date().toISOString()}] This is a mock implementation`,
      `[${new Date().toISOString()}] In production, logs would be stored and retrieved from persistent storage`
    ];
  }

  async deleteDeployment(deploymentId: string): Promise<boolean> {
    try {
      const deploymentPath = path.join(this.deploymentsDir, deploymentId);
      await fs.remove(deploymentPath);
      return true;
    } catch (error) {
      console.error(`Failed to delete deployment ${deploymentId}:`, error);
      return false;
    }
  }
}