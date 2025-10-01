import { DeploymentEngine, DeploymentConfig } from './DeploymentEngine';

// Example usage
async function main() {
  const engine = new DeploymentEngine();
  
  const config: DeploymentConfig = {
    id: 'test-deployment-1',
    projectName: 'my-test-app',
    repository: 'https://github.com/facebook/create-react-app.git',
    branch: 'main',
    framework: 'react',
    buildCommand: 'npm run build',
    outputDirectory: 'build',
    installCommand: 'npm install',
    rootDirectory: '.'
  };
  
  console.log('Starting deployment...');
  const result = await engine.deploy(config);
  
  if (result.success) {
    console.log('✅ Deployment successful!');
    console.log(`🌐 URL: ${result.deploymentUrl}`);
    console.log(`⏱️  Duration: ${result.duration}s`);
  } else {
    console.log('❌ Deployment failed!');
    console.log(`💥 Error: ${result.error}`);
  }
  
  console.log('\n📋 Build logs:');
  result.buildLogs.forEach(log => console.log(log));
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { DeploymentEngine, DeploymentConfig };