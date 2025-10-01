export interface Project {
  id: string;
  name: string;
  repository: string;
  domain: string;
  framework: string;
  buildCommand: string;
  outputDirectory: string;
  installCommand: string;
  rootDirectory: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectRequest {
  name: string;
  repository: string;
  framework: string;
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  rootDirectory?: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  status: 'queued' | 'building' | 'ready' | 'error';
  commit: string;
  branch: string;
  url: string;
  buildLogs?: string;
  createdAt: Date;
  completedAt?: Date;
  duration?: number;
}

export interface CreateDeploymentRequest {
  projectId: string;
  commit?: string;
  branch?: string;
}