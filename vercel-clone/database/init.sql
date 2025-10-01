-- Vercel Clone Database Schema

-- Users table (for future authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    repository VARCHAR(500) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    framework VARCHAR(50) NOT NULL,
    build_command VARCHAR(500),
    output_directory VARCHAR(255),
    install_command VARCHAR(500),
    root_directory VARCHAR(255) DEFAULT '.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deployments table
CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'queued',
    commit VARCHAR(255),
    branch VARCHAR(255) DEFAULT 'main',
    url VARCHAR(500) NOT NULL,
    build_logs TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER -- in seconds
);

-- Environment variables table
CREATE TABLE environment_variables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    is_secret BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, key)
);

-- Domains table (for custom domains)
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    domain VARCHAR(255) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Build logs table (for detailed logging)
CREATE TABLE build_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id UUID REFERENCES deployments(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level VARCHAR(20) DEFAULT 'info',
    message TEXT NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_name ON projects(name);
CREATE INDEX idx_deployments_project_id ON deployments(project_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_created_at ON deployments(created_at DESC);
CREATE INDEX idx_environment_variables_project_id ON environment_variables(project_id);
CREATE INDEX idx_domains_project_id ON domains(project_id);
CREATE INDEX idx_build_logs_deployment_id ON build_logs(deployment_id);
CREATE INDEX idx_build_logs_timestamp ON build_logs(timestamp DESC);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_environment_variables_updated_at BEFORE UPDATE ON environment_variables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO users (id, email, password_hash, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'demo@vercel-clone.app', '$2b$10$example', 'Demo User');

INSERT INTO projects (id, user_id, name, repository, domain, framework, build_command, output_directory) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'my-awesome-app', 'https://github.com/user/my-awesome-app', 'my-awesome-app.vercel-clone.app', 'react', 'npm run build', 'build');

INSERT INTO deployments (id, project_id, status, commit, branch, url, created_at, completed_at, duration) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'ready', 'abc123f', 'main', 'https://my-awesome-app-abc123f.vercel-clone.app', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '29 minutes', 45),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'building', 'def456g', 'main', 'https://my-awesome-app-def456g.vercel-clone.app', NOW() - INTERVAL '5 minutes', NULL, NULL),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'error', 'ghi789h', 'feature/new-ui', 'https://my-awesome-app-ghi789h.vercel-clone.app', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '23 seconds', 23);