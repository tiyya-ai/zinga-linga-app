const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Add the missing import
if (!content.includes('RealUserDashboard')) {
  content = content.replace(
    "import { ImprovedAdminDashboard } from './components/ImprovedAdminDashboard';",
    "import { ImprovedAdminDashboard } from './components/ImprovedAdminDashboard';\nimport { RealUserDashboard } from './components/RealUserDashboard';"
  );
}

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('App.tsx fixed with RealUserDashboard import!');