const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ImprovedAdminDashboard.tsx');

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Add the import for sample data
if (!content.includes('loadSampleAnalyticsData')) {
  content = content.replace(
    "import { AnalyticsDashboard } from './AnalyticsDashboard';",
    "import { AnalyticsDashboard } from './AnalyticsDashboard';\nimport { loadSampleAnalyticsData } from '../utils/loadSampleData';"
  );
}

// Update the loadData function to include sample data loading
const oldLoadData = `  // Load data from storage
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = dataStore.loadData();
      setUsers(data.users);
      setModules(data.modules);
      setPurchases(data.purchases);`;

const newLoadData = `  // Load data from storage
  const loadData = async () => {
    setIsLoading(true);
    try {
      let data = dataStore.loadData();
      
      // If no data exists, load sample data for analytics
      if (data.users.length <= 1 && data.purchases.length === 0) {
        data = loadSampleAnalyticsData();
      }
      
      setUsers(data.users);
      setModules(data.modules);
      setPurchases(data.purchases);`;

content = content.replace(oldLoadData, newLoadData);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Sample data loading added to admin dashboard!');