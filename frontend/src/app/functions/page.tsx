'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Code, Play, Settings, Trash2, Clock, Activity } from 'lucide-react'
import toast from 'react-hot-toast'

interface Function {
  id: string
  name: string
  code: string
  runtime: string
  description: string
  status: 'active' | 'inactive'
  url: string
  createdAt: string
  lastModified: string
  invocations: number
}

export default function FunctionsPage() {
  const [functions, setFunctions] = useState<Function[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewFunction, setShowNewFunction] = useState(false)
  const [editingFunction, setEditingFunction] = useState<Function | null>(null)
  const [newFunction, setNewFunction] = useState({
    name: '',
    code: `// Example serverless function
module.exports = (req, res) => {
  res.json({
    message: 'Hello from serverless function!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};`,
    runtime: 'nodejs18.x',
    description: ''
  })

  useEffect(() => {
    loadFunctions()
  }, [])

  const loadFunctions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/functions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFunctions(data)
      }
    } catch (error) {
      console.error('Error loading functions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateFunction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFunction.name.trim()) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/functions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFunction)
      })

      if (response.ok) {
        const data = await response.json()
        setFunctions([data, ...functions])
        setNewFunction({
          name: '',
          code: `module.exports = (req, res) => {
  res.json({ message: 'Hello World!' });
};`,
          runtime: 'nodejs18.x',
          description: ''
        })
        setShowNewFunction(false)
        toast.success('Function created successfully!')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create function')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleInvokeFunction = async (func: Function) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/functions/${func.id}/invoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Function executed successfully!')
        console.log('Function result:', data)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Function execution failed')
      }
    } catch (error) {
      toast.error('An error occurred while executing the function')
    }
  }

  const handleDeleteFunction = async (func: Function) => {
    if (!confirm('Are you sure you want to delete this function?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/functions/${func.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setFunctions(functions.filter(f => f.id !== func.id))
        toast.success('Function deleted successfully!')
      } else {
        toast.error('Failed to delete function')
      }
    } catch (error) {
      toast.error('An error occurred while deleting the function')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading functions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Serverless Functions</h1>
              <p className="text-gray-600 mt-1">Create and manage serverless functions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewFunction(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Function
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Functions Grid */}
        {functions.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No functions yet</h3>
            <p className="text-gray-600 mb-6">Create your first serverless function</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewFunction(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Function
            </motion.button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {functions.map((func) => (
              <motion.div
                key={func.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{func.name}</h3>
                    <p className="text-sm text-gray-500">{func.runtime}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      func.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {func.status}
                    </span>
                  </div>
                </div>

                {func.description && (
                  <p className="text-sm text-gray-600 mb-4">{func.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Activity className="w-4 h-4 mr-2" />
                    {func.invocations} invocations
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Modified: {new Date(func.lastModified).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleInvokeFunction(func)}
                    className="btn btn-primary flex-1 text-center"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </button>
                  <button
                    onClick={() => setEditingFunction(func)}
                    className="btn btn-secondary"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFunction(func)}
                    className="btn btn-secondary text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New Function Modal */}
      {showNewFunction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewFunction(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Function</h3>
            <form onSubmit={handleCreateFunction}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Function Name
                  </label>
                  <input
                    type="text"
                    value={newFunction.name}
                    onChange={(e) => setNewFunction({...newFunction, name: e.target.value})}
                    className="input"
                    placeholder="my-function"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Runtime
                  </label>
                  <select
                    value={newFunction.runtime}
                    onChange={(e) => setNewFunction({...newFunction, runtime: e.target.value})}
                    className="input"
                  >
                    <option value="nodejs18.x">Node.js 18.x</option>
                    <option value="nodejs16.x">Node.js 16.x</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newFunction.description}
                    onChange={(e) => setNewFunction({...newFunction, description: e.target.value})}
                    className="input"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Function Code
                  </label>
                  <textarea
                    value={newFunction.code}
                    onChange={(e) => setNewFunction({...newFunction, code: e.target.value})}
                    className="input font-mono text-sm"
                    rows={12}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewFunction(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Function
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}