const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const { getDeploymentById } = require('./lib/db.cjs');
const { buildDeployment } = require('./lib/build.cjs');

const projectsRouter = require('./routes/projects.cjs');
const deploymentsRouterFactory = require('./routes/deployments.cjs');

const PORT = process.env.PORT || 4000;

// Ensure data directories exist
const dataDir = path.join(__dirname, '..', 'data');
const buildsDir = path.join(dataDir, 'builds');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(buildsDir)) fs.mkdirSync(buildsDir, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serverless runtime: handle function calls before static
app.all('/d/:id/api/*', async (req, res) => {
  try {
    const deploymentId = req.params.id;
    const deployment = getDeploymentById(deploymentId);
    if (!deployment || deployment.status !== 'ready') {
      return res.status(404).json({ error: 'Deployment not found or not ready' });
    }

    const functionsDir = deployment.functionsDir;
    if (!functionsDir || !fs.existsSync(functionsDir)) {
      return res.status(404).json({ error: 'No functions directory for this deployment' });
    }

    const wildcardPath = req.params[0] || '';
    const candidateFiles = [];
    const noSlash = wildcardPath.replace(/^\//, '');
    const asJs = path.join(functionsDir, noSlash.endsWith('.js') ? noSlash : `${noSlash}.js`);
    candidateFiles.push(asJs);
    const asIndex = path.join(functionsDir, noSlash, 'index.js');
    candidateFiles.push(asIndex);

    const targetFile = candidateFiles.find((p) => fs.existsSync(p));
    if (!targetFile) {
      return res.status(404).json({ error: 'Function not found' });
    }

    delete require.cache[require.resolve(targetFile)];
    const mod = require(targetFile);
    const handler = typeof mod === 'function' ? mod : mod.handler;
    if (typeof handler !== 'function') {
      return res.status(500).json({ error: 'Exported handler is not a function' });
    }

    const result = await handler(req, res);
    if (!res.headersSent && typeof result !== 'undefined') {
      res.json(result);
    }
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Function execution error', details: String(err && err.message ? err.message : err) });
    }
  }
});

// Static file serving for deployments under /d/:id/*
const staticMiddlewareCache = new Map();
app.use('/d/:id', (req, res, next) => {
  const deploymentId = req.params.id;
  const deployment = getDeploymentById(deploymentId);
  if (!deployment || deployment.status !== 'ready') {
    return res.status(404).send('Deployment not found');
  }
  const serveDir = deployment.serveDir;
  if (!serveDir || !fs.existsSync(serveDir)) {
    return res.status(404).send('Deployment assets not found');
  }

  let mw = staticMiddlewareCache.get(deploymentId);
  if (!mw || mw.serveDir !== serveDir) {
    const staticMw = express.static(serveDir, { fallthrough: true, extensions: ['html'] });
    mw = (req2, res2, next2) => staticMw(req2, res2, next2);
    mw.serveDir = serveDir;
    staticMiddlewareCache.set(deploymentId, mw);
  }
  return mw(req, res, next);
});

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/deployments', deploymentsRouterFactory(buildDeployment));

// Dashboard static
app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`mini-vercel server listening on http://localhost:${PORT}`);
});

