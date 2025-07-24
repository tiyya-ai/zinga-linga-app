const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ImprovedAdminDashboard.tsx');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Add the import
if (!content.includes('ReportsPage')) {
  content = content.replace(
    "import { AnalyticsDashboard } from './AnalyticsDashboard';",
    "import { AnalyticsDashboard } from './AnalyticsDashboard';\nimport { ReportsPage } from './ReportsPage';"
  );
}

// Add the reports section
const reportsSection = `
          {/* Reports Page */}
          {activeTab === 'reports' && (
            <ReportsPage
              users={users}
              purchases={purchases}
              modules={modules}
              onRefresh={loadData}
            />
          )}
`;

// Insert before the analytics section
content = content.replace(
  '          {/* Analytics Dashboard */}',
  reportsSection + '          {/* Analytics Dashboard */}'
);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Reports page added successfully!');