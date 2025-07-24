$content = Get-Content "src\components\ImprovedAdminDashboard.tsx" -Raw

# Add the import
$content = $content -replace "import { dataStore } from '../utils/dataStore';", "import { dataStore } from '../utils/dataStore';`nimport { ProfessionalOrderManagement } from './ProfessionalOrderManagement';"

# Find and replace the purchases section - using a simpler approach
$startPattern = "{/\* Purchases Tab \*/}"
$endPattern = "}\s*\)\s*}\s*{/\* Analytics Tab \*/}"

if ($content -match "(?s)$startPattern.*?$endPattern") {
    $newSection = @"
{/* Purchases Tab - Professional Order Management */}
          {activeTab === 'purchases' && (
            <ProfessionalOrderManagement
              purchases={purchases}
              users={users}
              modules={modules}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          )}

          {/* Analytics Tab */}
"@
    
    $content = $content -replace "(?s)$startPattern.*?$endPattern", $newSection
}

Set-Content "src\components\ImprovedAdminDashboard.tsx" -Value $content