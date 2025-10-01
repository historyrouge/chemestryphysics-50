import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token (future use)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
  createdAt: string;
  updatedAt: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  status: 'queued' | 'building' | 'ready' | 'error';
  commit: string;
  branch: string;
  url: string;
  buildLogs?: string;
  createdAt: string;
  completedAt?: string;
  duration?: number;
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

// Project API
export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: CreateProjectRequest) => api.post<{ project: Project; deployment: Deployment }>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  getDeployments: (id: string) => api.get<Deployment[]>(`/projects/${id}/deployments`),
  createDeployment: (id: string, data?: { commit?: string; branch?: string }) => 
    api.post<Deployment>(`/projects/${id}/deployments`, data),
};

// Deployment API
export const deploymentsApi = {
  getById: (id: string) => api.get<Deployment>(`/deployments/${id}`),
  getLogs: (id: string) => api.get<{ logs: string }>(`/deployments/${id}/logs`),
  redeploy: (id: string) => api.post<Deployment>(`/deployments/${id}/redeploy`),
};

export default api;