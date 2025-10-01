import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, GitBranch, Globe, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { projectsApi, Project } from '../services/api';

interface ProjectWithStatus extends Project {
  status: 'building' | 'ready' | 'error';
  lastDeployment: Date;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectsApi.getAll();
      const projectsData = response.data;
      
      // Fetch latest deployment for each project to get status
      const projectsWithStatus = await Promise.all(
        projectsData.map(async (project) => {
          try {
            const deploymentsResponse = await projectsApi.getDeployments(project.id);
            const deployments = deploymentsResponse.data;
            const latestDeployment = deployments[0]; // Deployments are sorted by creation date
            
            return {
              ...project,
              status: latestDeployment?.status || 'ready',
              lastDeployment: latestDeployment ? new Date(latestDeployment.createdAt) : new Date(project.createdAt)
            } as ProjectWithStatus;
          } catch (err) {
            // If we can't fetch deployments, use default values
            return {
              ...project,
              status: 'ready' as const,
              lastDeployment: new Date(project.createdAt)
            } as ProjectWithStatus;
          }
        })
      );
      
      setProjects(projectsWithStatus);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: ProjectWithStatus['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'building':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: ProjectWithStatus['status']) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'building':
        return 'Building';
      case 'error':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Vercel Clone</h1>
            </div>
            <Link
              to="/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Projects</h2>
            
            {loading ? (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading projects</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                  onClick={fetchProjects}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Try Again
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-500 mb-6">Get started by importing a Git repository.</p>
                <Link
                  to="/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Import Project
                </Link>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <Link
                        to={`/project/${project.id}`}
                        className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getStatusIcon(project.status)}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {project.name}
                                </p>
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {project.framework}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <GitBranch className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                <p className="truncate">{project.repository}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="flex flex-col items-end">
                              <div className="flex items-center">
                                <Globe className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                <span className="truncate">{project.domain}</span>
                              </div>
                              <div className="mt-1 flex items-center">
                                <span className="mr-2">{getStatusText(project.status)}</span>
                                <span>
                                  {formatDistanceToNow(project.lastDeployment, { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;