const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ImprovedAdminDashboard.tsx');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Add the import
if (!content.includes('AnalyticsDashboard')) {
  content = content.replace(
    "import { ProfessionalOrderManagement } from './ProfessionalOrderManagement';",
    "import { ProfessionalOrderManagement } from './ProfessionalOrderManagement';\nimport { AnalyticsDashboard } from './AnalyticsDashboard';"
  );
}

// Add the analytics section
const analyticsSection = `
          {/* Analytics Dashboard */}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              users={users}
              purchases={purchases}
              modules={modules}
              onRefresh={loadData}
            />
          )}
`;

// Insert before the closing main tag
content = content.replace(
  '          {/* Other tabs remain the same... */}',
  analyticsSection + '          {/* Other tabs remain the same... */}'
);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Analytics dashboard added successfully!');