const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ImprovedAdminDashboard.tsx');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Add the import
if (!content.includes('SystemPage')) {
  content = content.replace(
    "import { ReportsPage } from './ReportsPage';",
    "import { ReportsPage } from './ReportsPage';\nimport { SystemPage } from './SystemPage';"
  );
}

// Add the system section
const systemSection = `
          {/* System Page */}
          {activeTab === 'system' && (
            <SystemPage
              users={users}
              purchases={purchases}
              modules={modules}
              onRefresh={loadData}
            />
          )}
`;

// Insert before the reports section
content = content.replace(
  '          {/* Reports Page */}',
  systemSection + '          {/* Reports Page */}'
);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('System page added successfully!');