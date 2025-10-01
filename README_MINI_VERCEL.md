## mini-vercel (MVP)

An educational, minimal Vercel-like PaaS that can:

- Create projects from a Git URL
- Trigger deployments that clone the repo, install deps, run build
- Serve the built static site at `/d/:deploymentId`
- Route serverless-like functions at `/d/:deploymentId/api/*` to `api/*.js`
- Minimal dashboard at `/` to manage and deploy

### Quickstart

1) Install deps
```bash
npm install
```

2) Start server
```bash
npm run dev
```

Open `http://localhost:3000`.

### API Overview

- `GET /api/projects` → list projects
- `POST /api/projects` `{ name, repoUrl }` → create project
- `GET /api/deployments` → list deployments
- `POST /api/deployments` `{ projectId }` → trigger deployment

### Build & Output Detection

- Clones repo into `data/builds/<deploymentId>`
- If `package.json` exists: runs `npm ci` (fallback `npm install`), then `npm run build` if present
- Serves first found of: `dist`, `.vercel/output/static`, `out`, `build`, `public`, else repo root
- Functions resolved from `api/*.js` (repo root or output dir)

Function signature:
```js
// api/hello.js
module.exports = async (req, res) => {
  return { hello: 'world' };
};
```

Call: `/d/<deploymentId>/api/hello`.

### Notes & Limitations

- JSON file store at `data/db.json` (no concurrency control)
- No auth, no isolation, runs builds on same host
- Only Node.js serverless functions
- For private repos, configure your environment SSH/HTTPS access

### License

MIT
