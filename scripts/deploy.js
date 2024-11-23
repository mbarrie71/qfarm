const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));
const version = packageJson.version;

// Set environment variables
process.env.VITE_RELEASE_VERSION = version;

console.log('Starting deployment process...');

try {
  // Run tests
  console.log('Running tests...');
  execSync('npm run test', { stdio: 'inherit' });

  // Run linting
  console.log('Running linter...');
  execSync('npm run lint', { stdio: 'inherit' });

  // Build the application
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify the build
  if (!fs.existsSync(path.join(__dirname, '../dist'))) {
    throw new Error('Build failed - dist directory not found');
  }

  // Deploy to Netlify (if netlify-cli is installed)
  console.log('Deploying to Netlify...');
  execSync('netlify deploy --prod', { stdio: 'inherit' });

  console.log(`🚀 Deployment successful! Version: ${version}`);
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
