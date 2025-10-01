import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Globe, GitBranch, Clock, CheckCircle, XCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Deployment {
  id: string;
  status: 'building' | 'ready' | 'error';
  commit: string;
  branch: string;
  createdAt: Date;
  duration?: number;
  url: string;
}

interface Project {
  id: string;
  name: string;
  repository: string;
  domain: string;
  framework: string;
  deployments: Deployment[];
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [deploymentLogs, setDeploymentLogs] = useState<string>('');
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - will be replaced with API call
    setTimeout(() => {
      setProject({
        id: id!,
        name: 'my-awesome-app',
        repository: 'github.com/user/my-awesome-app',
        domain: 'my-awesome-app.vercel-clone.app',
        framework: 'React',
        deployments: [
          {
            id: '1',
            status: 'ready',
            commit: 'abc123f',
            branch: 'main',
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            duration: 45,
            url: 'https://my-awesome-app-abc123f.vercel-clone.app'
          },
          {
            id: '2',
            status: 'building',
            commit: 'def456g',
            branch: 'main',
            createdAt: new Date(Date.now() - 1000 * 60 * 5),
            url: 'https://my-awesome-app-def456g.vercel-clone.app'
          },
          {
            id: '3',
            status: 'error',
            commit: 'ghi789h',
            branch: 'feature/new-ui',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            duration: 23,
            url: 'https://my-awesome-app-ghi789h.vercel-clone.app'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusIcon = (status: Deployment['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'building':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: Deployment['status']) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'building':
        return 'Building';
      case 'error':
        return 'Failed';
    }
  };

  const handleRedeploy = (deploymentId: string) => {
    // Mock redeploy action
    console.log('Redeploying:', deploymentId);
  };

  const showLogs = (deploymentId: string) => {
    setSelectedDeployment(deploymentId);
    // Mock logs
    setDeploymentLogs(`
[2024-01-01 12:00:00] Starting deployment...
[2024-01-01 12:00:01] Cloning repository...
[2024-01-01 12:00:05] Installing dependencies...
[2024-01-01 12:00:15] Running build command: npm run build
[2024-01-01 12:00:30] Build completed successfully
[2024-01-01 12:00:31] Deploying to CDN...
[2024-01-01 12:00:45] Deployment completed successfully
[2024-01-01 12:00:45] Available at: https://my-awesome-app-abc123f.vercel-clone.app
    `.trim());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <GitBranch className="h-4 w-4 mr-1" />
                  <span>{project.repository}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={`https://${project.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Globe className="h-4 w-4 mr-2" />
                Visit
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deployments List */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Deployments</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {project.deployments.map((deployment) => (
                    <div key={deployment.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(deployment.status)}
                          <div className="ml-3">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {deployment.commit}
                              </p>
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {deployment.branch}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {getStatusText(deployment.status)} • {formatDistanceToNow(deployment.createdAt, { addSuffix: true })}
                              {deployment.duration && ` • ${deployment.duration}s`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => showLogs(deployment.id)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            View Logs
                          </button>
                          <button
                            onClick={() => handleRedeploy(deployment.id)}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Redeploy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Info & Logs */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Project Info</h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Framework</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.framework}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Domain</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.domain}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Repository</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.repository}</dd>
                  </div>
                </div>
              </div>

              {/* Deployment Logs */}
              {selectedDeployment && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Deployment Logs</h3>
                  </div>
                  <div className="px-6 py-4">
                    <pre className="text-xs text-gray-800 bg-gray-50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                      {deploymentLogs}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;