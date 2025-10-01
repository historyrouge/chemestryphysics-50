'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Globe, Shield, Code, Upload } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Vercel Clone</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Deploy Your
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Projects
              </span>
              Instantly
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The fastest way to deploy your static sites and serverless functions. 
              Built for developers, by developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/signup" className="btn btn-primary text-lg px-8 py-4 inline-flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/dashboard" className="btn btn-secondary text-lg px-8 py-4">
                  View Dashboard
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to deploy
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features that make deployment effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-primary-600" />,
                title: "Lightning Fast",
                description: "Deploy in seconds with our optimized build pipeline and global CDN."
              },
              {
                icon: <Globe className="w-8 h-8 text-primary-600" />,
                title: "Global Edge",
                description: "Your sites are served from 100+ locations worldwide for maximum speed."
              },
              {
                icon: <Shield className="w-8 h-8 text-primary-600" />,
                title: "Secure by Default",
                description: "Automatic HTTPS, DDoS protection, and enterprise-grade security."
              },
              {
                icon: <Code className="w-8 h-8 text-primary-600" />,
                title: "Serverless Functions",
                description: "Build and deploy serverless functions with zero configuration."
              },
              {
                icon: <Upload className="w-8 h-8 text-primary-600" />,
                title: "Git Integration",
                description: "Connect your Git repository for automatic deployments on every push."
              },
              {
                icon: <Globe className="w-8 h-8 text-primary-600" />,
                title: "Custom Domains",
                description: "Use your own domain with automatic SSL certificates."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to deploy?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who trust our platform for their deployments.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/signup" className="btn btn-primary text-lg px-8 py-4 inline-flex items-center">
              Start Deploying Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Vercel Clone</span>
            </div>
            <p className="text-gray-600">
              © 2024 Vercel Clone. Built with Next.js and ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}