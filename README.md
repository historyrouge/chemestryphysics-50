# Vercel Clone

A modern deployment platform for static sites and serverless functions, inspired by Vercel. Built with Next.js, Node.js, and Express.

## Features

- 🚀 **Instant Deployments** - Deploy your projects in seconds
- 🌐 **Global CDN** - Fast content delivery worldwide
- 🔒 **Secure by Default** - Automatic HTTPS and security headers
- ⚡ **Serverless Functions** - Deploy and scale serverless functions
- 📱 **Modern UI** - Beautiful, responsive dashboard
- 🔐 **Authentication** - Secure user authentication and authorization
- 📊 **Analytics** - Track your deployments and performance
- 🎯 **Custom Domains** - Use your own domain names
- 🔄 **Git Integration** - Automatic deployments from Git repositories

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vercel-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

### Project Structure

```
vercel-clone/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── dashboard/   # Dashboard pages
│   │   │   ├── login/       # Authentication pages
│   │   │   └── signup/
│   │   └── components/      # Reusable components
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   │   ├── auth.js      # Authentication routes
│   │   │   ├── projects.js  # Project management
│   │   │   └── deployments.js # Deployment management
│   │   └── index.js         # Main server file
│   ├── uploads/             # File upload storage
│   ├── deployments/         # Deployed project files
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/upload` - Upload project files
- `GET /api/projects/:id/download` - Download project as ZIP

### Deployments
- `GET /api/deployments` - Get user deployments
- `POST /api/deployments` - Create new deployment
- `GET /api/deployments/:id` - Get deployment details
- `GET /api/deployments/:id/logs` - Get deployment logs
- `POST /api/deployments/:id/cancel` - Cancel deployment
- `POST /api/deployments/:id/redeploy` - Redeploy project
- `DELETE /api/deployments/:id` - Delete deployment

## Usage

1. **Sign Up** - Create a new account
2. **Create Project** - Add a new project to your dashboard
3. **Upload Files** - Upload your project files
4. **Deploy** - Deploy your project with one click
5. **Monitor** - Track deployment status and logs
6. **Share** - Get a public URL for your deployed project

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Connect your repository
2. Set environment variables
3. Deploy with one click

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend
- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real file storage (AWS S3/Cloudinary)
- [ ] Git integration (GitHub/GitLab)
- [ ] Custom domain support
- [ ] SSL certificate automation
- [ ] Analytics dashboard
- [ ] Team collaboration
- [ ] Environment variables management
- [ ] Serverless functions support
- [ ] Edge functions
- [ ] Performance monitoring
- [ ] Error tracking
- [ ] CI/CD pipelines

## Support

For support, email support@vercel-clone.com or create an issue on GitHub.

---

Built with ❤️ using Next.js and Node.js