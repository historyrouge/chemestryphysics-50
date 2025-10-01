import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitBranch, Globe, Settings, Loader2 } from 'lucide-react';
import { projectsApi, CreateProjectRequest } from '../services/api';

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    repository: '',
    name: '',
    framework: 'react',
    buildCommand: '',
    outputDirectory: '',
    installCommand: '',
    rootDirectory: '.',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frameworks = [
    { id: 'react', name: 'React', buildCommand: 'npm run build', outputDirectory: 'build' },
    { id: 'nextjs', name: 'Next.js', buildCommand: 'npm run build', outputDirectory: '.next' },
    { id: 'vue', name: 'Vue.js', buildCommand: 'npm run build', outputDirectory: 'dist' },
    { id: 'angular', name: 'Angular', buildCommand: 'npm run build', outputDirectory: 'dist' },
    { id: 'svelte', name: 'Svelte', buildCommand: 'npm run build', outputDirectory: 'public' },
    { id: 'static', name: 'Static HTML', buildCommand: '', outputDirectory: '.' },
  ];

  const handleFrameworkChange = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    if (framework) {
      setFormData({
        ...formData,
        framework: frameworkId,
        buildCommand: framework.buildCommand,
        outputDirectory: framework.outputDirectory,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const projectData: CreateProjectRequest = {
        name: formData.name,
        repository: formData.repository,
        framework: formData.framework,
        buildCommand: formData.buildCommand || undefined,
        outputDirectory: formData.outputDirectory || undefined,
        installCommand: formData.installCommand || undefined,
        rootDirectory: formData.rootDirectory || undefined,
      };
      
      const response = await projectsApi.create(projectData);
      
      // Navigate to the project detail page
      navigate(`/project/${response.data.project.id}`);
    } catch (err: any) {
      console.error('Failed to create project:', err);
      setError(err.response?.data?.error || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              to="/"
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Import Git Repository</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Repository */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <GitBranch className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Repository</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="repository" className="block text-sm font-medium text-gray-700">
                    Git Repository URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      name="repository"
                      id="repository"
                      required
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://github.com/username/repository"
                      value={formData.repository}
                      onChange={(e) => setFormData({ ...formData, repository: e.target.value })}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    The Git repository that contains your project's source code.
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="my-awesome-project"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Your project will be available at {formData.name || 'project-name'}.vercel-clone.app
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Framework */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Settings className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Framework Preset</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {frameworks.map((framework) => (
                  <div
                    key={framework.id}
                    className={`relative rounded-lg border p-4 cursor-pointer hover:border-primary-500 ${
                      formData.framework === framework.id
                        ? 'border-primary-500 ring-2 ring-primary-500'
                        : 'border-gray-300'
                    }`}
                    onClick={() => handleFrameworkChange(framework.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="framework"
                        value={framework.id}
                        checked={formData.framework === framework.id}
                        onChange={() => handleFrameworkChange(framework.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        {framework.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Build Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Globe className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Build and Output Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="buildCommand" className="block text-sm font-medium text-gray-700">
                      Build Command
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="buildCommand"
                        id="buildCommand"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="npm run build"
                        value={formData.buildCommand}
                        onChange={(e) => setFormData({ ...formData, buildCommand: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="outputDirectory" className="block text-sm font-medium text-gray-700">
                      Output Directory
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="outputDirectory"
                        id="outputDirectory"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="build"
                        value={formData.outputDirectory}
                        onChange={(e) => setFormData({ ...formData, outputDirectory: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="installCommand" className="block text-sm font-medium text-gray-700">
                      Install Command
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="installCommand"
                        id="installCommand"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="npm install"
                        value={formData.installCommand}
                        onChange={(e) => setFormData({ ...formData, installCommand: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rootDirectory" className="block text-sm font-medium text-gray-700">
                      Root Directory
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="rootDirectory"
                        id="rootDirectory"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="."
                        value={formData.rootDirectory}
                        onChange={(e) => setFormData({ ...formData, rootDirectory: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Deploy'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewProject;