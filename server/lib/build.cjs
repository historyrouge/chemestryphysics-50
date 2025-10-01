const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const simpleGit = require('simple-git');
const { updateDeployment, getProjectById } = require('./db.cjs');

const buildsRoot = path.join(__dirname, '..', '..', 'data', 'builds');
if (!fs.existsSync(buildsRoot)) fs.mkdirSync(buildsRoot, { recursive: true });

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: options.cwd, env: { ...process.env, ...options.env }, stdio: 'inherit', shell: true });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch (_) {
    return false;
  }
}

async function buildDeployment(deployment) {
  const project = getProjectById(deployment.projectId);
  if (!project) {
    updateDeployment(deployment.id, { status: 'failed', error: 'Project not found' });
    return;
  }

  const targetDir = path.join(buildsRoot, deployment.id);
  try {
    updateDeployment(deployment.id, { status: 'building', startedAt: new Date().toISOString() });

    if (fileExists(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    await simpleGit().clone(project.repoUrl, targetDir, ['--depth', '1']);

    const pkgPath = path.join(targetDir, 'package.json');
    let pkg = null;
    if (fileExists(pkgPath)) {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      try {
        await run('npm', ['ci'], { cwd: targetDir, env: {} });
      } catch (_) {
        await run('npm', ['install'], { cwd: targetDir, env: {} });
      }
      if (pkg.scripts && pkg.scripts.build) {
        await run('npm', ['run', 'build'], { cwd: targetDir, env: {} });
      }
    }

    const candidates = ['dist', '.vercel/output/static', 'out', 'build', 'public'];
    const serveDir = candidates.map((c) => path.join(targetDir, c)).find((p) => fileExists(p));
    const finalServeDir = serveDir || targetDir;

    const functionsDirCandidates = [path.join(targetDir, 'api'), path.join(finalServeDir, 'api')];
    const functionsDir = functionsDirCandidates.find((p) => fileExists(p));

    updateDeployment(deployment.id, {
      status: 'ready',
      readyAt: new Date().toISOString(),
      serveDir: finalServeDir,
      functionsDir: functionsDir || null,
    });
  } catch (err) {
    updateDeployment(deployment.id, { status: 'failed', error: String(err && err.message ? err.message : err) });
  }
}

module.exports = { buildDeployment };

