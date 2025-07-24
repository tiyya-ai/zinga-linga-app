$content = Get-Content "src\components\ImprovedAdminDashboard.tsx" -Raw

# Add the onRefresh prop
$content = $content -replace "setSortOrder=\{setSortOrder\}\s*/>", "setSortOrder={setSortOrder}`n              onRefresh={loadData}`n            />"

Set-Content "src\components\ImprovedAdminDashboard.tsx" -Value $content