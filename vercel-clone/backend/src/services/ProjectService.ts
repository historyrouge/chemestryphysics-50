import { v4 as uuidv4 } from 'uuid';
import { Project, CreateProjectRequest, Deployment } from '../models/Project';

// In-memory storage for demo purposes
// In production, this would be replaced with a proper database
class ProjectService {
  private projects: Map<string, Project> = new Map();
  private deployments: Map<string, Deployment> = new Map();

  constructor() {
    // Initialize with some mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockProject: Project = {
      id: '1',
      name: 'my-awesome-app',
      repository: 'https://github.com/user/my-awesome-app',
      domain: 'my-awesome-app.vercel-clone.app',
      framework: 'react',
      buildCommand: 'npm run build',
      outputDirectory: 'build',
      installCommand: 'npm install',
      rootDirectory: '.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      updatedAt: new Date()
    };

    this.projects.set(mockProject.id, mockProject);

    // Mock deployments
    const mockDeployments: Deployment[] = [
      {
        id: '1',
        projectId: '1',
        status: 'ready',
        commit: 'abc123f',
        branch: 'main',
        url: 'https://my-awesome-app-abc123f.vercel-clone.app',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        completedAt: new Date(Date.now() - 1000 * 60 * 29),
        duration: 45
      },
      {
        id: '2',
        projectId: '1',
        status: 'building',
        commit: 'def456g',
        branch: 'main',
        url: 'https://my-awesome-app-def456g.vercel-clone.app',
        createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      },
      {
        id: '3',
        projectId: '1',
        status: 'error',
        commit: 'ghi789h',
        branch: 'feature/new-ui',
        url: 'https://my-awesome-app-ghi789h.vercel-clone.app',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 23),
        duration: 23,
        buildLogs: 'Build failed: Module not found'
      }
    ];

    mockDeployments.forEach(deployment => {
      this.deployments.set(deployment.id, deployment);
    });
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const project: Project = {
      id: uuidv4(),
      name: data.name,
      repository: data.repository,
      domain: `${data.name}.vercel-clone.app`,
      framework: data.framework,
      buildCommand: data.buildCommand || this.getDefaultBuildCommand(data.framework),
      outputDirectory: data.outputDirectory || this.getDefaultOutputDirectory(data.framework),
      installCommand: data.installCommand || 'npm install',
      rootDirectory: data.rootDirectory || '.',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const project = this.projects.get(id);
    if (!project) return null;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date()
    };

    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getProjectDeployments(projectId: string): Promise<Deployment[]> {
    return Array.from(this.deployments.values())
      .filter(deployment => deployment.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getDeploymentById(id: string): Promise<Deployment | null> {
    return this.deployments.get(id) || null;
  }

  async createDeployment(projectId: string, commit?: string, branch?: string): Promise<Deployment> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const deployment: Deployment = {
      id: uuidv4(),
      projectId,
      status: 'queued',
      commit: commit || 'latest',
      branch: branch || 'main',
      url: `https://${project.name}-${commit || 'latest'}.vercel-clone.app`,
      createdAt: new Date()
    };

    this.deployments.set(deployment.id, deployment);

    // Simulate deployment process
    this.simulateDeployment(deployment.id);

    return deployment;
  }

  private async simulateDeployment(deploymentId: string) {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return;

    // Update to building
    deployment.status = 'building';
    this.deployments.set(deploymentId, deployment);

    // Simulate build time (5-30 seconds)
    const buildTime = Math.random() * 25000 + 5000;
    
    setTimeout(() => {
      const finalDeployment = this.deployments.get(deploymentId);
      if (!finalDeployment) return;

      // 90% success rate
      const success = Math.random() > 0.1;
      
      finalDeployment.status = success ? 'ready' : 'error';
      finalDeployment.completedAt = new Date();
      finalDeployment.duration = Math.round(buildTime / 1000);
      
      if (!success) {
        finalDeployment.buildLogs = 'Build failed: Simulated error for demo purposes';
      }

      this.deployments.set(deploymentId, finalDeployment);
    }, buildTime);
  }

  private getDefaultBuildCommand(framework: string): string {
    const commands: Record<string, string> = {
      'react': 'npm run build',
      'nextjs': 'npm run build',
      'vue': 'npm run build',
      'angular': 'npm run build',
      'svelte': 'npm run build',
      'static': ''
    };
    return commands[framework] || 'npm run build';
  }

  private getDefaultOutputDirectory(framework: string): string {
    const directories: Record<string, string> = {
      'react': 'build',
      'nextjs': '.next',
      'vue': 'dist',
      'angular': 'dist',
      'svelte': 'public',
      'static': '.'
    };
    return directories[framework] || 'build';
  }
}

export default new ProjectService();