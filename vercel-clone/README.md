# Vercel Clone

A full-featured deployment platform clone that allows you to deploy web applications with automatic builds, custom domains, and Git integration.

## ✨ Features

- 🚀 **Automatic Deployments** - Deploy from Git repositories with one click
- 🏗️ **Multi-Framework Support** - React, Next.js, Vue.js, Angular, Svelte, and static sites
- 🌐 **Custom Domains** - Automatic subdomain generation and custom domain support
- 📊 **Real-time Monitoring** - Live deployment status and build logs
- 🔄 **Git Integration** - Clone repositories and deploy specific commits/branches
- 🐳 **Containerized Builds** - Isolated Docker-based build environments
- ⚡ **Modern UI** - Clean, responsive dashboard inspired by Vercel
- 🔧 **RESTful API** - Complete API for programmatic access
- 📝 **Build Logs** - Detailed logging and error reporting
- 🔄 **Redeploy** - Easy redeployment of previous versions

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons
- **date-fns** for date formatting

### Backend Stack
- **Node.js** with Express and TypeScript
- **In-memory storage** (easily replaceable with PostgreSQL)
- **Docker integration** for build isolation
- **Simple Git** for repository operations
- **Comprehensive error handling**

### Infrastructure
- **Docker Compose** for development environment
- **Nginx** reverse proxy for routing
- **PostgreSQL** database (configured)
- **Redis** for caching (configured)
- **Multi-service architecture**

## 🚀 Quick Start

### Option 1: Development Mode (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd vercel-clone

# Install all dependencies
npm run install:all

# Start development servers
./start-dev.sh
# OR
npm run dev
```

This starts:
- Frontend dashboard at **http://localhost:3000**
- Backend API at **http://localhost:8000**
- Health check at **http://localhost:8000/health**

### Option 2: Docker Compose (Full Stack)

```bash
# Start all services with Docker
docker-compose up --build

# Or run in background
npm run docker:up
```

## 🎯 Usage

### Creating a New Project

1. Navigate to http://localhost:3000
2. Click "New Project"
3. Enter a Git repository URL (e.g., `https://github.com/facebook/create-react-app`)
4. Select framework preset (React, Next.js, Vue, etc.)
5. Configure build settings (optional)
6. Click "Deploy"

### Managing Projects

- **Dashboard**: View all projects with real-time status
- **Project Details**: See deployment history and logs
- **Redeploy**: Redeploy any previous version
- **Build Logs**: Monitor build progress and debug issues

### API Usage

```bash
# Get all projects
curl http://localhost:8000/api/projects

# Create new project
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-app",
    "repository": "https://github.com/user/repo",
    "framework": "react"
  }'

# Get project deployments
curl http://localhost:8000/api/projects/{id}/deployments
```

## 📁 Project Structure

```
vercel-clone/
├── frontend/              # React dashboard application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API integration
│   │   └── ...
│   ├── public/
│   └── package.json
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── models/        # Data models
│   │   └── middleware/    # Express middleware
│   └── package.json
├── deployment-engine/     # Docker-based deployment system
│   ├── src/
│   │   └── DeploymentEngine.ts
│   └── package.json
├── nginx/                 # Reverse proxy configuration
│   ├── nginx.conf
│   └── sites-enabled/
├── database/              # Database initialization
│   └── init.sql
├── docker-compose.yml     # Development environment
├── start-dev.sh          # Development startup script
└── DEMO.md               # Comprehensive demo guide
```

## 🎨 Screenshots & Demo

See [DEMO.md](./DEMO.md) for a complete demo guide with:
- Step-by-step walkthrough
- Feature demonstrations
- API testing examples
- Production deployment guide

## 🔧 Configuration

### Environment Variables

Backend (`.env`):
```env
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@localhost:5432/vercel_clone
JWT_SECRET=your-secret-key
DOCKER_HOST=unix:///var/run/docker.sock
```

Frontend (`.env`):
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Framework Support

The system automatically detects and supports:

| Framework | Build Command | Output Directory |
|-----------|---------------|------------------|
| React | `npm run build` | `build` |
| Next.js | `npm run build` | `.next` |
| Vue.js | `npm run build` | `dist` |
| Angular | `npm run build` | `dist` |
| Svelte | `npm run build` | `public` |
| Static | N/A | `.` |

## 🧪 Testing

### Manual Testing
1. Start the development environment
2. Create projects with different frameworks
3. Test deployment success/failure scenarios
4. Monitor real-time status updates

### API Testing
```bash
# Health check
curl http://localhost:8000/health

# Create and deploy project
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"test","repository":"https://github.com/facebook/create-react-app","framework":"react"}'
```

## 🚀 Production Deployment

For production use:

1. **Database Setup**: Configure PostgreSQL with real connection string
2. **Docker Configuration**: Set up Docker daemon for build isolation
3. **Domain Management**: Configure DNS and SSL certificates
4. **Authentication**: Implement user management system
5. **Scaling**: Add load balancing and auto-scaling
6. **Monitoring**: Set up logging and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Inspired by [Vercel](https://vercel.com)
- Built with modern web technologies
- Designed for educational and demonstration purposes

---

**Ready to deploy?** Start with `./start-dev.sh` and visit http://localhost:3000! 🚀